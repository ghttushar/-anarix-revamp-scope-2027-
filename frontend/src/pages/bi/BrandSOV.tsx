import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { SOVChart } from "@/components/bi/SOVChart";
import { SOVKPIStrip } from "@/components/bi/SOVKPIStrip";
import { BrandCoverageTable } from "@/components/bi/BrandCoverageTable";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brands, sovTrendData, sovMetrics } from "@/data/mockBrandSOV";
import { toast } from "sonner";
const breadcrumbItems = [
  { label: "Business Intelligence", href: "/bi/brand-sov" },
  { label: "Brand SOV" },
];
export default function BrandSOV() {
  const [keyword, setKeyword] = useState("memory foam mattress");
  const [dateRange, setDateRange] = useState("today");
  const [position, setPosition] = useState("all");
  const [frequency, setFrequency] = useState("hourly");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeltas, setShowDeltas] = useState(false);

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Brand Share of Voice"
          subtitle="Track brand visibility across search results"
        />

        <AppTaskbar
          showDateRange
          filters={[
            { key: "position", label: "Position", value: position, onChange: setPosition, options: [
              { value: "all", label: "All" },
              { value: "1", label: "Position 1" },
              { value: "1-3", label: "Top 3" },
              { value: "1-10", label: "Top 10" },
            ] },
            { key: "frequency", label: "Frequency", value: frequency, onChange: setFrequency, options: [
              { value: "hourly", label: "Hourly" },
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
            ] },
          ]}
          showRunButton
          onRun={() => toast.info("Running SOV analysis...")}
        >
          <div className="relative w-[200px]">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search keyword…" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="h-8 border-0 bg-muted/50 pl-8 text-xs shadow-none focus-visible:ring-1" />
          </div>
        </AppTaskbar>

        <SOVKPIStrip metrics={sovMetrics} />
        <SOVChart data={sovTrendData} title="Share of Voice Trend" subtitle={`Jan 31 (${frequency})`} />

        <div>
          <h2 className="text-base font-semibold mb-4">Brand Coverage</h2>
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search brands..."
            onDownload={() => toast.success("Exporting SOV data...")}
            showDeltas={showDeltas}
            onShowDeltasChange={setShowDeltas}
          />
          <BrandCoverageTable brands={brands} showDeltas={showDeltas} onViewTrend={(brandId) => console.log("View trend for brand:", brandId)} />
        </div>
      </div>
</AppLayout>
  );
}
