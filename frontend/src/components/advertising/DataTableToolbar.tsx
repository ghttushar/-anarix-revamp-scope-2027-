import { useEffect, useRef, useState, type ReactNode } from "react";
import { Trash2, type LucideIcon } from "lucide-react";
import {
  AnxSearch as Search, AnxFilter as Filter, AnxExport as Download, AnxColumns as Columns, AnxClose as X, AnxEdit as Pencil,
  AnxPlus as Plus, AnxDelta as TrendingUp, AnxUpload as Upload, AnxPin as Pin, AnxPinOff as PinOff, AnxSort as ArrowUpDown,
  AnxSortUp as ArrowUp, AnxSortDown as ArrowDown, type AnxIcon,
} from "@/components/icons";
import { BarDivider, BarIconButton, BarSegmented, type SegmentItem } from "@/components/bars";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { UploadDialog } from "@/components/advertising/UploadDialog";
import { cn } from "@/lib/utils";

interface FilterRule {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface SortableField {
  id: string;
  label: string;
}

interface DataTableToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  activeFilters?: FilterRule[];
  onFiltersChange?: (filters: FilterRule[]) => void;
  columns?: Column[];
  onColumnToggle?: (columnId: string) => void;
  onSelectAllColumns?: () => void;
  onClearAllColumns?: () => void;
  onDownload?: () => void;
  viewMode?: "view" | "edit";
  onViewModeChange?: (mode: "view" | "edit") => void;
  /** Called by the leave-edit-mode dialog before switching back to view (commit or drop the edits). */
  onEditSave?: () => void;
  onEditDiscard?: () => void;
  showViewToggle?: boolean;
  filterFields?: string[];
  /** A segmented switch before the search (Products | Orders, State | Product). */
  view?: { value: string; onChange: (value: string) => void; items: SegmentItem<string>[] };
  /** The one labelled button, fixed at the far right (Create campaign, Add keyword…). */
  primaryAction?: TablePrimaryAction;
  /** While rows are selected the left zone shows the count, Clear and these actions instead of the view and search. */
  selection?: { count: number; onClear: () => void; actions?: ReactNode };
  showDeltas?: boolean;
  onShowDeltasChange?: (show: boolean) => void;
  onUpload?: (files: File[]) => void;
  /** Override: when provided, the Upload button calls this instead of opening the internal UploadDialog. */
  onUploadClick?: () => void;
  showUpload?: boolean;
  uploadAccept?: string;
  /** The Upload tooltip (default "Upload COGS"). */
  uploadTitle?: string;
  pinnedColumns?: string[];
  onPinColumn?: (columnId: string) => void;
  // Sort props
  sortableFields?: SortableField[];
  sortField?: string | null;
  sortDirection?: "asc" | "desc";
  onSortChange?: (field: string | null, direction: "asc" | "desc") => void;
}

export interface TablePrimaryAction {
  label: string;
  icon?: LucideIcon | AnxIcon;
  onClick?: () => void;
  disabled?: boolean;
  /** Tooltip, e.g. why it is disabled. */
  hint?: string;
  /** A write action: hidden on mobile, like the other write actions. */
  write?: boolean;
}

const OPERATORS = [
  "is", "is not", "contains", "starts with",
  "is less than", "is greater than",
  "is less than or equal to", "is greater than or equal to",
];

export function DataTableToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  activeFilters = [],
  onFiltersChange,
  columns = [],
  onColumnToggle,
  onSelectAllColumns,
  onClearAllColumns,
  onDownload,
  viewMode = "view",
  onViewModeChange,
  onEditSave,
  onEditDiscard,
  showViewToggle = false,
  filterFields = [],
  view,
  primaryAction,
  selection,
  showDeltas,
  onShowDeltasChange,
  onUpload,
  onUploadClick,
  showUpload = false,
  uploadAccept,
  uploadTitle = "Upload COGS",
  pinnedColumns = [],
  onPinColumn,
  sortableFields = [],
  sortField,
  sortDirection = "asc",
  onSortChange,
}: DataTableToolbarProps) {
  const [draftFilters, setDraftFilters] = useState<FilterRule[]>(activeFilters);
  const [columnSearch, setColumnSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [sortPopoverOpen, setSortPopoverOpen] = useState(false);

  const handleOpenFilter = () => {
    setDraftFilters(activeFilters.length > 0 ? [...activeFilters] : [{ id: crypto.randomUUID(), field: filterFields[0] || "", operator: "is", value: "" }]);
    setFilterOpen(true);
  };

  const addFilterRule = () => {
    setDraftFilters([...draftFilters, { id: crypto.randomUUID(), field: filterFields[0] || "", operator: "is", value: "" }]);
  };

  const removeFilterRule = (id: string) => {
    setDraftFilters(draftFilters.filter((f) => f.id !== id));
  };

  const updateFilterRule = (id: string, key: keyof FilterRule, value: string) => {
    setDraftFilters(draftFilters.map((f) => f.id === id ? { ...f, [key]: value } : f));
  };

  const applyFilters = () => {
    const valid = draftFilters.filter((f) => f.field && f.value);
    onFiltersChange?.(valid);
    setFilterOpen(false);
  };

  const cancelFilters = () => {
    setFilterOpen(false);
    setDraftFilters(activeFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange?.([]);
    setFilterOpen(false);
    setDraftFilters([]);
  };

  const handleEditToggle = () => {
    if (viewMode === "edit") {
      setEditConfirmOpen(true);
    } else {
      onViewModeChange?.("edit");
    }
  };

  const handleEditSave = () => {
    setEditConfirmOpen(false);
    onEditSave?.();
    onViewModeChange?.("view");
  };

  const handleEditDiscard = () => {
    setEditConfirmOpen(false);
    onEditDiscard?.();
    onViewModeChange?.("view");
  };

  // Sort field toggle: 3-state per field (inactive → asc → desc → inactive)
  const handleSortFieldToggle = (fieldId: string) => {
    if (sortField !== fieldId) {
      // Different field selected → activate with asc
      onSortChange?.(fieldId, "asc");
    } else if (sortDirection === "asc") {
      onSortChange?.(fieldId, "desc");
    } else {
      // desc → inactive
      onSortChange?.(null, "asc");
    }
  };

  const filteredColumns = columns.filter((c) =>
    c.label.toLowerCase().includes(columnSearch.toLowerCase())
  );


  return (
    <div className={"space-y-1.5"} data-table-toolbar>
      {/* One row with fixed zones (components/bars/README.md):
          [view] [search] or [n selected · actions]   ·····   ✎ | Δ ⇅ ⏷ ▥ | ⤒ ⤓ | [Primary]
          The icon actions keep this order on every table; a table only switches them on or off. */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {selection && selection.count > 0 ? (
            <div className="flex h-8 items-center gap-1 rounded-md bg-primary/[0.08] pl-2.5 pr-1 text-xs">
              <span className="font-medium text-primary">{selection.count} selected</span>
              <Button variant="ghost" size="xs" className="h-6 px-2 text-muted-foreground" onClick={selection.onClear}>Clear</Button>
              {selection.actions && <><BarDivider />{selection.actions}</>}
            </div>
          ) : (
            <>
              {view && <BarSegmented value={view.value} onChange={view.onChange} items={view.items} aria-label="View" />}
              <ToolbarSearch value={searchValue} onChange={onSearchChange} hint={searchPlaceholder} />
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5" data-tb-actions>
          {/* Create / Add / Save is the first thing on the right, then the named actions. */}
          {primaryAction && (
            <>
              <Button
                size="xs"
                className="gap-1.5"
                onClick={primaryAction.onClick}
                disabled={primaryAction.disabled}
                title={primaryAction.hint}
                data-write-action={primaryAction.write || undefined}
                data-tb-primary
              >
                {primaryAction.icon ? <primaryAction.icon /> : <Plus />}
                {primaryAction.label}
              </Button>
              <BarDivider />
            </>
          )}
          {(() => {
            const groups: ReactNode[][] = [
              [
                showViewToggle && onViewModeChange && (
                  <BarIconButton
                    key="edit"
                    data-write-action
                    icon={Pencil}
                    name="Edit"
                    label={viewMode === "edit" ? "Save & exit edit mode" : "Edit table"}
                    active={viewMode === "edit"}
                    tone="danger"
                    onClick={handleEditToggle}
                  />
                ),
              ],
              [
                onShowDeltasChange !== undefined && (
                  <BarIconButton
                    key="delta"
                    icon={TrendingUp}
                    name="Delta"
                    label={showDeltas ? "Hide deltas" : "Show deltas"}
                    hint="Change vs the previous period"
                    active={!!showDeltas}
                    onClick={() => onShowDeltasChange(!showDeltas)}
                  />
                ),
                sortableFields.length > 0 && onSortChange && (
                  <Popover key="sort" open={sortPopoverOpen} onOpenChange={setSortPopoverOpen}>
                    <PopoverTrigger asChild>
                      <BarIconButton
                        icon={!sortField ? ArrowUpDown : sortDirection === "asc" ? ArrowUp : ArrowDown}
                        name="Group"
                        label="Group by"
                        hint={sortField ? `By ${sortableFields.find((s) => s.id === sortField)?.label ?? sortField}` : undefined}
                        active={!!sortField}
                      />
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[220px] p-2 space-y-0.5">
                <p className="text-2xs font-medium text-muted-foreground px-2 pb-1">Group by</p>
                {sortableFields.map((field) => {
                  const isActive = sortField === field.id;
                  return (
                    <button
                      key={field.id}
                      onClick={() => handleSortFieldToggle(field.id)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-xs transition-colors cursor-pointer",
                        isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-hover"
                      )}
                    >
                      <span>{field.label}</span>
                      {isActive ? (
                        sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                      ) : (
                        <ArrowUpDown className="h-3 w-3 opacity-30" />
                      )}
                    </button>
                  );
                })}
              </PopoverContent>
                  </Popover>
                ),
                filterFields.length > 0 && (
                  <Popover key="filter" open={filterOpen} onOpenChange={setFilterOpen}>
                    <PopoverTrigger asChild>
                      <BarIconButton
                        icon={Filter}
                        name="Filter"
                        label="Filter"
                        hint={activeFilters.length > 0 ? `${activeFilters.length} applied` : undefined}
                        active={activeFilters.length > 0}
                        badge={activeFilters.length}
                        onClick={handleOpenFilter}
                      />
                    </PopoverTrigger>
                    <PopoverContent align="end" className="w-[520px] max-w-[92vw] p-3 space-y-2">
                <p className="text-xs font-medium text-foreground">Filters</p>
                <div className="space-y-1.5">
                  {draftFilters.map((rule, idx) => (
                    <div key={rule.id} className="flex items-center gap-1.5">
                      <span className="text-2xs text-muted-foreground w-10 shrink-0">{idx === 0 ? "Where" : "And"}</span>
                      <Select value={rule.field} onValueChange={(v) => updateFilterRule(rule.id, "field", v)}>
                        <SelectTrigger className="h-7 w-[130px] text-2xs"><SelectValue placeholder="Field" /></SelectTrigger>
                        <SelectContent>
                          {filterFields.map((f) => (<SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <Select value={rule.operator} onValueChange={(v) => updateFilterRule(rule.id, "operator", v)}>
                        <SelectTrigger className="h-7 w-[160px] text-2xs"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {OPERATORS.map((op) => (<SelectItem key={op} value={op} className="text-xs">{op}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <Input
                        value={rule.value}
                        onChange={(e) => updateFilterRule(rule.id, "value", e.target.value)}
                        placeholder="Value..."
                        className="h-7 w-[110px] text-2xs"
                      />
                      <button onClick={() => removeFilterRule(rule.id)} className="p-1 hover:bg-hover rounded cursor-pointer" title="Remove filter">
                        <Trash2 className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button onClick={addFilterRule} className="flex items-center gap-1 text-2xs text-primary hover:underline cursor-pointer">
                    <Plus className="h-3 w-3" />Add Filter
                  </button>
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="sm" onClick={cancelFilters} className="h-7 text-xs px-3">Cancel</Button>
                    <Button size="sm" onClick={applyFilters} className="h-7 text-xs px-3">Apply</Button>
                  </div>
                </div>
              </PopoverContent>
                  </Popover>
                ),
                columns.length > 0 && onColumnToggle && (
                  <DropdownMenu key="columns">
                    <DropdownMenuTrigger asChild>
                      <BarIconButton
                        icon={Columns}
                        name="Columns"
                        label="Columns"
                        hint={pinnedColumns.length > 0 ? `${pinnedColumns.length} pinned` : "Show, hide and pin columns"}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-0">
                <div className="p-2 border-b border-border">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                    <Input
                      value={columnSearch}
                      onChange={(e) => setColumnSearch(e.target.value)}
                      placeholder="Search columns..."
                      className="h-7 pl-7 text-xs"
                      onKeyDown={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between px-3 py-1 border-b border-border">
                  <button onClick={onSelectAllColumns} className="text-xs text-primary hover:underline cursor-pointer">Select All</button>
                  <button onClick={onClearAllColumns} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">Clear All</button>
                </div>
                <div className="max-h-[240px] overflow-auto p-1">
                  {pinnedColumns.length > 0 && onPinColumn && (
                    <>
                      <div className="px-2 py-1 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">Pinned</div>
                      {filteredColumns.filter(c => pinnedColumns.includes(c.id)).map((column) => (
                        <div key={`pinned-${column.id}`} className="flex w-full items-center gap-2 rounded-sm px-2 py-1 text-xs hover:bg-hover transition-colors">
                          <button onClick={() => onColumnToggle(column.id)} className="flex items-center gap-2 flex-1 cursor-pointer">
                            <Checkbox checked={column.visible} className="pointer-events-none h-3.5 w-3.5" />
                            <span className="text-foreground">{column.label}</span>
                          </button>
                          <button onClick={() => onPinColumn(column.id)} className="p-0.5 rounded hover:bg-primary/10 cursor-pointer" title="Unpin column">
                            <PinOff className="h-3 w-3 text-primary" />
                          </button>
                        </div>
                      ))}
                      <div className="h-px bg-border mx-1 my-1" />
                      <div className="px-2 py-1 text-2xs font-semibold uppercase tracking-wider text-muted-foreground">All Columns</div>
                    </>
                  )}
                  {filteredColumns.filter(c => !pinnedColumns.includes(c.id)).map((column) => (
                    <div key={column.id} className="flex w-full items-center gap-2 rounded-sm px-2 py-1 text-xs hover:bg-hover transition-colors group">
                      <button onClick={() => onColumnToggle(column.id)} className="flex items-center gap-2 flex-1 cursor-pointer">
                        <Checkbox checked={column.visible} className="pointer-events-none h-3.5 w-3.5" />
                        <span className="text-foreground">{column.label}</span>
                      </button>
                      {onPinColumn && (
                        <button onClick={() => onPinColumn(column.id)} className="p-0.5 rounded opacity-0 group-hover:opacity-100 hover:bg-primary/10 cursor-pointer transition-opacity" title="Pin column">
                          <Pin className="h-3 w-3 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
                  </DropdownMenu>
                ),
              ],
              [
                (showUpload || onUpload || onUploadClick) && (
                  <BarIconButton
                    key="upload"
                    data-write-action
                    icon={Upload}
                    name="Upload"
                    label={uploadTitle}
                    onClick={() => (onUploadClick ? onUploadClick() : setUploadOpen(true))}
                  />
                ),
                onDownload && <BarIconButton key="export" data-write-action icon={Download} name="Export" label="Export CSV" onClick={onDownload} />,
              ],
            ].map((g) => g.filter(Boolean)).filter((g) => g.length > 0);
            // One grouped strip: related actions read as a set, divided by hairlines between groups.
            return groups.length > 0 ? (
              <div className="k-group">
                {groups.map((g, i) => (
                  <div key={i} className="flex items-center gap-0.5">
                    {i > 0 && <BarDivider className="mx-0.5" />}
                    {g}
                  </div>
                ))}
              </div>
            ) : null;
          })()}

        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && !filterOpen && (
        <div className="flex flex-wrap items-center gap-1.5 py-1.5">
          {activeFilters.map((filter) => (
            <Badge key={filter.id} variant="outline" className="gap-1 pr-1 text-2xs h-6 bg-muted/70 border-border">
              <span className="font-medium text-foreground">{filter.field}:</span>
              <span className="text-muted-foreground">{filter.operator}</span>
              <span className="text-foreground">{filter.value}</span>
              <button onClick={() => onFiltersChange?.(activeFilters.filter((f) => f.id !== filter.id))} className="ml-0.5 rounded-full p-0.5 hover:bg-muted-foreground/20 cursor-pointer">
                <X className="h-2.5 w-2.5" />
              </button>
            </Badge>
          ))}
          <button onClick={clearAllFilters} className="text-2xs text-muted-foreground hover:text-foreground cursor-pointer">
            Clear all
          </button>
        </div>
      )}

      {/* Upload Dialog */}
      <UploadDialog
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={onUpload}
        accept={uploadAccept}
        title={uploadTitle}
      />

      {/* Edit Save Confirmation */}
      <AlertDialog open={editConfirmOpen} onOpenChange={setEditConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save?</AlertDialogTitle>
            <AlertDialogDescription>
              You have made edits to this table. Would you like to save your changes or discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleEditDiscard}>Discard</AlertDialogCancel>
            <AlertDialogAction onClick={handleEditSave}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


/**
 * Search as a magnifier: a quiet icon until you need it, then it opens into a field (width animates) with focus.
 * Esc or leaving it empty closes it again; with a query it stays open so the filter stays visible. The page's
 * longer description ("Search by Product Name / Item ID / SKU…") becomes the tooltip, not the placeholder.
 */
function ToolbarSearch({ value, onChange, hint }: { value: string; onChange: (v: string) => void; hint?: string }) {
  const [open, setOpen] = useState(!!value);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (value) setOpen(true);
  }, [value]);
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  const label = hint && hint !== "Search..." ? hint.replace(/(\.\.\.|…)$/, "") : "Search";
  if (!open) return <BarIconButton icon={Search} name="Search" label={label} hint="Click to search" onClick={() => setOpen(true)} />;
  return (
    <div className="relative h-[var(--k-control-h)] w-60 shrink-0 overflow-hidden rounded-md bg-field animate-in fade-in-0 slide-in-from-left-1 duration-200">
      <Search
        aria-hidden
        className={cn("pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground transition-opacity", open ? "opacity-100" : "opacity-0")}
      />
      <Input
        ref={inputRef}
        value={value}
        tabIndex={open ? 0 : -1}
        aria-label={label}
        title={label}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => { if (!value) setOpen(false); }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onChange("");
            setOpen(false);
            (e.target as HTMLInputElement).blur();
          }
        }}
        placeholder="Search…"
        className={cn(
          "h-full w-60 border-transparent bg-transparent pl-8 pr-7 text-xs shadow-none transition-opacity focus-visible:ring-1 focus-visible:ring-offset-0",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      {open && value && (
        <button
          type="button"
          aria-label="Clear search"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { onChange(""); inputRef.current?.focus(); }}
          className="absolute right-1.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:bg-hover hover:text-foreground"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}
