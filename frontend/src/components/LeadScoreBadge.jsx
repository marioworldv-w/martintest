import { cn } from "@/lib/utils";

const getScoreColor = (score) => {
  if (score >= 80) return { ring: "text-emerald-400", bg: "bg-emerald-500/15", text: "text-emerald-400", label: "High" };
  if (score >= 60) return { ring: "text-blue-400", bg: "bg-blue-500/15", text: "text-blue-400", label: "Good" };
  if (score >= 40) return { ring: "text-amber-400", bg: "bg-amber-500/15", text: "text-amber-400", label: "Fair" };
  if (score >= 20) return { ring: "text-orange-400", bg: "bg-orange-500/15", text: "text-orange-400", label: "Low" };
  return { ring: "text-red-400", bg: "bg-red-500/15", text: "text-red-400", label: "Poor" };
};

export const LeadScoreBadge = ({ score = 0, size = "sm", showLabel = false }) => {
  const c = getScoreColor(score);
  if (size === "lg") {
    return (
      <div className="flex items-center gap-3" data-testid="lead-score-badge-lg">
        <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center font-heading font-extrabold text-xl", c.bg, c.text)}>
          {score}
        </div>
        {showLabel && <div><span className={cn("text-sm font-semibold", c.text)}>{c.label} Quality</span><p className="text-[10px] text-slate-500">Lead Score</p></div>}
      </div>
    );
  }
  return (
    <span
      className={cn("inline-flex items-center justify-center font-code text-[10px] font-bold rounded-md px-1.5 py-0.5 min-w-[32px]", c.bg, c.text)}
      data-testid="lead-score-badge"
    >
      {score}
    </span>
  );
};

export { getScoreColor };
