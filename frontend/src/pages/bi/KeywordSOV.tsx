import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { SOVChart } from "@/components/bi/SOVChart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { keywordSOVData, sovTrendData } from "@/data/mockBrandSOV";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { cn } from "@/lib/utils";
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
  { label: "Business Intelligence", href: "/bi/keyword-sov" },
  { label: "Keyword SOV" },
];
export default function KeywordSOV() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeltas, setShowDeltas] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const filteredKeywords = keywordSOVData.filter((k) =>
    k.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedKeywords = filteredKeywords.slice((page - 1) * pageSize, page * pageSize);

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-success" />;
      case "down": return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Keyword Share of Voice"
          subtitle="Track SOV performance by keyword"
        />
        <AppTaskbar />

        <SOVChart data={sovTrendData} title="Keyword SOV Trend" subtitle="Hourly breakdown" />

        <div className="space-y-2">
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search keyword..."
            onDownload={() => toast.success("Exporting keyword SOV...")}
            showDeltas={showDeltas}
            onShowDeltasChange={setShowDeltas}
          />
          <div data-table-frame className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-card hover:bg-card">
                <TableHead>Keyword</TableHead>
                <TableHead className="text-right">Search Volume</TableHead>
                <TableHead className="text-right">Organic SOV</TableHead>
                <TableHead className="text-right">Sponsored SOV</TableHead>
                <TableHead className="text-right">Total SOV</TableHead>
                <TableHead className="text-center">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedKeywords.map((kw) => (
                <TableRow key={kw.id}>
                  <TableCell className="font-medium">{kw.keyword}</TableCell>
                  <TableCell className="text-right"><NumCell formatted={kw.searchVolume.toLocaleString()} id={kw.id} metric="searchVolume" show={showDeltas} /></TableCell>
                  <TableCell className="text-right"><NumCell formatted={`${kw.organicSOV.toFixed(1)}%`} id={kw.id} metric="organicSOV" show={showDeltas} /></TableCell>
                  <TableCell className="text-right"><NumCell formatted={`${kw.sponsoredSOV.toFixed(1)}%`} id={kw.id} metric="sponsoredSOV" show={showDeltas} /></TableCell>
                  <TableCell className="text-right font-medium"><NumCell formatted={`${kw.totalSOV.toFixed(1)}%`} id={kw.id} metric="totalSOV" show={showDeltas} /></TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {getTrendIcon(kw.trend)}
                      <span className={cn("text-sm", kw.trend === "up" && "text-success", kw.trend === "down" && "text-destructive", kw.trend === "stable" && "text-muted-foreground")}>
                        {kw.trendValue > 0 ? "+" : ""}{kw.trendValue.toFixed(1)}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredKeywords.length === 0 && (
                <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No keywords found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination page={page} pageSize={pageSize} totalItems={filteredKeywords.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </div>
        </div>
      </div>
</AppLayout>
  );
}
