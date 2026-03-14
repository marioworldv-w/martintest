import { ExternalLink, Trash2, ChevronLeft, ChevronRight, Inbox } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const STATUS_STYLES = {
  confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  pending_review: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  skipped: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  duplicate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const MP_BADGE = {
  "amazon.de": "DE",
  "amazon.es": "ES",
  "amazon.fr": "FR",
  "amazon.it": "IT",
};

const formatDate = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return ""; }
};

export const SellersTable = ({ sellers = [], totalSellers = 0, totalPages = 1, currentPage = 1, onPageChange, onDeleteSeller }) => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden" data-testid="sellers-table">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="font-heading font-semibold text-sm text-white">Recent Sellers</h2>
        <span className="text-xs text-slate-500 font-code">
          Page {currentPage} / {totalPages}
        </span>
      </div>

      {sellers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-500">
          <Inbox className="w-12 h-12 mb-3 text-slate-700" strokeWidth={1} />
          <p className="text-sm">No sellers found</p>
          <p className="text-xs text-slate-600 mt-1">Seed demo data or start scanning</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/5 hover:bg-transparent">
                <TableHead className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider w-[60px]">MP</TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Seller</TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Product</TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Country</TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">VAT / Reg</TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Phone</TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Email</TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Date</TableHead>
                <TableHead className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Status</TableHead>
                <TableHead className="w-[60px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {sellers.map((s, i) => (
                <TableRow
                  key={s.id}
                  className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${i % 2 === 1 ? 'bg-white/[0.01]' : ''}`}
                  data-testid={`seller-row-${i}`}
                >
                  <TableCell className="py-2.5">
                    <span className="font-code text-[10px] font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                      {MP_BADGE[s.marketplace] || "??"}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex flex-col">
                      <span className="text-sm text-white font-medium leading-tight">{s.seller_name}</span>
                      <span className="text-[10px] text-slate-500 leading-tight">{s.business_name_if_visible}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5 hidden md:table-cell">
                    <span className="text-xs text-slate-400 line-clamp-1">{s.product_title_short}</span>
                  </TableCell>
                  <TableCell className="py-2.5 hidden lg:table-cell">
                    <span className="text-xs text-slate-300">{s.country_if_visible}</span>
                  </TableCell>
                  <TableCell className="py-2.5 hidden lg:table-cell">
                    <div className="flex flex-col">
                      {s.vat_number_if_visible && <span className="font-code text-[10px] text-slate-300">{s.vat_number_if_visible}</span>}
                      {s.registration_number_if_visible && <span className="font-code text-[10px] text-slate-500">{s.registration_number_if_visible}</span>}
                      {!s.vat_number_if_visible && !s.registration_number_if_visible && <span className="text-[10px] text-slate-600">--</span>}
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5 hidden xl:table-cell">
                    <span className="font-code text-[10px] text-slate-400">{s.public_phone_if_visible || "--"}</span>
                  </TableCell>
                  <TableCell className="py-2.5 hidden xl:table-cell">
                    <span className="font-code text-[10px] text-slate-400 break-all">{s.public_email_if_visible || "--"}</span>
                  </TableCell>
                  <TableCell className="py-2.5 hidden md:table-cell">
                    <span className="font-code text-[10px] text-slate-500">{formatDate(s.collected_at)}</span>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${STATUS_STYLES[s.status] || STATUS_STYLES.confirmed}`}>
                      {s.status?.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center gap-1">
                      {s.seller_profile_url && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a href={s.seller_profile_url} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-blue-400 transition-colors" data-testid={`seller-link-${i}`}>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent><p className="text-xs">Open seller page</p></TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button onClick={() => onDeleteSeller(s.id)} className="text-slate-600 hover:text-red-400 transition-colors" data-testid={`seller-delete-${i}`}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent><p className="text-xs">Delete seller</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="p-3 border-t border-white/5 flex items-center justify-between">
          <Button
            variant="ghost" size="sm"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="text-xs text-slate-400 hover:text-white h-7"
            data-testid="prev-page-btn"
          >
            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) { pageNum = i + 1; }
              else if (currentPage <= 3) { pageNum = i + 1; }
              else if (currentPage >= totalPages - 2) { pageNum = totalPages - 4 + i; }
              else { pageNum = currentPage - 2 + i; }
              return (
                <Button
                  key={pageNum} variant="ghost" size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className={`w-7 h-7 p-0 text-xs ${currentPage === pageNum ? 'bg-blue-500/20 text-blue-400' : 'text-slate-500 hover:text-white'}`}
                  data-testid={`page-${pageNum}-btn`}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="ghost" size="sm"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="text-xs text-slate-400 hover:text-white h-7"
            data-testid="next-page-btn"
          >
            Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};
