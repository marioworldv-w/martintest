import { Search, Users, Database, Copy, Activity, Clock, Gauge, Flag } from "lucide-react";

const CARDS_CONFIG = [
  { key: "products_scanned", label: "Scanned", icon: Search, colorClass: "text-blue-400", bgClass: "bg-blue-500/10" },
  { key: "total_sellers", label: "Sellers", icon: Users, colorClass: "text-emerald-400", bgClass: "bg-emerald-500/10" },
  { key: "confirmed_sellers", label: "Confirmed", icon: Database, colorClass: "text-sky-400", bgClass: "bg-sky-500/10" },
  { key: "avg_quality_score", label: "Avg Score", icon: Gauge, colorClass: "text-violet-400", bgClass: "bg-violet-500/10" },
  { key: "flagged_count", label: "Flagged", icon: Flag, colorClass: "text-red-400", bgClass: "bg-red-500/10" },
  { key: "run_status", label: "Status", icon: Activity, isStatus: true },
  { key: "sellers_per_hour", label: "Rate/h", icon: Clock, colorClass: "text-amber-400", bgClass: "bg-amber-500/10" },
  { key: "pending_review", label: "Pending", icon: Copy, colorClass: "text-orange-400", bgClass: "bg-orange-500/10" },
];

export const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3" data-testid="stats-cards">
      {CARDS_CONFIG.map((card, i) => {
        const Icon = card.icon;
        const value = stats?.[card.key] ?? 0;
        const isRunning = stats?.is_running;
        const statusColor = isRunning ? "text-blue-400" : "text-slate-400";
        const statusBg = isRunning ? "bg-blue-500/10" : "bg-slate-500/10";

        return (
          <div
            key={card.key}
            className={`glass-card rounded-2xl p-4 animate-fade-in-up ${isRunning && card.isStatus ? 'animate-pulse-glow' : ''}`}
            style={{ animationDelay: `${i * 60}ms` }}
            data-testid={`stat-card-${card.key}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-6 h-6 rounded-md ${card.isStatus ? statusBg : card.bgClass} flex items-center justify-center`}>
                <Icon className={`w-3.5 h-3.5 ${card.isStatus ? statusColor : card.colorClass}`} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">{card.label}</span>
            </div>
            <div className={`text-2xl font-heading font-extrabold tracking-tight ${card.isStatus ? statusColor : card.colorClass}`}>
              {card.isStatus
                ? (isRunning ? "Running" : "Idle")
                : typeof value === 'number' ? value.toLocaleString() : value}
            </div>
          </div>
        );
      })}
    </div>
  );
};
