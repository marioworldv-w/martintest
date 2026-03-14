import { useState, useEffect } from "react";
import { Play, Square, RotateCcw, Globe, Settings, FileSpreadsheet, FileDown, Trash2, Sheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const MARKETPLACES = [
  { value: "amazon.de", label: "amazon.de", flag: "DE" },
  { value: "amazon.es", label: "amazon.es", flag: "ES" },
  { value: "amazon.fr", label: "amazon.fr", flag: "FR" },
  { value: "amazon.it", label: "amazon.it", flag: "IT" },
];

export const ControlPanel = ({
  workerStatus, settings, latestSession,
  onStart, onStop, onResume, onSettingsChange,
  onExportExcel, onExportCSV, onClear,
}) => {
  const [marketplace, setMarketplace] = useState("amazon.de");
  const [mode, setMode] = useState("continuous");
  const [targetCount, setTargetCount] = useState(50);
  const [minDelay, setMinDelay] = useState(25);
  const [maxDelay, setMaxDelay] = useState(45);
  const [manualReview, setManualReview] = useState(false);
  const [sheetsEnabled, setSheetsEnabled] = useState(false);

  useEffect(() => {
    if (settings) {
      setMarketplace(settings.default_marketplace || "amazon.de");
      setMinDelay(settings.default_min_delay || 25);
      setMaxDelay(settings.default_max_delay || 45);
      setMode(settings.default_mode || "continuous");
      setTargetCount(settings.default_target_count || 50);
      setManualReview(settings.manual_review_enabled || false);
      setSheetsEnabled(settings.google_sheets_enabled || false);
    }
  }, [settings]);

  const isRunning = workerStatus?.is_running;

  const handleStart = () => {
    onStart({ marketplace, mode, target_count: mode === "target" ? targetCount : 0, min_delay: minDelay, max_delay: maxDelay, manual_review: manualReview });
  };

  const handleResume = () => {
    if (latestSession?.session) {
      const s = latestSession.session;
      onStart({ marketplace: s.marketplace, mode: s.mode, target_count: s.target_count, min_delay: s.min_delay, max_delay: s.max_delay, manual_review: s.manual_review });
    }
  };

  const handleManualReviewChange = (val) => {
    setManualReview(val);
    onSettingsChange({ manual_review_enabled: val });
  };

  const handleSheetsChange = (val) => {
    setSheetsEnabled(val);
    onSettingsChange({ google_sheets_enabled: val });
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden" data-testid="control-panel">
      <div className="p-4 border-b border-white/5">
        <h2 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
          Run Controls
        </h2>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-400">Marketplace</Label>
          <Select value={marketplace} onValueChange={setMarketplace} disabled={isRunning} data-testid="marketplace-select">
            <SelectTrigger className="bg-[#0b0f14] border-white/10 h-9 text-sm" data-testid="marketplace-trigger">
              <Globe className="w-3.5 h-3.5 text-slate-400 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MARKETPLACES.map(m => (
                <SelectItem key={m.value} value={m.value} data-testid={`marketplace-${m.flag.toLowerCase()}`}>
                  <span className="font-code text-xs text-blue-400 mr-2 font-semibold">{m.flag}</span>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-slate-400">Run Mode</Label>
          <Select value={mode} onValueChange={setMode} disabled={isRunning} data-testid="mode-select">
            <SelectTrigger className="bg-[#0b0f14] border-white/10 h-9 text-sm" data-testid="mode-trigger">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="continuous" data-testid="mode-continuous">Run until stopped</SelectItem>
              <SelectItem value="target" data-testid="mode-target">Collect up to N sellers</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {mode === "target" && (
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400">Target Count</Label>
            <Input
              type="number" min={1} value={targetCount}
              onChange={e => setTargetCount(parseInt(e.target.value) || 50)}
              disabled={isRunning}
              className="bg-[#0b0f14] border-white/10 h-9 text-sm font-code"
              data-testid="target-count-input"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400">Min Delay (s)</Label>
            <Input
              type="number" min={1} value={minDelay}
              onChange={e => setMinDelay(parseInt(e.target.value) || 25)}
              disabled={isRunning}
              className="bg-[#0b0f14] border-white/10 h-9 text-sm font-code"
              data-testid="min-delay-input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400">Max Delay (s)</Label>
            <Input
              type="number" min={1} value={maxDelay}
              onChange={e => setMaxDelay(parseInt(e.target.value) || 45)}
              disabled={isRunning}
              className="bg-[#0b0f14] border-white/10 h-9 text-sm font-code"
              data-testid="max-delay-input"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {!isRunning ? (
            <Button
              onClick={handleStart}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)] h-9 text-sm"
              data-testid="start-btn"
            >
              <Play className="w-3.5 h-3.5 mr-1.5" /> Start
            </Button>
          ) : (
            <Button
              onClick={onStop}
              variant="destructive"
              className="flex-1 h-9 text-sm"
              data-testid="stop-btn"
            >
              <Square className="w-3.5 h-3.5 mr-1.5" /> Stop
            </Button>
          )}
          {!isRunning && latestSession?.session && (
            <Button
              onClick={handleResume}
              variant="outline"
              className="bg-white/5 border-white/10 hover:bg-white/10 text-white h-9 text-sm"
              data-testid="resume-btn"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Resume
            </Button>
          )}
        </div>

        <Separator className="bg-white/5" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-slate-400 flex items-center gap-1.5">Manual Review</Label>
            <Switch
              checked={manualReview}
              onCheckedChange={handleManualReviewChange}
              data-testid="manual-review-toggle"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-slate-400 flex items-center gap-1.5">
              <Sheet className="w-3 h-3" /> Google Sheets
            </Label>
            <Switch
              checked={sheetsEnabled}
              onCheckedChange={handleSheetsChange}
              data-testid="sheets-toggle"
            />
          </div>
        </div>

        <Separator className="bg-white/5" />

        <div className="space-y-2">
          <Label className="text-xs text-slate-400">Exports</Label>
          <div className="flex gap-2">
            <Button
              onClick={onExportExcel}
              variant="outline"
              size="sm"
              className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs h-8"
              data-testid="export-excel-btn"
            >
              <FileSpreadsheet className="w-3 h-3 mr-1" /> Excel
            </Button>
            <Button
              onClick={onExportCSV}
              variant="outline"
              size="sm"
              className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-white text-xs h-8"
              data-testid="export-csv-btn"
            >
              <FileDown className="w-3 h-3 mr-1" /> CSV
            </Button>
          </div>
          <Button
            onClick={onClear}
            variant="ghost"
            size="sm"
            className="w-full text-red-400/60 hover:text-red-400 hover:bg-red-500/10 text-xs h-7"
            data-testid="clear-data-btn"
          >
            <Trash2 className="w-3 h-3 mr-1" /> Clear All Data
          </Button>
        </div>
      </div>
    </div>
  );
};
