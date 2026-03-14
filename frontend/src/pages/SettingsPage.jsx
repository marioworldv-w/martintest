import { useState, useEffect, useCallback } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as api from "@/lib/api";
import { toast } from "sonner";

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try { const r = await api.getSettings(); setSettings(r.data); } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async (updates) => {
    setSaving(true);
    try {
      const r = await api.updateSettings(updates);
      setSettings(r.data);
      toast.success("Settings saved");
    } catch { toast.error("Failed to save"); }
    setSaving(false);
  };

  const updateWeight = (key, value) => {
    const weights = { ...(settings?.scoring_weights || {}), [key]: parseInt(value) || 0 };
    setSettings(prev => ({ ...prev, scoring_weights: weights }));
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 text-blue-400 animate-spin" /></div>;

  const w = settings?.scoring_weights || {};
  const dup = settings?.duplicate_rules || {};
  const exp = settings?.export_options || {};

  return (
    <div className="max-w-2xl space-y-5" data-testid="settings-page">
      <Tabs defaultValue="scoring">
        <TabsList className="bg-white/5 border border-white/[0.06]">
          <TabsTrigger value="scoring" className="data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400 text-xs" data-testid="tab-scoring">Scoring</TabsTrigger>
          <TabsTrigger value="session" className="data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400 text-xs" data-testid="tab-session">Session</TabsTrigger>
          <TabsTrigger value="duplicates" className="data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400 text-xs" data-testid="tab-duplicates">Duplicates</TabsTrigger>
          <TabsTrigger value="export" className="data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400 text-xs" data-testid="tab-export">Export</TabsTrigger>
          <TabsTrigger value="sync" className="data-[state=active]:bg-blue-500/15 data-[state=active]:text-blue-400 text-xs" data-testid="tab-sync">Google Sheets</TabsTrigger>
        </TabsList>

        <TabsContent value="scoring" className="mt-4">
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <h3 className="font-heading font-semibold text-sm text-white">Lead Scoring Weights</h3>
            <p className="text-xs text-slate-500">Configure how much each factor contributes to the lead quality score (max total: 100).</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: "vat_present", label: "VAT Number" },
                { key: "registration_present", label: "Registration #" },
                { key: "phone_present", label: "Phone Number" },
                { key: "email_present", label: "Email Address" },
                { key: "address_present", label: "Full Address" },
                { key: "eu_country", label: "EU Country" },
              ].map(item => (
                <div key={item.key} className="space-y-1">
                  <Label className="text-xs text-slate-400">{item.label}</Label>
                  <Input type="number" min={0} max={100} value={w[item.key] || 0} onChange={e => updateWeight(item.key, e.target.value)}
                    className="bg-[#0b0f14] border-white/10 h-8 text-sm font-code" data-testid={`weight-${item.key}`} />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">Total: <span className="font-code text-white font-bold">{Object.values(w).reduce((a, b) => a + (b || 0), 0)}</span> / 100</span>
              <Button onClick={() => handleSave({ scoring_weights: w })} size="sm" className="bg-blue-600 hover:bg-blue-500 text-xs h-8" disabled={saving} data-testid="save-scoring-btn">
                <Save className="w-3 h-3 mr-1" /> Save Weights
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="session" className="mt-4">
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <h3 className="font-heading font-semibold text-sm text-white">Session Defaults</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs text-slate-400">Default Min Delay (s)</Label>
                <Input type="number" value={settings?.default_min_delay || 25} onChange={e => setSettings(p => ({ ...p, default_min_delay: parseInt(e.target.value) }))}
                  className="bg-[#0b0f14] border-white/10 h-8 text-sm font-code" data-testid="default-min-delay" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-400">Default Max Delay (s)</Label>
                <Input type="number" value={settings?.default_max_delay || 45} onChange={e => setSettings(p => ({ ...p, default_max_delay: parseInt(e.target.value) }))}
                  className="bg-[#0b0f14] border-white/10 h-8 text-sm font-code" data-testid="default-max-delay" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-slate-400">Default Target Count</Label>
                <Input type="number" value={settings?.default_target_count || 50} onChange={e => setSettings(p => ({ ...p, default_target_count: parseInt(e.target.value) }))}
                  className="bg-[#0b0f14] border-white/10 h-8 text-sm font-code" data-testid="default-target" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Switch checked={settings?.manual_review_enabled || false} onCheckedChange={v => setSettings(p => ({ ...p, manual_review_enabled: v }))} data-testid="default-review-toggle" />
                <Label className="text-xs text-slate-400">Manual Review by Default</Label>
              </div>
              <Button onClick={() => handleSave({ default_min_delay: settings?.default_min_delay, default_max_delay: settings?.default_max_delay, default_target_count: settings?.default_target_count, manual_review_enabled: settings?.manual_review_enabled })}
                size="sm" className="bg-blue-600 hover:bg-blue-500 text-xs h-8" disabled={saving} data-testid="save-session-btn">
                <Save className="w-3 h-3 mr-1" /> Save
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="duplicates" className="mt-4">
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <h3 className="font-heading font-semibold text-sm text-white">Duplicate Detection Rules</h3>
            {[
              { key: "by_profile_url", label: "Match by Seller Profile URL" },
              { key: "by_name_marketplace", label: "Match by Name + Marketplace" },
              { key: "by_email", label: "Match by Email" },
              { key: "by_phone", label: "Match by Phone" },
              { key: "by_vat_or_reg", label: "Match by VAT or Registration #" },
            ].map(rule => (
              <div key={rule.key} className="flex items-center justify-between py-1">
                <Label className="text-xs text-slate-400">{rule.label}</Label>
                <Switch checked={dup[rule.key] !== false} onCheckedChange={v => setSettings(p => ({ ...p, duplicate_rules: { ...dup, [rule.key]: v } }))} data-testid={`dup-${rule.key}`} />
              </div>
            ))}
            <Button onClick={() => handleSave({ duplicate_rules: settings?.duplicate_rules })} size="sm" className="bg-blue-600 hover:bg-blue-500 text-xs h-8 mt-2" disabled={saving} data-testid="save-dup-btn">
              <Save className="w-3 h-3 mr-1" /> Save Rules
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="export" className="mt-4">
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <h3 className="font-heading font-semibold text-sm text-white">Export Options</h3>
            {[
              { key: "include_flagged_sheet", label: "Include Flagged Records Sheet" },
              { key: "include_analytics_sheet", label: "Include Analytics Summary Sheet" },
              { key: "alternating_rows", label: "Alternating Row Colors" },
            ].map(opt => (
              <div key={opt.key} className="flex items-center justify-between py-1">
                <Label className="text-xs text-slate-400">{opt.label}</Label>
                <Switch checked={exp[opt.key] !== false} onCheckedChange={v => setSettings(p => ({ ...p, export_options: { ...exp, [opt.key]: v } }))} data-testid={`exp-${opt.key}`} />
              </div>
            ))}
            <Button onClick={() => handleSave({ export_options: settings?.export_options })} size="sm" className="bg-blue-600 hover:bg-blue-500 text-xs h-8 mt-2" disabled={saving} data-testid="save-export-btn">
              <Save className="w-3 h-3 mr-1" /> Save Options
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="sync" className="mt-4">
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <h3 className="font-heading font-semibold text-sm text-white">Google Sheets Integration</h3>
            <p className="text-xs text-slate-500">Connect your Google Sheets account for real-time data sync. Service account credentials required.</p>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-slate-400">Enable Sync</Label>
              <Switch checked={settings?.google_sheets_enabled || false} onCheckedChange={v => handleSave({ google_sheets_enabled: v })} data-testid="sheets-enable-toggle" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-slate-400">Spreadsheet URL</Label>
              <Input value={settings?.google_sheets_url || ""} onChange={e => setSettings(p => ({ ...p, google_sheets_url: e.target.value }))} placeholder="https://docs.google.com/spreadsheets/d/..."
                className="bg-[#0b0f14] border-white/10 h-8 text-xs font-code" data-testid="sheets-url-input" />
            </div>
            <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
              <p className="text-[11px] text-amber-400">Google Sheets integration is configured but not connected in this MVP. Add your service account credentials to enable real-time sync.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
