import { Check, X, User, Building, MapPin, Phone, Mail, Hash, Globe, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const Field = ({ icon: Icon, label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 py-1.5">
      <Icon className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" strokeWidth={1.5} />
      <div className="flex-1 min-w-0">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider block">{label}</span>
        <span className="text-sm text-white font-code break-all">{value}</span>
      </div>
    </div>
  );
};

export const ManualReviewDialog = ({ seller, onConfirm, onSkip, onClose }) => {
  if (!seller) return null;

  return (
    <Dialog open={!!seller} onOpenChange={() => onClose()}>
      <DialogContent className="bg-[#141a22] border-white/10 max-w-lg" data-testid="manual-review-dialog">
        <DialogHeader>
          <DialogTitle className="font-heading text-white flex items-center gap-2">
            Manual Review
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
              Pending
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Review extracted seller data before saving
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-1 max-h-[50vh] overflow-y-auto pr-2">
          <Field icon={User} label="Seller Name" value={seller.seller_name} />
          <Field icon={Building} label="Business Name" value={seller.business_name_if_visible} />
          <Field icon={Globe} label="Marketplace" value={seller.marketplace} />
          <Field icon={MapPin} label="Country" value={seller.country_if_visible} />
          <Field icon={MapPin} label="Address" value={seller.business_address_if_visible} />
          <Separator className="bg-white/5 my-2" />
          <Field icon={Hash} label="VAT Number" value={seller.vat_number_if_visible} />
          <Field icon={Hash} label="Registration" value={seller.registration_number_if_visible} />
          <Field icon={Phone} label="Phone" value={seller.public_phone_if_visible} />
          <Field icon={Mail} label="Email" value={seller.public_email_if_visible} />
          <Separator className="bg-white/5 my-2" />
          <Field icon={FileText} label="Product" value={seller.product_title_short} />
          <Field icon={Hash} label="ASIN" value={seller.asin} />
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onSkip(seller.id)}
            className="bg-white/5 border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-slate-300"
            data-testid="review-skip-btn"
          >
            <X className="w-4 h-4 mr-1.5" /> Skip
          </Button>
          <Button
            onClick={() => onConfirm(seller.id)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            data-testid="review-confirm-btn"
          >
            <Check className="w-4 h-4 mr-1.5" /> Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
