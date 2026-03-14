import { Radar, Activity, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const Header = ({ isRunning, onSeed, onClear }) => {
  return (
    <header className="sticky top-0 z-50 glass" data-testid="app-header">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <Radar className="w-4.5 h-4.5 text-blue-400" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-heading text-base font-bold text-white tracking-tight leading-tight">
              SellerRadar Pro
            </h1>
            <p className="text-[10px] text-slate-500 leading-none">Marketplace Intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isRunning && (
            <Badge
              variant="outline"
              className="bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse text-xs px-2.5 py-0.5"
              data-testid="running-badge"
            >
              <Activity className="w-3 h-3 mr-1.5" />
              Scanning
            </Badge>
          )}
          <button
            onClick={onSeed}
            className="text-xs text-slate-500 hover:text-blue-400 transition-colors px-2 py-1 rounded hover:bg-white/5"
            data-testid="seed-data-btn"
          >
            <Zap className="w-3 h-3 inline mr-1" />
            Seed Demo
          </button>
        </div>
      </div>
    </header>
  );
};
