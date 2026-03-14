import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { Radar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { StatsCards } from "@/components/StatsCards";
import { ControlPanel } from "@/components/ControlPanel";
import { SellersTable } from "@/components/SellersTable";
import { ActivityLog } from "@/components/ActivityLog";
import { FiltersPanel } from "@/components/FiltersPanel";
import { ManualReviewDialog } from "@/components/ManualReviewDialog";
import * as api from "@/lib/api";

export default function Dashboard() {
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
  const [reviewItem, setReviewItem] = useState(null);
  const [latestSession, setLatestSession] = useState(null);
  const [isSeeded, setIsSeeded] = useState(false);
  const searchTimeoutRef = useRef(null);

  const fetchStats = useCallback(async () => {
    try { const r = await api.getStats(); setStats(r.data); } catch {}
  }, []);

  const fetchSellers = useCallback(async () => {
    try {
      const params = { page: currentPage, limit: 20, ...filters };
      if (searchQuery) params.search = searchQuery;
      const r = await api.getSellers(params);
      setSellers(r.data.sellers);
      setTotalSellers(r.data.total);
      setTotalPages(r.data.total_pages);
    } catch {}
  }, [currentPage, filters, searchQuery]);

  const fetchActivityLog = useCallback(async () => {
    try { const r = await api.getActivityLog({ limit: 150 }); setActivityLog(r.data.entries); } catch {}
  }, []);

  const fetchWorkerStatus = useCallback(async () => {
    try { const r = await api.getWorkerStatus(); setWorkerStatus(r.data); } catch {}
  }, []);

  const fetchSettings = useCallback(async () => {
    try { const r = await api.getSettings(); setSettings(r.data); } catch {}
  }, []);

  const fetchLatestSession = useCallback(async () => {
    try { const r = await api.getLatestSession(); setLatestSession(r.data); } catch {}
  }, []);

  const fetchPendingReviews = useCallback(async () => {
    try {
      const r = await api.getPendingReviews();
      if (r.data.length > 0 && !reviewItem) setReviewItem(r.data[0]);
    } catch {}
  }, [reviewItem]);

  // Initial fetch
  useEffect(() => {
    fetchStats(); fetchSellers(); fetchActivityLog();
    fetchWorkerStatus(); fetchSettings(); fetchLatestSession();
  }, []);

  // Polling
  useEffect(() => {
    const i1 = setInterval(fetchWorkerStatus, 2000);
    const i2 = setInterval(fetchStats, 4000);
    const i3 = setInterval(fetchSellers, 5000);
    const i4 = setInterval(fetchActivityLog, 3000);
    return () => { clearInterval(i1); clearInterval(i2); clearInterval(i3); clearInterval(i4); };
  }, [fetchWorkerStatus, fetchStats, fetchSellers, fetchActivityLog]);

  // Poll pending reviews when worker is running with manual review
  useEffect(() => {
    if (workerStatus.is_running && settings?.manual_review_enabled) {
      const i = setInterval(fetchPendingReviews, 3000);
      return () => clearInterval(i);
    }
  }, [workerStatus.is_running, settings?.manual_review_enabled, fetchPendingReviews]);

  // Re-fetch sellers on filter/search/page change
  useEffect(() => { fetchSellers(); }, [currentPage, filters]);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => { fetchSellers(); }, 400);
    return () => { if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current); };
  }, [searchQuery]);

  // Handlers
  const handleSeed = async () => {
    try {
      await api.seedData();
      setIsSeeded(true);
      toast.success("Demo data seeded successfully");
      fetchStats(); fetchSellers(); fetchActivityLog(); fetchLatestSession();
    } catch { toast.error("Failed to seed data"); }
  };

  const handleClear = async () => {
    try {
      await api.clearData();
      setIsSeeded(false);
      toast.success("All data cleared");
      fetchStats(); fetchSellers(); fetchActivityLog();
    } catch { toast.error("Failed to clear data"); }
  };

  const handleStart = async (config) => {
    try {
      await api.startWorker(config);
      toast.success(`Scanning ${config.marketplace}`);
      fetchWorkerStatus(); fetchActivityLog();
    } catch (e) { toast.error(e.response?.data?.detail || "Failed to start worker"); }
  };

  const handleStop = async () => {
    try {
      await api.stopWorker();
      toast.success("Worker stopped");
      fetchWorkerStatus(); fetchStats(); fetchSellers(); fetchLatestSession();
    } catch { toast.error("Failed to stop worker"); }
  };

  const handleSettingsChange = async (update) => {
    try {
      const r = await api.updateSettings(update);
      setSettings(r.data);
    } catch { toast.error("Failed to update settings"); }
  };

  const handleExportExcel = async () => {
    try {
      const r = await api.exportExcel();
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sellerradar_export.xlsx");
      document.body.appendChild(link); link.click(); link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Excel exported");
    } catch { toast.error("Export failed"); }
  };

  const handleExportCSV = async () => {
    try {
      const r = await api.exportCSV();
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sellerradar_export.csv");
      document.body.appendChild(link); link.click(); link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("CSV exported");
    } catch { toast.error("Export failed"); }
  };

  const handleDeleteSeller = async (id) => {
    try {
      await api.deleteSeller(id);
      toast.success("Seller deleted");
      fetchSellers(); fetchStats();
    } catch { toast.error("Failed to delete seller"); }
  };

  const handleConfirmReview = async (id) => {
    try {
      await api.confirmReview(id);
      setReviewItem(null);
      toast.success("Seller confirmed");
      fetchSellers(); fetchStats();
    } catch { toast.error("Failed to confirm"); }
  };

  const handleSkipReview = async (id) => {
    try {
      await api.skipReview(id);
      setReviewItem(null);
      toast.success("Seller skipped");
      fetchSellers(); fetchStats();
    } catch { toast.error("Failed to skip"); }
  };

  const showEmptyState = !sellers.length && !workerStatus.is_running && !Object.keys(filters).length && !searchQuery;

  return (
    <div className="min-h-screen bg-[#0b0f14]" data-testid="dashboard">
      <Header isRunning={workerStatus.is_running} onSeed={handleSeed} onClear={handleClear} />

      <div className="max-w-[1600px] mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
          {/* Sidebar */}
          <div className="lg:col-span-3 flex flex-col gap-4 order-2 lg:order-1">
            <ControlPanel
              workerStatus={workerStatus}
              settings={settings}
              latestSession={latestSession}
              onStart={handleStart}
              onStop={handleStop}
              onResume={handleStart}
              onSettingsChange={handleSettingsChange}
              onExportExcel={handleExportExcel}
              onExportCSV={handleExportCSV}
              onClear={handleClear}
            />
            <ActivityLog entries={activityLog} isRunning={workerStatus.is_running} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 flex flex-col gap-4 lg:gap-5 order-1 lg:order-2">
            <StatsCards stats={stats} />

            {showEmptyState ? (
              <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center" data-testid="empty-state">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-5">
                  <Radar className="w-8 h-8 text-blue-400/40" strokeWidth={1} />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-2">No sellers collected yet</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-sm">
                  Seed demo data to explore the dashboard or start a new scan from the control panel.
                </p>
                <Button
                  onClick={handleSeed}
                  className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  data-testid="empty-state-seed-btn"
                >
                  Seed Demo Data
                </Button>
              </div>
            ) : (
              <>
                <FiltersPanel
                  filters={filters}
                  searchQuery={searchQuery}
                  onFilterChange={setFilters}
                  onSearchChange={setSearchQuery}
                  totalSellers={totalSellers}
                />
                <SellersTable
                  sellers={sellers}
                  totalSellers={totalSellers}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  onDeleteSeller={handleDeleteSeller}
                />
              </>
            )}
          </div>
        </div>
      </div>

      <ManualReviewDialog
        seller={reviewItem}
        onConfirm={handleConfirmReview}
        onSkip={handleSkipReview}
        onClose={() => setReviewItem(null)}
      />
    </div>
  );
}
