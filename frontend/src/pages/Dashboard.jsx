import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Radar, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/Sidebar";
import { StatsCards } from "@/components/StatsCards";
import { ControlPanel } from "@/components/ControlPanel";
import { SellersTable } from "@/components/SellersTable";
import { ActivityLog } from "@/components/ActivityLog";
import { FiltersPanel } from "@/components/FiltersPanel";
import { AnalyticsPanel } from "@/components/AnalyticsPanel";
import { SellerDetailDrawer } from "@/components/SellerDetailDrawer";
import { ReviewQueue } from "@/components/ReviewQueue";
import { SavedViews } from "@/components/SavedViews";
import SettingsPage from "@/pages/SettingsPage";
import * as api from "@/lib/api";

export default function Dashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [totalSellers, setTotalSellers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [activityLog, setActivityLog] = useState([]);
  const [workerStatus, setWorkerStatus] = useState({ is_running: false });
  const [settings, setSettings] = useState(null);
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [latestSession, setLatestSession] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [savedViews, setSavedViews] = useState([]);
  const searchTimeoutRef = useRef(null);

  const fetchStats = useCallback(async () => { try { const r = await api.getStats(); setStats(r.data); } catch {} }, []);
  const fetchSellers = useCallback(async () => {
    try {
      const params = { page: currentPage, limit: 20, ...filters };
      if (searchQuery) params.search = searchQuery;
      const r = await api.getSellers(params);
      setSellers(r.data.sellers); setTotalSellers(r.data.total); setTotalPages(r.data.total_pages);
    } catch {}
  }, [currentPage, filters, searchQuery]);
  const fetchActivityLog = useCallback(async () => { try { const r = await api.getActivityLog({ limit: 150 }); setActivityLog(r.data.entries); } catch {} }, []);
  const fetchWorkerStatus = useCallback(async () => { try { const r = await api.getWorkerStatus(); setWorkerStatus(r.data); } catch {} }, []);
  const fetchSettings = useCallback(async () => { try { const r = await api.getSettings(); setSettings(r.data); } catch {} }, []);
  const fetchLatestSession = useCallback(async () => { try { const r = await api.getLatestSession(); setLatestSession(r.data); } catch {} }, []);
  const fetchAnalytics = useCallback(async () => { try { const r = await api.getAnalytics(); setAnalytics(r.data); } catch {} }, []);
  const fetchSavedViews = useCallback(async () => { try { const r = await api.getSavedViews(); setSavedViews(r.data); } catch {} }, []);

  useEffect(() => {
    fetchStats(); fetchSellers(); fetchActivityLog(); fetchWorkerStatus(); fetchSettings(); fetchLatestSession(); fetchAnalytics(); fetchSavedViews();
  }, []);

  useEffect(() => {
    const i1 = setInterval(fetchWorkerStatus, 2000);
    const i2 = setInterval(fetchStats, 4000);
    const i3 = setInterval(fetchSellers, 6000);
    const i4 = setInterval(fetchActivityLog, 3000);
    return () => { clearInterval(i1); clearInterval(i2); clearInterval(i3); clearInterval(i4); };
  }, [fetchWorkerStatus, fetchStats, fetchSellers, fetchActivityLog]);

  useEffect(() => { fetchSellers(); }, [currentPage, filters]);
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => { fetchSellers(); }, 400);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [searchQuery]);

  const handleSeed = async () => {
    try { await api.seedData(); toast.success("Demo data seeded"); fetchStats(); fetchSellers(); fetchActivityLog(); fetchLatestSession(); fetchAnalytics(); fetchSavedViews(); }
    catch { toast.error("Failed to seed data"); }
  };
  const handleClear = async () => {
    try { await api.clearData(); toast.success("All data cleared"); fetchStats(); fetchSellers(); fetchActivityLog(); fetchAnalytics(); }
    catch { toast.error("Failed to clear"); }
  };
  const handleStart = async (config) => {
    try { await api.startWorker(config); toast.success(`Scanning ${config.marketplace}`); fetchWorkerStatus(); fetchActivityLog(); }
    catch (e) { toast.error(e.response?.data?.detail || "Failed to start"); }
  };
  const handleStop = async () => {
    try { await api.stopWorker(); toast.success("Worker stopped"); fetchWorkerStatus(); fetchStats(); fetchSellers(); fetchLatestSession(); }
    catch { toast.error("Failed to stop"); }
  };
  const handleSettingsChange = async (update) => {
    try { const r = await api.updateSettings(update); setSettings(r.data); } catch { toast.error("Failed to update"); }
  };
  const handleExportExcel = async () => {
    try { const r = await api.exportExcel(); const url = window.URL.createObjectURL(new Blob([r.data])); const a = document.createElement("a"); a.href = url; a.download = "sellerradar_export.xlsx"; document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url); toast.success("Excel exported"); }
    catch { toast.error("Export failed"); }
  };
  const handleExportCSV = async () => {
    try { const r = await api.exportCSV(); const url = window.URL.createObjectURL(new Blob([r.data])); const a = document.createElement("a"); a.href = url; a.download = "sellerradar_export.csv"; document.body.appendChild(a); a.click(); a.remove(); window.URL.revokeObjectURL(url); toast.success("CSV exported"); }
    catch { toast.error("Export failed"); }
  };
  const handleDeleteSeller = async (id) => { try { await api.deleteSeller(id); toast.success("Deleted"); fetchSellers(); fetchStats(); } catch { toast.error("Failed"); } };
  const handleSelectSeller = async (id) => {
    try { const r = await api.getSellerDetail(id); setSelectedSeller(r.data); } catch { toast.error("Failed to load details"); }
  };
  const handleConfirmReview = async (id) => { try { await api.confirmReview(id); setSelectedSeller(null); toast.success("Confirmed"); fetchSellers(); fetchStats(); } catch { toast.error("Failed"); } };
  const handleSkipReview = async (id) => { try { await api.skipReview(id); setSelectedSeller(null); toast.success("Skipped"); fetchSellers(); fetchStats(); } catch { toast.error("Failed"); } };
  const handleFlag = async (id, flagged) => { try { await api.flagSeller(id, flagged); toast.success(flagged ? "Flagged" : "Unflagged"); if (selectedSeller?.id === id) handleSelectSeller(id); fetchSellers(); } catch { toast.error("Failed"); } };
  const handleNotesUpdate = async (id, notes) => { try { await api.updateSellerNotes(id, notes); toast.success("Notes saved"); if (selectedSeller?.id === id) handleSelectSeller(id); } catch { toast.error("Failed"); } };

  const handleApplyView = (viewFilters) => { setFilters(viewFilters || {}); setCurrentPage(1); };

  const showEmptyState = !sellers.length && !workerStatus.is_running && !Object.keys(filters).length && !searchQuery;
  const pendingCount = stats?.pending_review || 0;

  return (
    <div className="min-h-screen bg-[#0b0f14]" data-testid="dashboard">
      <Sidebar activeView={activeView} onViewChange={setActiveView} isRunning={workerStatus.is_running} pendingCount={pendingCount} />

      <div className="pl-[60px] xl:pl-[200px]">
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-[#0b0f14]/90 backdrop-blur-md border-b border-white/[0.04] px-5 py-3 flex items-center justify-between">
          <h2 className="font-heading font-bold text-base text-white capitalize">{activeView}</h2>
          <div className="flex items-center gap-2">
            {workerStatus.is_running && (
              <span className="text-[11px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full font-medium animate-pulse">Scanning</span>
            )}
            <button onClick={handleSeed} className="text-[11px] text-slate-500 hover:text-blue-400 transition-colors px-2 py-1 rounded hover:bg-white/5" data-testid="seed-data-btn">
              <Zap className="w-3 h-3 inline mr-1" />Seed
            </button>
          </div>
        </div>

        <div className="p-5 max-w-[1400px] mx-auto">
          {activeView === "dashboard" && (
            <div className="space-y-5">
              <StatsCards stats={stats} />

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-9 space-y-4">
                  <ControlPanel workerStatus={workerStatus} settings={settings} latestSession={latestSession} onStart={handleStart} onStop={handleStop} onResume={handleStart} onSettingsChange={handleSettingsChange} onExportExcel={handleExportExcel} onExportCSV={handleExportCSV} onClear={handleClear} />

                  {showEmptyState ? (
                    <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center" data-testid="empty-state">
                      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-5">
                        <Radar className="w-8 h-8 text-blue-400/40" strokeWidth={1} />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-white mb-2">No sellers collected yet</h3>
                      <p className="text-sm text-slate-500 mb-6 max-w-sm">Seed demo data to explore the dashboard or start scanning.</p>
                      <Button onClick={handleSeed} className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]" data-testid="empty-state-seed-btn">Seed Demo Data</Button>
                    </div>
                  ) : (
                    <>
                      <SavedViews activeFilters={filters} onApply={handleApplyView} savedViews={savedViews} />
                      <FiltersPanel filters={filters} searchQuery={searchQuery} onFilterChange={setFilters} onSearchChange={setSearchQuery} totalSellers={totalSellers} />
                      <SellersTable sellers={sellers} totalSellers={totalSellers} totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} onDeleteSeller={handleDeleteSeller} onSelectSeller={handleSelectSeller} />
                    </>
                  )}
                </div>
                <div className="xl:col-span-3">
                  <ActivityLog entries={activityLog} isRunning={workerStatus.is_running} />
                </div>
              </div>
            </div>
          )}

          {activeView === "analytics" && <AnalyticsPanel analytics={analytics} />}
          {activeView === "review" && <ReviewQueue />}
          {activeView === "settings" && <SettingsPage />}
        </div>
      </div>

      <SellerDetailDrawer seller={selectedSeller} onClose={() => setSelectedSeller(null)} onFlag={handleFlag} onNotesUpdate={handleNotesUpdate} onConfirm={handleConfirmReview} onSkip={handleSkipReview} />
    </div>
  );
}
