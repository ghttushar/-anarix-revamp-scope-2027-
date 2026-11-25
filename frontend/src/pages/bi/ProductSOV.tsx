import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { SOVChart } from "@/components/bi/SOVChart";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { productSOVData, sovTrendData } from "@/data/mockBrandSOV";
import { toast } from "sonner";
import { TablePagination } from "@/components/tables/TablePagination";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";

const NumCell = ({ formatted, id, metric, show }: { formatted: string; id: string; metric: string; show: boolean }) => (
  <div className="flex flex-col items-end">
    <span>{formatted}</span>
    {show && <DeltaBadge value={getDelta(id, metric)} />}
  </div>
);

const breadcrumbItems = [
  { label: "Business Intelligence", href: "/bi/product-sov" },
  { label: "Product SOV" },
];
export default function ProductSOV() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeltas, setShowDeltas] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const filteredProducts = productSOVData.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Product Share of Voice"
          subtitle="Track SOV performance by product"
        />
        <AppTaskbar />

        <SOVChart data={sovTrendData} title="Product SOV Trend" subtitle="Hourly breakdown" />

        <div className="space-y-2">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by product name or SKU..."
            onDownload={() => toast.success("Exporting product SOV...")}
            showDeltas={showDeltas}
            onShowDeltasChange={setShowDeltas}
          />
          <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-card hover:bg-card">
                <TableHead className="min-w-[300px]">Product</TableHead>
                <TableHead className="text-right">Avg Position</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="text-right">Organic SOV</TableHead>
                <TableHead className="text-right">Sponsored SOV</TableHead>
                <TableHead className="text-right">Total SOV</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="h-10 w-10 rounded-md border border-border object-cover" />
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
                        <span className="text-xs text-muted-foreground">{product.sku}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right"><NumCell formatted={`#${product.position}`} id={product.id} metric="position" show={showDeltas} /></TableCell>
                  <TableCell className="text-right"><NumCell formatted={product.impressions.toLocaleString()} id={product.id} metric="impressions" show={showDeltas} /></TableCell>
                  <TableCell className="text-right"><NumCell formatted={`${product.organicSOV.toFixed(1)}%`} id={product.id} metric="organicSOV" show={showDeltas} /></TableCell>
                  <TableCell className="text-right"><NumCell formatted={`${product.sponsoredSOV.toFixed(1)}%`} id={product.id} metric="sponsoredSOV" show={showDeltas} /></TableCell>
                  <TableCell className="text-right font-medium"><NumCell formatted={`${product.totalSOV.toFixed(1)}%`} id={product.id} metric="totalSOV" show={showDeltas} /></TableCell>
                </TableRow>
              ))}
              {filteredProducts.length === 0 && (
                <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No products found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination page={page} pageSize={pageSize} totalItems={filteredProducts.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </div>
        </div>
      </div>
</AppLayout>
  );
}
