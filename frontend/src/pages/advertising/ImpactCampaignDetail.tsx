import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { mockImpactAdGroups, mockImpactCampaigns } from "@/data/mockImpactData";

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

export default function ImpactCampaignDetail() {
  const navigate = useNavigate();
  const { campaignId = "" } = useParams();
  const campaign = mockImpactCampaigns.find((c) => c.id === campaignId);
  const data = useMemo(() => mockImpactAdGroups.filter((ag) => ag.campaignId === campaignId), [campaignId]);

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
    { label: campaign?.name ?? "Campaign" },
  ];

  const handleDownload = () => toast.success("Exporting impact data as CSV...");

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title={campaign?.name ?? "Campaign"}
          subtitle="Ad groups within this campaign — compare impact across time periods"
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
                  ? `Showing ${selectedIds.size} selected ad group${selectedIds.size === 1 ? "" : "s"}`
                  : `Showing all ${data.length} ad groups — select rows below to filter`}
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
          searchPlaceholder="Search ad groups..."
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
          onRowClick={(id) => navigate(`/advertising/impact/campaigns/${campaignId}/${id}`)}
        />
      </div>
    </AppLayout>
  );
}
