import { useEffect, useRef } from "react";
import { Terminal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const LEVEL_COLORS = {
  info: "text-blue-400",
  success: "text-emerald-400",
  warning: "text-amber-400",
  error: "text-red-400",
};

const LEVEL_DOT = {
  info: "bg-blue-400",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  error: "bg-red-400",
};

export const ActivityLog = ({ entries = [], isRunning }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [entries.length]);

  const formatTime = (ts) => {
    if (!ts) return "";
    try {
      return new Date(ts).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col" data-testid="activity-log">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
          Activity Log
        </h2>
        {isRunning && (
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        )}
      </div>
      <ScrollArea className="h-[320px] lg:h-[400px]">
        <div className="p-3 space-y-0.5">
          {entries.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-8 font-code">No activity yet</p>
          ) : (
            entries.map((entry, i) => (
              <div
                key={entry.id || i}
                className={`log-entry ${entry.level || 'info'} py-1 flex items-start gap-2 text-[11px] leading-relaxed`}
              >
                <span className="font-code text-slate-600 shrink-0 w-[60px]">
                  {formatTime(entry.timestamp)}
                </span>
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${LEVEL_DOT[entry.level] || LEVEL_DOT.info}`} />
                <span className={`font-code ${LEVEL_COLORS[entry.level] || LEVEL_COLORS.info} break-all`}>
                  {entry.detail}
                </span>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
};
