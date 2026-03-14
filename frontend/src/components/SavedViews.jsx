import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const QUICK_VIEWS = [
  { name: "All", filters: {} },
];

export const SavedViews = ({ activeFilters, onApply, savedViews = [] }) => {
  const allViews = [...QUICK_VIEWS, ...savedViews.map(v => ({ name: v.name, filters: v.filters, id: v.id, custom: true }))];

  const isActive = (view) => {
    if (!view.filters || Object.keys(view.filters).length === 0) {
      return !activeFilters || Object.keys(activeFilters).length === 0;
    }
    return JSON.stringify(view.filters) === JSON.stringify(activeFilters);
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap" data-testid="saved-views">
      {allViews.map((view, i) => (
        <button
          key={view.id || view.name}
          onClick={() => onApply(view.filters)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all duration-200 border
            ${isActive(view)
              ? "bg-blue-500/15 text-blue-400 border-blue-500/25"
              : "bg-white/[0.02] text-slate-500 border-white/[0.04] hover:text-slate-300 hover:bg-white/[0.04]"
            }`}
          data-testid={`view-${view.name.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {view.name}
        </button>
      ))}
    </div>
  );
};
