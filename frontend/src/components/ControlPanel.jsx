import { useState, useEffect } from "react";
import { Play, Square, RotateCcw, Globe, FileSpreadsheet, FileDown, Trash2 } from "lucide-react";
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
      <div className="p-4 flex flex-wrap items-end gap-4">
        <div className="space-y-1 min-w-[140px]">
          <Label className="text-[10px] text-slate-500 uppercase tracking-wider">Marketplace</Label>
          <Select value={marketplace} onValueChange={setMarketplace} disabled={isRunning} data-testid="marketplace-select">
            <SelectTrigger className="bg-[#0b0f14] border-white/10 h-8 text-xs w-[160px]" data-testid="marketplace-trigger">
              <Globe className="w-3 h-3 text-slate-400 mr-1.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MARKETPLACES.map(m => (
                <SelectItem key={m.value} value={m.value} data-testid={`marketplace-${m.flag.toLowerCase()}`}>
                  <span className="font-code text-[10px] text-blue-400 mr-1.5 font-bold">{m.flag}</span>{m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 min-w-[120px]">
          <Label className="text-[10px] text-slate-500 uppercase tracking-wider">Mode</Label>
          <Select value={mode} onValueChange={setMode} disabled={isRunning} data-testid="mode-select">
            <SelectTrigger className="bg-[#0b0f14] border-white/10 h-8 text-xs w-[150px]" data-testid="mode-trigger">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="continuous" data-testid="mode-continuous">Continuous</SelectItem>
              <SelectItem value="target" data-testid="mode-target">Target N</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {mode === "target" && (
          <div className="space-y-1">
            <Label className="text-[10px] text-slate-500 uppercase tracking-wider">Target</Label>
            <Input type="number" min={1} value={targetCount} onChange={e => setTargetCount(parseInt(e.target.value) || 50)} disabled={isRunning}
              className="bg-[#0b0f14] border-white/10 h-8 text-xs font-code w-[80px]" data-testid="target-count-input" />
          </div>
        )}

        <div className="space-y-1">
          <Label className="text-[10px] text-slate-500 uppercase tracking-wider">Delay</Label>
          <div className="flex items-center gap-1">
            <Input type="number" min={1} value={minDelay} onChange={e => setMinDelay(parseInt(e.target.value) || 25)} disabled={isRunning}
              className="bg-[#0b0f14] border-white/10 h-8 text-xs font-code w-[60px]" data-testid="min-delay-input" />
            <span className="text-slate-600 text-xs">-</span>
            <Input type="number" min={1} value={maxDelay} onChange={e => setMaxDelay(parseInt(e.target.value) || 45)} disabled={isRunning}
              className="bg-[#0b0f14] border-white/10 h-8 text-xs font-code w-[60px]" data-testid="max-delay-input" />
            <span className="text-[10px] text-slate-600">s</span>
          </div>
        </div>

        <div className="flex items-end gap-2">
          {!isRunning ? (
            <Button onClick={handleStart} className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_12px_rgba(59,130,246,0.25)] h-8 text-xs px-4" data-testid="start-btn">
              <Play className="w-3 h-3 mr-1.5" /> Start
            </Button>
          ) : (
            <Button onClick={onStop} variant="destructive" className="h-8 text-xs px-4" data-testid="stop-btn">
              <Square className="w-3 h-3 mr-1.5" /> Stop
            </Button>
          )}
          {!isRunning && latestSession?.session && (
            <Button onClick={handleResume} variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white h-8 text-xs" data-testid="resume-btn">
              <RotateCcw className="w-3 h-3 mr-1.5" /> Resume
            </Button>
          )}
        </div>

        <Separator orientation="vertical" className="h-8 bg-white/[0.06] hidden lg:block" />

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <Switch checked={manualReview} onCheckedChange={handleManualReviewChange} className="scale-75" data-testid="manual-review-toggle" />
            <span className="text-slate-500">Review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Switch checked={sheetsEnabled} onCheckedChange={handleSheetsChange} className="scale-75" data-testid="sheets-toggle" />
            <span className="text-slate-500">Sheets</span>
          </div>
        </div>

        <div className="flex items-end gap-1.5 ml-auto">
          <Button onClick={onExportExcel} variant="outline" size="sm" className="bg-white/5 border-white/[0.06] hover:bg-white/10 text-white text-[10px] h-7 px-2" data-testid="export-excel-btn">
            <FileSpreadsheet className="w-3 h-3 mr-1" /> Excel
          </Button>
          <Button onClick={onExportCSV} variant="outline" size="sm" className="bg-white/5 border-white/[0.06] hover:bg-white/10 text-white text-[10px] h-7 px-2" data-testid="export-csv-btn">
            <FileDown className="w-3 h-3 mr-1" /> CSV
          </Button>
          <Button onClick={onClear} variant="ghost" size="sm" className="text-red-400/50 hover:text-red-400 hover:bg-red-500/10 text-[10px] h-7 px-2" data-testid="clear-data-btn">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
