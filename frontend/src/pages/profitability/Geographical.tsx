import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { GeographyMap } from "@/components/profitability/GeographyMap";
import { RegionStatsPanel } from "@/components/profitability/RegionStatsPanel";
import { RegionalTable } from "@/components/tables/RegionalTable";
import { RegionalProductTable } from "@/components/tables/RegionalProductTable";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { geographicalData } from "@/data/mockProfitability";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";

const byId = (id: string) => geographicalData.find((g) => g.id === id);
const regionLookup: Record<string, typeof geographicalData[0]> = {
  // The map emits ISO-3 country codes.
  USA: geographicalData[0],
  CAN: byId("geo-ca") || geographicalData[0],
  MEX: byId("geo-mx") || geographicalData[0],
  US: geographicalData[0],
  CA: geographicalData[0].children?.[0] || geographicalData[0],
  TX: geographicalData[0].children?.[1] || geographicalData[0],
  NY: geographicalData[0].children?.[2] || geographicalData[0],
  FL: geographicalData[0].children?.[3] || geographicalData[0],
};

const COLUMN_DEFS = [
  { id: "stocks", label: "Stocks", visible: true },
  { id: "orders", label: "Orders", visible: true },
  { id: "unitsSold", label: "Units Sold", visible: true },
  { id: "refunds", label: "Refunds", visible: true },
  { id: "sales", label: "Sales", visible: true },
  { id: "amazonFees", label: "Amazon Fees", visible: true },
  { id: "sellableReturns", label: "Sellable Returns", visible: true },
];

const FILTER_FIELDS = ["Region", "Sales", "Orders", "Stocks"];

const SORTABLE_FIELDS = [
  { id: "region", label: "Region" },
  { id: "stocks", label: "Stocks" },
  { id: "orders", label: "Orders" },
  { id: "unitsSold", label: "Units Sold" },
  { id: "sales", label: "Sales" },
];


const breadcrumbItems = [
  { label: "Profitability", href: "/profitability/geo" },
  { label: "Geographical Data" },
];
export default function Geographical() {
  const { formatCurrency } = useCurrency();
  const [selectedRegionCode, setSelectedRegionCode] = useState<string>("USA");
  const [drillRegionId, setDrillRegionId] = useState<string | null>(null);
  const [viewLevel, setViewLevel] = useState<"state" | "product">("state");
  const [searchValue, setSearchValue] = useState("");
  const [columns, setColumns] = useState(COLUMN_DEFS);
  const [activeFilters, setActiveFilters] = useState<any[]>([]);
  const [showDeltas, setShowDeltas] = useState(false);
  const [catalogue, setCatalogue] = useState("all");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const selectedRegion = regionLookup[selectedRegionCode] || geographicalData[0];

  const mobileRegions = useMemo(() => {
    if (!drillRegionId) return geographicalData;
    const parent = geographicalData.find((r) => r.id === drillRegionId);
    return parent?.children || [];
  }, [drillRegionId]);


  const handleColumnToggle = (id: string) => {
    setColumns((prev) => prev.map((c) => c.id === id ? { ...c, visible: !c.visible } : c));
  };

  const handleDownload = () => toast.success("Exporting geographical data...");

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Geographical"
          accent="Data"
          subtitle="Where your shoppers are — and what each market earns"
        />
        <AppTaskbar showDateRange showRunButton onRun={() => toast.info("Refreshing data...")} />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 h-full">
            <GeographyMap selectedRegion={selectedRegionCode} onRegionSelect={setSelectedRegionCode} />
          </div>
          <div className="h-full">
            <RegionStatsPanel region={selectedRegion} dateRange="Jan 1 - Jan 30, 2026" />
          </div>
        </div>

        <div className="space-y-3">
          <DataTableToolbar
            view={{ value: viewLevel, onChange: (v) => setViewLevel(v as typeof viewLevel), items: [
              { value: "state", label: "State level" },
              { value: "product", label: "Product level" },
            ] }}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder={viewLevel === "state" ? "Search region..." : "Search by Product Name / Item ID..."}
            columns={columns}
            onColumnToggle={handleColumnToggle}
            onSelectAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: true })))}
            onClearAllColumns={() => setColumns((prev) => prev.map((c) => ({ ...c, visible: false })))}
            activeFilters={activeFilters}
            onFiltersChange={setActiveFilters}
            filterFields={FILTER_FIELDS}
            onDownload={handleDownload}
            showDeltas={showDeltas}
            onShowDeltasChange={setShowDeltas}
            showUpload
            onUpload={(files) => toast.info(`Uploading ${files[0]?.name}...`)}
            uploadTitle="Upload COGS"
            sortableFields={SORTABLE_FIELDS}
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={(f, d) => { setSortField(f); setSortDirection(d); }}
          />

          {/* Each table brings its own frame; with nothing in between, the toolbar joins it as one card. */}
          {viewLevel === "state" ? (
            <RegionalTable data={geographicalData} searchValue={searchValue} showDeltas={showDeltas} />
          ) : (
            <RegionalProductTable searchValue={searchValue} showDeltas={showDeltas} />
          )}
        </div>
      </div>
</AppLayout>

  );
}
