import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";

export const FiltersPanel = ({ filters, searchQuery, onFilterChange, onSearchChange, totalSellers }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);

  const activeFilterCount = Object.values(filters).filter(v => v).length + (searchQuery ? 1 : 0);

  const handleClear = () => {
    onFilterChange({});
    onSearchChange("");
    setDateFrom(null);
    setDateTo(null);
  };

  const updateFilter = (key, value) => {
    const next = { ...filters, [key]: value || undefined };
    Object.keys(next).forEach(k => { if (!next[k]) delete next[k]; });
    onFilterChange(next);
  };

  const handleDateFrom = (d) => {
    setDateFrom(d);
    updateFilter("date_from", d ? d.toISOString() : undefined);
  };

  const handleDateTo = (d) => {
    setDateTo(d);
    updateFilter("date_to", d ? d.toISOString() : undefined);
  };

  return (
    <div className="glass-card rounded-2xl p-4 space-y-3" data-testid="filters-panel">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="Search sellers, businesses, VAT, products..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="pl-9 bg-[#0b0f14] border-white/10 h-9 text-sm"
            data-testid="search-input"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={`bg-white/5 border-white/10 hover:bg-white/10 text-white h-9 px-3 ${showFilters ? 'border-blue-500/30 text-blue-400' : ''}`}
          data-testid="toggle-filters-btn"
        >
          <SlidersHorizontal className="w-4 h-4 mr-1.5" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-blue-500/20 text-blue-400">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleClear} className="h-9 text-xs text-slate-400 hover:text-white" data-testid="clear-filters-btn">
            <X className="w-3.5 h-3.5 mr-1" /> Clear
          </Button>
        )}
        <span className="text-xs text-slate-500 shrink-0">
          {totalSellers?.toLocaleString() || 0} sellers
        </span>
      </div>

      {showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2 border-t border-white/5 animate-fade-in-up">
          <div className="space-y-1">
            <Label className="text-[10px] text-slate-500 uppercase">Marketplace</Label>
            <Select value={filters.marketplace || "all"} onValueChange={v => updateFilter("marketplace", v === "all" ? undefined : v)} data-testid="filter-marketplace">
              <SelectTrigger className="bg-[#0b0f14] border-white/10 h-8 text-xs" data-testid="filter-marketplace-trigger">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="amazon.de">amazon.de</SelectItem>
                <SelectItem value="amazon.es">amazon.es</SelectItem>
                <SelectItem value="amazon.fr">amazon.fr</SelectItem>
                <SelectItem value="amazon.it">amazon.it</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] text-slate-500 uppercase">Country</Label>
            <Select value={filters.country || "all"} onValueChange={v => updateFilter("country", v === "all" ? undefined : v)} data-testid="filter-country">
              <SelectTrigger className="bg-[#0b0f14] border-white/10 h-8 text-xs" data-testid="filter-country-trigger">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Germany">Germany</SelectItem>
                <SelectItem value="Spain">Spain</SelectItem>
                <SelectItem value="France">France</SelectItem>
                <SelectItem value="Italy">Italy</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5">
              <Checkbox checked={!!filters.has_phone} onCheckedChange={v => updateFilter("has_phone", v || undefined)} id="fp" data-testid="filter-has-phone" />
              <Label htmlFor="fp" className="text-xs text-slate-400 cursor-pointer">Has Phone</Label>
            </div>
            <div className="flex items-center gap-1.5">
              <Checkbox checked={!!filters.has_email} onCheckedChange={v => updateFilter("has_email", v || undefined)} id="fe" data-testid="filter-has-email" />
              <Label htmlFor="fe" className="text-xs text-slate-400 cursor-pointer">Has Email</Label>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-1.5">
              <Checkbox checked={!!filters.has_vat} onCheckedChange={v => updateFilter("has_vat", v || undefined)} id="fv" data-testid="filter-has-vat" />
              <Label htmlFor="fv" className="text-xs text-slate-400 cursor-pointer">Has VAT</Label>
            </div>
            <div className="flex items-center gap-1.5">
              <Checkbox checked={!!filters.has_registration} onCheckedChange={v => updateFilter("has_registration", v || undefined)} id="fr" data-testid="filter-has-reg" />
              <Label htmlFor="fr" className="text-xs text-slate-400 cursor-pointer">Has Reg #</Label>
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] text-slate-500 uppercase">Date From</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-full bg-[#0b0f14] border-white/10 h-8 text-xs justify-start text-slate-300" data-testid="date-from-btn">
                  {dateFrom ? format(dateFrom, "MMM d, yyyy") : "Select..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateFrom} onSelect={handleDateFrom} data-testid="date-from-calendar" />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-1">
            <Label className="text-[10px] text-slate-500 uppercase">Date To</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-full bg-[#0b0f14] border-white/10 h-8 text-xs justify-start text-slate-300" data-testid="date-to-btn">
                  {dateTo ? format(dateTo, "MMM d, yyyy") : "Select..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={dateTo} onSelect={handleDateTo} data-testid="date-to-calendar" />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
};
