import { useState } from "react";
import { X, ExternalLink, Flag, Check, MapPin, Phone, Mail, Hash, Globe, Building, FileText, User, Tag, Clock } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { LeadScoreBadge, getScoreColor } from "@/components/LeadScoreBadge";

const Field = ({ icon: Icon, label, value, mono }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5 py-2">
      <Icon className="w-3.5 h-3.5 text-slate-600 mt-0.5 shrink-0" strokeWidth={1.5} />
      <div className="flex-1 min-w-0">
        <span className="text-[9px] text-slate-500 uppercase tracking-widest block">{label}</span>
        <span className={`text-[13px] text-slate-200 break-all ${mono ? "font-code" : ""}`}>{value}</span>
      </div>
    </div>
  );
};

const ScoreBreakdownRow = ({ factor, present, points }) => (
  <div className="flex items-center justify-between py-1.5">
    <span className="text-xs text-slate-400">{factor}</span>
    <div className="flex items-center gap-2">
      <span className={`font-code text-xs font-bold ${present ? "text-emerald-400" : "text-slate-600"}`}>
        {present ? `+${points}` : "0"}
      </span>
      <span className={`w-4 h-4 rounded-full flex items-center justify-center ${present ? "bg-emerald-500/20" : "bg-white/5"}`}>
        {present ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <X className="w-2.5 h-2.5 text-slate-600" />}
      </span>
    </div>
  </div>
);

export const SellerDetailDrawer = ({ seller, onClose, onFlag, onNotesUpdate, onExportSingle, onConfirm, onSkip }) => {
  const [notes, setNotes] = useState("");
  const [editingNotes, setEditingNotes] = useState(false);

  const handleOpen = (open) => { if (!open) onClose(); };

  if (!seller) return null;

  const sc = getScoreColor(seller.quality_score || 0);
  const STATUS_STYLES = {
    confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending_review: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    skipped: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    duplicate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <Sheet open={!!seller} onOpenChange={handleOpen}>
      <SheetContent className="bg-[#0d1117] border-white/[0.06] w-full sm:max-w-[420px] p-0 overflow-y-auto" data-testid="seller-detail-drawer">
        <div className="sticky top-0 z-10 bg-[#0d1117]/95 backdrop-blur-md border-b border-white/[0.04] p-4">
          <SheetHeader className="space-y-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-4">
                <SheetTitle className="font-heading text-base font-bold text-white truncate">{seller.seller_name}</SheetTitle>
                <SheetDescription className="text-xs text-slate-500">{seller.business_name_if_visible}</SheetDescription>
              </div>
              <LeadScoreBadge score={seller.quality_score || 0} size="lg" showLabel />
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline" className={`text-[10px] ${STATUS_STYLES[seller.status] || STATUS_STYLES.confirmed}`}>
                {seller.status?.replace("_", " ")}
              </Badge>
              <span className="font-code text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                {seller.marketplace?.replace("amazon.", "").toUpperCase()}
              </span>
              {seller.flagged && (
                <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 text-[10px]">
                  <Flag className="w-2.5 h-2.5 mr-1" /> Flagged
                </Badge>
              )}
            </div>
          </SheetHeader>
        </div>

        <div className="p-4 space-y-4">
          {seller.score_breakdown && (
            <div className="glass-card rounded-xl p-3">
              <h4 className="text-[10px] text-slate-500 uppercase tracking-widest mb-2 font-semibold">Score Breakdown</h4>
              {seller.score_breakdown.map((item, i) => (
                <ScoreBreakdownRow key={i} {...item} />
              ))}
            </div>
          )}

          <Separator className="bg-white/[0.04]" />

          <div>
            <h4 className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-semibold">Business Info</h4>
            <Field icon={User} label="Seller Name" value={seller.seller_name} />
            <Field icon={Building} label="Business" value={seller.business_name_if_visible} />
            <Field icon={Globe} label="Country" value={seller.country_if_visible} />
            <Field icon={MapPin} label="Address" value={seller.business_address_if_visible} />
          </div>

          <Separator className="bg-white/[0.04]" />

          <div>
            <h4 className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-semibold">Registration</h4>
            <Field icon={Hash} label="VAT Number" value={seller.vat_number_if_visible} mono />
            <Field icon={Hash} label="Registration" value={seller.registration_number_if_visible} mono />
          </div>

          <Separator className="bg-white/[0.04]" />

          <div>
            <h4 className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-semibold">Contact</h4>
            <Field icon={Phone} label="Phone" value={seller.public_phone_if_visible} mono />
            <Field icon={Mail} label="Email" value={seller.public_email_if_visible} mono />
          </div>

          <Separator className="bg-white/[0.04]" />

          <div>
            <h4 className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-semibold">Product</h4>
            <Field icon={FileText} label="Title" value={seller.product_title_short} />
            <Field icon={Tag} label="ASIN" value={seller.asin} mono />
            <Field icon={Tag} label="Brand" value={seller.brand_if_visible} />
            <Field icon={Tag} label="Source" value={seller.source_page_type} />
          </div>

          <Separator className="bg-white/[0.04]" />

          <div>
            <h4 className="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-semibold">Notes</h4>
            {editingNotes ? (
              <div className="flex gap-2">
                <Input value={notes} onChange={e => setNotes(e.target.value)} className="bg-[#0b0f14] border-white/10 text-xs h-8" placeholder="Add notes..." data-testid="notes-input" />
                <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-500" onClick={() => { onNotesUpdate(seller.id, notes); setEditingNotes(false); }} data-testid="save-notes-btn">Save</Button>
              </div>
            ) : (
              <button onClick={() => { setNotes(seller.notes || ""); setEditingNotes(true); }} className="text-xs text-slate-500 hover:text-blue-400 transition-colors w-full text-left py-1" data-testid="edit-notes-btn">
                {seller.notes || "Click to add notes..."}
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            {seller.status === "pending_review" && (
              <div className="flex gap-2">
                <Button onClick={() => onConfirm(seller.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white h-8 text-xs" data-testid="drawer-confirm-btn">
                  <Check className="w-3 h-3 mr-1" /> Confirm
                </Button>
                <Button onClick={() => onSkip(seller.id)} variant="outline" className="flex-1 bg-white/5 border-white/10 text-slate-300 h-8 text-xs" data-testid="drawer-skip-btn">
                  <X className="w-3 h-3 mr-1" /> Skip
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <Button onClick={() => onFlag(seller.id, !seller.flagged)} variant="outline" size="sm"
                className={`flex-1 h-8 text-xs ${seller.flagged ? "bg-red-500/10 text-red-400 border-red-500/20" : "bg-white/5 border-white/10 text-slate-300"}`}
                data-testid="drawer-flag-btn">
                <Flag className="w-3 h-3 mr-1" /> {seller.flagged ? "Unflag" : "Flag"}
              </Button>
              {seller.seller_profile_url && (
                <Button asChild variant="outline" size="sm" className="flex-1 bg-white/5 border-white/10 text-slate-300 h-8 text-xs">
                  <a href={seller.seller_profile_url} target="_blank" rel="noopener noreferrer" data-testid="drawer-profile-link">
                    <ExternalLink className="w-3 h-3 mr-1" /> Profile
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="text-[10px] text-slate-600 font-code pt-2 space-y-0.5">
            <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> Collected: {seller.collected_at?.slice(0, 16).replace("T", " ")}</div>
            <div>ID: {seller.id}</div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
