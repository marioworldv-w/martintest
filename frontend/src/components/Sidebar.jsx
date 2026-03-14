import { LayoutDashboard, BarChart3, ClipboardCheck, Settings, Radar, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "review", icon: ClipboardCheck, label: "Review" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export const Sidebar = ({ activeView, onViewChange, isRunning, pendingCount = 0 }) => {
  return (
    <div className="fixed left-0 top-0 bottom-0 w-[60px] xl:w-[200px] bg-[#080b10] border-r border-white/[0.04] flex flex-col z-40" data-testid="sidebar">
      <div className="p-3 xl:px-4 xl:py-5 flex items-center gap-2.5 border-b border-white/[0.04]">
        <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
          <Radar className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
        </div>
        <div className="hidden xl:block">
          <span className="font-heading text-sm font-bold text-white block leading-tight">SellerRadar</span>
          <span className="text-[9px] text-slate-600 uppercase tracking-[0.15em]">Pro</span>
        </div>
      </div>

      <nav className="flex-1 py-3 px-2 xl:px-3 space-y-1">
        {NAV_ITEMS.map(item => {
          const isActive = activeView === item.id;
          const Icon = item.icon;
          return (
            <Tooltip key={item.id} delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 rounded-lg transition-all duration-200 relative",
                    "px-2.5 py-2.5 xl:px-3 xl:py-2",
                    isActive
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
                  )}
                  data-testid={`nav-${item.id}`}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-blue-400" />}
                  <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.5} />
                  <span className="hidden xl:block text-[13px] font-medium">{item.label}</span>
                  {item.id === "review" && pendingCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 xl:static xl:ml-auto w-4 h-4 rounded-full bg-blue-500 text-[9px] text-white flex items-center justify-center font-bold">
                      {pendingCount > 9 ? "9+" : pendingCount}
                    </span>
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="xl:hidden">
                <p className="text-xs">{item.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </nav>

      <div className="p-3 xl:p-4 border-t border-white/[0.04]">
        <div className={cn(
          "flex items-center gap-2 px-2 py-2 rounded-lg",
          isRunning ? "bg-blue-500/10" : "bg-white/[0.02]"
        )}>
          <span className={cn("w-2 h-2 rounded-full shrink-0", isRunning ? "bg-blue-400 animate-pulse" : "bg-slate-600")} />
          <span className={cn("hidden xl:block text-[11px] font-medium", isRunning ? "text-blue-400" : "text-slate-600")}>
            {isRunning ? "Scanning..." : "Idle"}
          </span>
        </div>
      </div>
    </div>
  );
};
