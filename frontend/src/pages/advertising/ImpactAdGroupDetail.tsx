import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { ImpactTable } from "@/components/tables/ImpactTable";
import { Button } from "@/components/ui/button";
import { Download, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import { ImpactDateRangePair } from "@/components/advertising/ImpactDateRangePair";
import { ImpactMetricMultiSelect } from "@/components/advertising/ImpactMetricMultiSelect";
import { ImpactLegend, ImpactLineChart, impactCsvRows } from "@/components/charts/ImpactLineChart";
import { ChartCard } from "@/components/charts/ChartCard";
import { DateRange, ImpactMetricKey, addDays } from "@/lib/utils/impactSeries";
import { mockImpactAdGroups, mockImpactCampaigns, mockImpactProducts } from "@/data/mockImpactData";

const SORTABLE_FIELDS = [
  { id: "name", label: "Name" },
  { id: "impactPercentage", label: "Impact %" },
  { id: "adSpend", label: "Ad Spend" },
  { id: "adSales", label: "Ad Sales" },
  { id: "roas", label: "ROAS" },
];

function defaultRanges(): { previous: DateRange; impact: DateRange } {
  const today = new Date();
  const impactTo = today;
  const impactFrom = addDays(today, -6);
  const previousTo = addDays(impactFrom, -1);
  const previousFrom = addDays(previousTo, -6);
  return { previous: { from: previousFrom, to: previousTo }, impact: { from: impactFrom, to: impactTo } };
}

export default function ImpactAdGroupDetail() {
  const { campaignId = "", adGroupId = "" } = useParams();
  const campaign = mockImpactCampaigns.find((c) => c.id === campaignId);
  const adGroup = mockImpactAdGroups.find((a) => a.id === adGroupId);
  const data = useMemo(() => mockImpactProducts.filter((p) => p.adGroupId === adGroupId), [adGroupId]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<ImpactMetricKey[]>(["adSpend", "adSales"]);
  const [{ previous, impact }, setRanges] = useState(defaultRanges());
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectedItems = selectedIds.size > 0 ? data.filter((d) => selectedIds.has(d.id)) : data;

  const breadcrumbItems = [
    { label: "Advertising", href: "/advertising/impact" },
    { label: "Impact Analysis", href: "/advertising/impact" },
    { label: campaign?.name ?? "Campaign", href: `/advertising/impact/campaigns/${campaignId}` },
    { label: adGroup?.name ?? "Ad Group" },
  ];

  const handleDownload = () => toast.success("Exporting impact data as CSV...");

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title={adGroup?.name ?? "Ad Group"}
          subtitle="Products within this ad group — compare impact across time periods"
        />
        <AppTaskbar
          showRunButton
          onRun={() => toast.info("Analyzing impact comparison...")}
        >
          <ImpactDateRangePair previous={previous} impact={impact} onChange={setRanges} />
        </AppTaskbar>

        <ChartCard
          title="Performance Comparison"
          context={selectedIds.size > 0
                  ? `Showing ${selectedIds.size} selected product${selectedIds.size === 1 ? "" : "s"}`
                  : `Showing all ${data.length} products — select rows below to filter`}
          controls={<ImpactMetricMultiSelect selected={selectedMetrics} onChange={setSelectedMetrics} />}
          height={280}
          csv={() => ({ filename: "impact-comparison", rows: impactCsvRows(selectedItems, previous, impact, selectedMetrics) })}
          footer={<ImpactLegend metrics={selectedMetrics} />}
        >
          {({ height }) => <ImpactLineChart items={selectedItems} previous={previous} impact={impact} metrics={selectedMetrics} height={height} />}
        </ChartCard>

        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search products..."
          onDownload={handleDownload}
          sortableFields={SORTABLE_FIELDS}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={(f, d) => { setSortField(f); setSortDirection(d); }}
        />

        <ImpactTable
          data={data}
          searchQuery={searchQuery}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>
    </AppLayout>
  );
}
