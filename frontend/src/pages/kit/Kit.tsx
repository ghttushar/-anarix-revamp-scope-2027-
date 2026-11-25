import { useState, type ReactNode } from "react";
import { Bell, ChevronDown, Columns3, Download, Filter, Moon, Pencil, Plus, Search, Sun, TrendingUp } from "lucide-react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { BarChip, BarIconButton, BarDivider, BarSegmented, BAR_CHIP_CLASS } from "@/components/bars";
import { Workspace, Zone, ZoneHeader, StatusDot } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { StatusBadge } from "@/components/status/StatusBadge";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { InlineKPIStrip } from "@/components/advertising/InlineKPIStrip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableTotalsRow } from "@/components/ui/table";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

/** A labelled specimen. */
function Spec({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <div className="flex min-h-[34px] items-center gap-2">{children}</div>
      <span className="text-2xs text-muted-foreground">{label}</span>
    </div>
  );
}

function Swatch({ token, note, className, style }: { token: string; note: string; className?: string; style?: React.CSSProperties }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <div className={cn("h-12 rounded-md", className)} style={style} />
      <span className="truncate text-2xs font-medium text-foreground">{token}</span>
      <span className="truncate text-2xs text-muted-foreground">{note}</span>
    </div>
  );
}

const DATE_OPTS = [{ value: "7d", label: "Last 7 days" }, { value: "30d", label: "Last 30 days" }];
const METRIC_OPTS = ["Ad Spend", "Ad Sales", "ROAS", "Clicks", "CTR"].map((m) => ({ value: m, label: m }));
const KPIS = [
  { label: "Ad Spend", value: 8456, previousValue: 7235, format: "currency", accentColor: "primary" },
  { label: "Ad Sales", value: 38235, previousValue: 32457, format: "currency", accentColor: "success" },
  { label: "ROAS", value: 4.52, previousValue: 4.49, format: "decimal", accentColor: "warning" },
  { label: "Impressions", value: 1200000, previousValue: 1098234, format: "number", accentColor: "destructive" },
] as const;

/**
 * The "pro" UI kit showcase: every foundation and component of the dense, non-boxy kit, in every state, on the
 * canvas and inside a sheet. Rendered with data-kit="pro" (see components/kit/routes.ts).
 */
export default function Kit() {
  const { resolvedTheme, setTheme } = useTheme();
  const [freq, setFreq] = useState("Daily");
  const [metrics, setMetrics] = useState(["Ad Spend", "Ad Sales"]);
  const [seg, setSeg] = useState("products");
  const [tab, setTab] = useState("campaigns");
  const [on, setOn] = useState(true);

  return (
    <AppLayout>
      <div className="space-y-4">
        <PageHeader title="UI kit" subtitle="Dense pro kit: one sheet per workspace, zones split by dividers, inset fields, real state colours." />
        <AppTaskbar showDateRange showAdType showFrequency showRunButton>
          <Button size="xs" variant="ghost" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
            {resolvedTheme === "dark" ? <Sun /> : <Moon />} {resolvedTheme === "dark" ? "Light" : "Dark"}
          </Button>
        </AppTaskbar>

        {/* Foundations */}
        <Workspace>
          <Zone header={<ZoneHeader title="Surfaces" context="canvas · sheet · inset · raised" />}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Swatch token="--background" note="canvas (the page)" className="bg-background ring-1 ring-border" />
              <Swatch token="--card" note="sheet (one per workspace)" className="bg-card ring-1 ring-border" />
              <Swatch token="--field" note="inset well (fields, tracks)" className="bg-field" />
              <Swatch token="shadow-e2" note="raised (menus, island)" className="bg-card shadow-e2" />
            </div>
          </Zone>
          <Zone header={<ZoneHeader title="States" context="never the canvas colour, readable on white" />}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <Swatch token="--hover" note="peri-100" className="bg-hover" />
              <Swatch token="--selected" note="peri-150 + peri-700 text" className="bg-selected" />
              <Swatch token="focus" note="2px peri-500 ring" className="bg-card ring-2 ring-ring" />
              <Swatch token="--border" note="zone divider (haze-200)" className="bg-border" />
              <Swatch token="--control-border" note="field outline on canvas" style={{ background: "hsl(var(--control-border))" }} />
            </div>
          </Zone>
          <Zone header={<ZoneHeader title="Shape & density" context="radius 4 / 6 / 8 · controls 30px · rows ~34px" />}>
            <div className="flex flex-wrap items-end gap-6">
              <Spec label="rounded-sm · 4px"><div className="h-10 w-16 rounded-sm bg-selected" /></Spec>
              <Spec label="rounded-md · 6px (controls)"><div className="h-10 w-16 rounded-md bg-selected" /></Spec>
              <Spec label="rounded-lg · 8px (sheets, menus)"><div className="h-10 w-16 rounded-lg bg-selected" /></Spec>
              <Spec label="shadow-e1 (sheet)"><div className="h-10 w-16 rounded-lg bg-card shadow-e1" /></Spec>
              <Spec label="shadow-e2 (menus)"><div className="h-10 w-16 rounded-lg bg-card shadow-e2" /></Spec>
              <Spec label="shadow-e3 (dialogs)"><div className="h-10 w-16 rounded-lg bg-card shadow-e3" /></Spec>
            </div>
          </Zone>
          <Zone header={<ZoneHeader title="Type" context="old-design scale" />}>
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-foreground">
              <span className="text-2xl font-semibold">Page 22</span>
              <span className="text-xl font-semibold">Section 17.6</span>
              <span className="text-base">Title 15.4</span>
              <span className="text-sm">Body 14.3</span>
              <span className="text-xs">Table 13.2</span>
              <span className="text-caption text-muted-foreground">Caption 12.1</span>
              <span className="text-2xs uppercase tracking-wide text-muted-foreground">Label 11</span>
            </div>
          </Zone>
        </Workspace>

        {/* Controls */}
        <Workspace>
          <Zone header={<ZoneHeader title="Dropdown chips" context="outlined on the canvas, ghost inside a sheet" />}>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-md bg-background p-3">
                <p className="mb-2 text-2xs uppercase tracking-wide text-muted-foreground">On the canvas</p>
                <div className="flex flex-wrap items-center gap-2" data-canvas>
                  <Spec label="rest"><span className={BAR_CHIP_CLASS}><span className="text-muted-foreground">Frequency</span> Daily <ChevronDown className="h-3.5 w-3.5 opacity-60" /></span></Spec>
                  <Spec label="hover"><span className={cn(BAR_CHIP_CLASS, "bg-hover")}><span className="text-muted-foreground">Frequency</span> Daily <ChevronDown className="h-3.5 w-3.5 opacity-60" /></span></Spec>
                  <Spec label="open"><span className={cn(BAR_CHIP_CLASS, "bg-selected")}><span className="text-muted-foreground">Frequency</span> Daily <ChevronDown className="h-3.5 w-3.5 opacity-60" /></span></Spec>
                  <Spec label="disabled"><span className={cn(BAR_CHIP_CLASS, "opacity-50")}><span className="text-muted-foreground">Frequency</span> Daily <ChevronDown className="h-3.5 w-3.5 opacity-60" /></span></Spec>
                </div>
              </div>
              <div data-zone className="rounded-md p-3 ring-1 ring-border">
                <p className="mb-2 text-2xs uppercase tracking-wide text-muted-foreground">Inside a sheet (ghost)</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Spec label="rest"><span className={BAR_CHIP_CLASS}><span className="text-muted-foreground">Metrics</span> 2/4 <ChevronDown className="h-3.5 w-3.5 opacity-60" /></span></Spec>
                  <Spec label="hover"><span className={cn(BAR_CHIP_CLASS, "bg-hover")}><span className="text-muted-foreground">Metrics</span> 2/4 <ChevronDown className="h-3.5 w-3.5 opacity-60" /></span></Spec>
                  <Spec label="open"><span className={cn(BAR_CHIP_CLASS, "bg-selected")}><span className="text-muted-foreground">Metrics</span> 2/4 <ChevronDown className="h-3.5 w-3.5 opacity-60" /></span></Spec>
                  <Spec label="live">
                    <BarChip label="Frequency" value={freq} onChange={setFreq} options={["Daily", "Weekly", "Monthly"].map((f) => ({ value: f, label: f }))} />
                    <BarChip multiple label="Metrics" value={metrics} onChange={setMetrics} options={METRIC_OPTS} max={4} />
                  </Spec>
                </div>
              </div>
            </div>
          </Zone>
          <Zone header={<ZoneHeader title="Buttons" />}>
            <div className="flex flex-wrap items-end gap-4">
              <Spec label="primary"><Button size="xs"><Plus /> Create campaign</Button></Spec>
              <Spec label="secondary (inset)"><Button size="xs" variant="outline">Cancel</Button></Spec>
              <Spec label="ghost"><Button size="xs" variant="ghost">Reset</Button></Spec>
              <Spec label="danger"><Button size="xs" variant="destructive">Archive</Button></Spec>
              <Spec label="disabled"><Button size="xs" disabled>Run</Button></Spec>
              <Spec label="icon actions · active · badge">
                <BarIconButton icon={Pencil} label="Edit" />
                <BarIconButton icon={TrendingUp} label="Delta" active />
                <BarIconButton icon={Filter} label="Filter" badge={2} />
                <BarIconButton icon={Columns3} label="Columns" />
                <BarDivider />
                <BarIconButton icon={Download} label="Export" />
              </Spec>
            </div>
          </Zone>
          <Zone header={<ZoneHeader title="Fields & switches" context="inset wells inside a sheet — no white on white" />}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Spec label="search" className="w-full">
                <div className="relative w-full">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search campaigns…" className="h-[var(--k-control-h)] pl-8 text-xs" />
                </div>
              </Spec>
              <Spec label="text field · focus" className="w-full"><Input defaultValue="Brand Awareness Q1" className="h-[var(--k-control-h)] text-xs ring-2 ring-ring ring-offset-0" /></Spec>
              <Spec label="select" className="w-full">
                <Select defaultValue="7d">
                  <SelectTrigger className="h-[var(--k-control-h)] text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{DATE_OPTS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
              </Spec>
              <Spec label="segmented · switch · checkbox">
                <BarSegmented value={seg} onChange={setSeg} items={[{ value: "products", label: "Products" }, { value: "orders", label: "Orders" }]} />
                <Switch checked={on} onCheckedChange={setOn} />
                <Checkbox defaultChecked />
              </Spec>
            </div>
          </Zone>
          <Zone flush>
            <div className="px-4 pt-1"><UnderlineTabs tabs={[{ value: "campaigns", label: "Campaigns" }, { value: "groups", label: "Ad Groups" }, { value: "keywords", label: "Keywords" }]} value={tab} onChange={setTab} /></div>
            <p className="px-4 py-2 text-2xs text-muted-foreground">Tabs: underlined, dense</p>
          </Zone>
        </Workspace>

        {/* Data */}
        <Workspace>
          <Zone flush><InlineKPIStrip variant="zone" items={KPIS as never} /></Zone>
          <Zone header={<ZoneHeader title="Status & change" />}>
            <div className="flex flex-wrap items-center gap-6">
              <StatusBadge status="live" /><StatusBadge status="paused" /><StatusBadge status="scheduled" /><StatusBadge status="out_of_budget" /><StatusBadge status="archived" />
              <BarDivider />
              <StatusDot tone="positive" label="Healthy" /><StatusDot tone="caution" label="Watch" /><StatusDot tone="danger" label="At risk" />
              <BarDivider />
              <DeltaBadge value={12.4} /><DeltaBadge value={-3.1} />
            </div>
          </Zone>
          <Zone flush header={<ZoneHeader title="Table" context="frameless inside a zone · 34px rows" />}>
            <div data-table-frame className="rounded-lg border border-border bg-card">
              <Table>
                <TableHeader>
                  <TableRow className="bg-card hover:bg-card">
                    <TableHead>Status</TableHead><TableHead>Campaign</TableHead><TableHead className="text-right">Spend</TableHead><TableHead className="text-right">Sales</TableHead><TableHead className="text-right">ROAS</TableHead>
                  </TableRow>
                  <TableTotalsRow>
                    <TableCell colSpan={2}>Total (3 campaigns)</TableCell><TableCell className="text-right">$5,118.85</TableCell><TableCell className="text-right">$21,909.87</TableCell><TableCell className="text-right">4.28</TableCell>
                  </TableTotalsRow>
                </TableHeader>
                <TableBody>
                  {[["live", "Brand Awareness · Q1 2026", "$2,847.32", "$12,453.87", "4.37"], ["paused", "Summer Sale Campaign", "$1,523.45", "$5,678.90", "3.73"], ["out_of_budget", "Competitor Targeting", "$748.08", "$3,777.10", "5.05"]].map(([st, name, sp, sa, ro]) => (
                    <TableRow key={name} className="group">
                      <TableCell><StatusBadge status={st as never} /></TableCell>
                      <TableCell className="font-medium text-primary">{name}</TableCell>
                      <TableCell className="text-right">{sp}</TableCell><TableCell className="text-right">{sa}</TableCell><TableCell className="text-right">{ro}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Zone>
        </Workspace>

        {/* Overlays */}
        <Workspace>
          <Zone header={<ZoneHeader title="Overlays" context="raised with elevation, not outlined" />}>
            <div className="flex flex-wrap items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button size="xs" variant="outline">Menu <ChevronDown /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="start"><DropdownMenuItem>Duplicate</DropdownMenuItem><DropdownMenuItem>Pause</DropdownMenuItem><DropdownMenuItem>Archive</DropdownMenuItem></DropdownMenuContent>
              </DropdownMenu>
              <Dialog>
                <DialogTrigger asChild><Button size="xs" variant="outline">Dialog</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Rename campaign</DialogTitle><DialogDescription>Fields inside raised surfaces are inset wells.</DialogDescription></DialogHeader>
                  <Input defaultValue="Brand Awareness Q1" className="text-xs" />
                  <DialogFooter><Button size="xs" variant="outline">Cancel</Button><Button size="xs">Save</Button></DialogFooter>
                </DialogContent>
              </Dialog>
              <Tooltip>
                <TooltipTrigger asChild><Button size="xs" variant="ghost"><Bell /> Tooltip</Button></TooltipTrigger>
                <TooltipContent>Dark ink tooltip</TooltipContent>
              </Tooltip>
              <span className="text-xs text-muted-foreground">The action island below is raised the same way.</span>
            </div>
          </Zone>
        </Workspace>
      </div>
    </AppLayout>
  );
}
