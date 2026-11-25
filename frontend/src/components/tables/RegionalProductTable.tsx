import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { useState } from "react";
import {
  Table, TableBody, TableCell, TableHeader, TableRow, TableTotalsRow } from "@/components/ui/table";
import { profitabilityProducts } from "@/data/mockProfitability";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { TablePagination } from "@/components/tables/TablePagination";
import { SortableTableHead, sortData, usePinning } from "@/components/tables/SortableTableHead";

interface RegionalProductTableProps {
  searchValue?: string;
  /** The toolbar's Delta toggle: show each value's period change under it. */
  showDeltas?: boolean;
  sortField?: string | null;
  sortDirection?: "asc" | "desc";
}

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

const regionAssignments = [
  { region: "United States", flag: "🇺🇸", products: profitabilityProducts.slice(0, 3) },
  { region: "Canada", flag: "🇨🇦", products: profitabilityProducts.slice(3, 4) },
  { region: "Mexico", flag: "🇲🇽", products: profitabilityProducts.slice(4, 5) },
];

const PINNABLE = ["units", "gmv", "authSales", "adSpend", "netProfit", "margin"];
const FIXED_OFFSET = 300;

export function RegionalProductTable({ searchValue = "", showDeltas = false, sortField: externalSortField = null, sortDirection: externalSortDirection = "asc" }: RegionalProductTableProps) {
  const withDelta = (formatted: string, id: string, metric: string) => (
    <div className="flex flex-col items-end">
      <span>{formatted}</span>
      {showDeltas && <DeltaBadge value={getDelta(id, metric)} />}
    </div>
  );
  const { formatCurrency } = useCurrency();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const { pinnedColumns, handlePinToggle, ps, pc } = usePinning(PINNABLE, FIXED_OFFSET);

  const allProducts = regionAssignments.flatMap((ra) =>
    ra.products.map((p) => ({ ...p, regionName: ra.region, regionFlag: ra.flag }))
  );

  const filtered = allProducts.filter((p) =>
    p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    p.itemId.toLowerCase().includes(searchValue.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchValue.toLowerCase())
  );

  const sorted = sortData(filtered, externalSortField, externalSortDirection);
  const paginated = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const totals = filtered.reduce(
    (acc, p) => ({
      units: acc.units + p.units,
      gmv: acc.gmv + p.gmv,
      authSales: acc.authSales + p.authSales,
      adSpend: acc.adSpend + p.adSpend,
      netProfit: acc.netProfit + p.netProfit,
    }),
    { units: 0, gmv: 0, authSales: 0, adSpend: 0, netProfit: 0 }
  );
  const totalMargin = totals.gmv > 0 ? (totals.netProfit / totals.gmv) * 100 : 0;

  const sp = { pinnedColumns, onPinToggle: handlePinToggle };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-card hover:bg-card">
              <SortableTableHead field="name" {...sp} isFixed className="sticky left-0 z-20 bg-card min-w-[300px] border-r border-border">Product Details</SortableTableHead>
              <SortableTableHead field="units" {...sp} className={cn("text-right", pc("units", true))} style={ps("units")} align="right">Units</SortableTableHead>
              <SortableTableHead field="gmv" {...sp} className={cn("text-right", pc("gmv", true))} style={ps("gmv")} align="right">GMV</SortableTableHead>
              <SortableTableHead field="authSales" {...sp} className={cn("text-right", pc("authSales", true))} style={ps("authSales")} align="right">Auth Sales</SortableTableHead>
              <SortableTableHead field="adSpend" {...sp} className={cn("text-right", pc("adSpend", true))} style={ps("adSpend")} align="right">Ad Spend</SortableTableHead>
              <SortableTableHead field="netProfit" {...sp} className={cn("text-right", pc("netProfit", true))} style={ps("netProfit")} align="right">Net Profit</SortableTableHead>
              <SortableTableHead field="margin" {...sp} className={cn("text-right", pc("margin", true))} style={ps("margin")} align="right">Margin</SortableTableHead>
            </TableRow>
            <TableTotalsRow>
              <TableCell className="sticky left-0 z-10 bg-card border-r border-border">Total ({filtered.length} products)</TableCell>
              <TableCell className="text-right text-foreground">{formatNumber(totals.units)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(totals.gmv)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(totals.authSales)}</TableCell>
              <TableCell className="text-right text-foreground">{formatCurrency(totals.adSpend)}</TableCell>
              <TableCell className="text-right font-medium text-foreground">{formatCurrency(totals.netProfit)}</TableCell>
              <TableCell className="text-right text-foreground">{totalMargin.toFixed(1)}%</TableCell>
            </TableTotalsRow>
          </TableHeader>
          <TableBody>
            {paginated.map((product) => {
              const margin = product.gmv > 0 ? (product.netProfit / product.gmv) * 100 : 0;
              return (
                <TableRow key={product.id} className="hover:bg-muted/30 group">
                  <TableCell className="sticky left-0 z-10 bg-card group-hover:bg-muted transition-colors border-r border-border">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md border border-border object-cover flex-shrink-0" />
                      <div className="flex flex-col min-w-0">
                        <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{product.regionFlag} {product.regionName}</span>
                          <span>•</span>
                          <span>{product.itemId}</span>
                          <span>•</span>
                          <span>{product.sku}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell style={ps("units")} className={cn("text-right text-foreground", pc("units"))}>{withDelta(formatNumber(product.units), product.id, "units")}</TableCell>
                  <TableCell style={ps("gmv")} className={cn("text-right text-foreground", pc("gmv"))}>{withDelta(formatCurrency(product.gmv), product.id, "gmv")}</TableCell>
                  <TableCell style={ps("authSales")} className={cn("text-right text-foreground", pc("authSales"))}>{withDelta(formatCurrency(product.authSales), product.id, "authSales")}</TableCell>
                  <TableCell style={ps("adSpend")} className={cn("text-right text-foreground", pc("adSpend"))}>{withDelta(formatCurrency(product.adSpend), product.id, "adSpend")}</TableCell>
                  <TableCell style={ps("netProfit")} className={cn("text-right font-medium text-foreground", pc("netProfit"))}>{withDelta(formatCurrency(product.netProfit), product.id, "netProfit")}</TableCell>
                  <TableCell style={ps("margin")} className={cn("text-right text-foreground", pc("margin"))}>{withDelta(`${margin.toFixed(1)}%`, product.id, "margin")}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <TablePagination page={currentPage} pageSize={pageSize} totalItems={filtered.length} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
