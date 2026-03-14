import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Check, X, Flag, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { LeadScoreBadge } from "@/components/LeadScoreBadge";
import { Separator } from "@/components/ui/separator";
import * as api from "@/lib/api";
import { toast } from "sonner";

export const ReviewQueue = () => {
  const [queue, setQueue] = useState({ items: [], total: 0, page: 1 });
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");

  const fetchQueue = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const r = await api.getReviewQueue(page);
      setQueue(r.data);
      setNotes(r.data.items?.[0]?.notes || "");
    } catch { toast.error("Failed to load review queue"); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchQueue(); }, [fetchQueue]);

  const current = queue.items?.[0];
  const reviewedCount = queue.page - 1;
  const progress = queue.total > 0 ? Math.round((reviewedCount / queue.total) * 100) : 0;

  const handleAction = async (action) => {
    if (!current) return;
    try {
      if (notes && notes !== current.notes) {
        await api.updateSellerNotes(current.id, notes);
      }
      if (action === "confirm") await api.confirmReview(current.id);
      else if (action === "skip") await api.skipReview(current.id);
      else if (action === "flag") await api.flagReviewDuplicate(current.id);
      toast.success(action === "confirm" ? "Seller confirmed" : action === "skip" ? "Seller skipped" : "Flagged as duplicate");
      fetchQueue(queue.page);
    } catch { toast.error("Action failed"); }
  };

  const goNext = () => { if (queue.page < queue.total) fetchQueue(queue.page + 1); };
  const goPrev = () => { if (queue.page > 1) fetchQueue(queue.page - 1); };

  if (loading && !current) {
    return (
      <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center" data-testid="review-loading">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-4" />
        <p className="text-sm text-slate-400">Loading review queue...</p>
      </div>
    );
  }

  if (!current && queue.total === 0) {
    return (
      <div className="glass-card rounded-2xl p-12 flex flex-col items-center justify-center text-center" data-testid="review-empty">
        <Check className="w-12 h-12 text-emerald-400/30 mb-4" strokeWidth={1} />
        <h3 className="font-heading text-lg font-bold text-white mb-1">Review queue is empty</h3>
        <p className="text-sm text-slate-500">All sellers have been reviewed. Start a new scan with manual review enabled.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="review-queue">
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-heading font-semibold text-sm text-white">Review Progress</h3>
          <span className="font-code text-xs text-slate-400">{reviewedCount} / {queue.total} reviewed</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {current && (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-white/[0.04] flex items-start justify-between">
            <div>
              <h3 className="font-heading text-lg font-bold text-white">{current.seller_name}</h3>
              <p className="text-xs text-slate-500">{current.business_name_if_visible}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-code text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded font-bold">
                  {current.marketplace?.replace("amazon.", "").toUpperCase()}
                </span>
                <span className="text-xs text-slate-400">{current.country_if_visible}</span>
              </div>
            </div>
            <LeadScoreBadge score={current.quality_score || 0} size="lg" showLabel />
          </div>

          <div className="p-5 grid grid-cols-2 gap-x-6 gap-y-3">
            {[
              { label: "VAT Number", val: current.vat_number_if_visible },
              { label: "Registration", val: current.registration_number_if_visible },
              { label: "Phone", val: current.public_phone_if_visible },
              { label: "Email", val: current.public_email_if_visible },
              { label: "Address", val: current.business_address_if_visible },
              { label: "Product", val: current.product_title_short },
              { label: "ASIN", val: current.asin },
              { label: "Brand", val: current.brand_if_visible },
            ].map(f => (
              <div key={f.label}>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest block">{f.label}</span>
                <span className={`text-[13px] ${f.val ? "text-slate-200" : "text-slate-600"} font-code`}>{f.val || "--"}</span>
              </div>
            ))}
          </div>

          {current.score_breakdown && (
            <div className="px-5 pb-4">
              <Separator className="bg-white/[0.04] mb-3" />
              <h4 className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-semibold">Score Breakdown</h4>
              <div className="grid grid-cols-3 gap-2">
                {current.score_breakdown.map((item, i) => (
                  <div key={i} className={`flex items-center gap-1.5 text-xs ${item.present ? "text-emerald-400" : "text-slate-600"}`}>
                    {item.present ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                    <span>{item.factor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="px-5 pb-4">
            <Separator className="bg-white/[0.04] mb-3" />
            <h4 className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-semibold">Notes</h4>
            <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add notes about this seller..." className="bg-[#0b0f14] border-white/10 text-xs h-8" data-testid="review-notes-input" />
          </div>

          <div className="p-4 border-t border-white/[0.04] flex items-center justify-between gap-3">
            <div className="flex gap-2">
              <Button onClick={goPrev} disabled={queue.page <= 1} variant="ghost" size="sm" className="h-8 text-xs text-slate-400" data-testid="review-prev-btn">
                <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Prev
              </Button>
              <Button onClick={goNext} disabled={queue.page >= queue.total} variant="ghost" size="sm" className="h-8 text-xs text-slate-400" data-testid="review-next-btn">
                Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => handleAction("flag")} variant="outline" size="sm" className="h-8 text-xs bg-white/5 border-white/10 text-amber-400 hover:bg-amber-500/10" data-testid="review-flag-btn">
                <Flag className="w-3 h-3 mr-1" /> Duplicate
              </Button>
              <Button onClick={() => handleAction("skip")} variant="outline" size="sm" className="h-8 text-xs bg-white/5 border-white/10 text-slate-300" data-testid="review-skip-btn">
                <X className="w-3 h-3 mr-1" /> Skip
              </Button>
              <Button onClick={() => handleAction("confirm")} size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_12px_rgba(34,197,94,0.25)]" data-testid="review-confirm-btn">
                <Check className="w-3 h-3 mr-1" /> Approve
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
