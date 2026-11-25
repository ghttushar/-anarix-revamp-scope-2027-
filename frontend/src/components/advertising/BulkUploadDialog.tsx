import { useCallback, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, Download, FileText, Info, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AnxUpload } from "@/components/icons";
import { cn } from "@/lib/utils";

/*
  Bulk edit file upload, ported from the old design's BulkUploadPopup (common/bulk-actions/bulk-upload-action):
  download the table, edit it offline, drop the CSVs back. Every file is validated (type, 10 MB, 25,000 rows, has
  data) before Upload sends the validated ones. Demo rows show each state on first open.
*/

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_ROWS = 25000;

type FileStatus = "validating" | "failed" | "validated" | "uploading" | "uploaded";

interface UploadItem {
  id: string;
  name: string;
  size: number;
  status: FileStatus;
  errors: string[];
  rows?: number;
}

const DEMO_SEED: UploadItem[] = [
  { id: "demo-progress", name: "bid_adjustments_oct.csv", size: 84_200, status: "validating", errors: [] },
  {
    id: "demo-failed",
    name: "sku_mapping_update.csv",
    size: 132_500,
    status: "failed",
    errors: [
      "Row 14: Missing required column 'campaignId'",
      "Row 88: Budget value '—' is not numeric",
      "Row 145: Bid exceeds the account cap",
      "Row 203: Duplicate SKU 'B08P4X2Z1'",
    ],
  },
  { id: "demo-success", name: "campaign_budgets_q3.csv", size: 61_000, status: "validated", errors: [], rows: 1204 },
];

const STATUS_META: Record<FileStatus, { label: string; tone: string }> = {
  validating: { label: "Validating…", tone: "bg-primary/10 text-primary" },
  uploading: { label: "Uploading…", tone: "bg-primary/10 text-primary" },
  failed: { label: "Failed", tone: "bg-destructive/10 text-destructive" },
  validated: { label: "Validated", tone: "bg-success/10 text-success" },
  uploaded: { label: "Uploaded", tone: "bg-success/10 text-success" },
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const makeId = () => `f${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

async function validate(file: File): Promise<{ errors: string[]; rows: number }> {
  const errors: string[] = [];
  if (!file.name.toLowerCase().endsWith(".csv")) return { errors: ["File type not supported — only .csv files are accepted"], rows: 0 };
  if (file.size > MAX_FILE_SIZE) return { errors: [`File is ${formatFileSize(file.size)} — the limit is ${formatFileSize(MAX_FILE_SIZE)}`], rows: 0 };
  const lines = (await file.text()).split(/\r\n|\n/).filter((l) => l.trim().length > 0);
  const rows = Math.max(lines.length - 1, 0);
  if (lines.length === 0) errors.push("File is empty — no header row found");
  else if (rows === 0) errors.push("File has a header row but no data rows");
  else if (rows > MAX_ROWS) errors.push(`File has ${rows.toLocaleString()} rows — the limit is ${MAX_ROWS.toLocaleString()} per file`);
  return { errors, rows };
}

function StatusIcon({ status }: { status: FileStatus }) {
  if (status === "failed") return <AlertCircle className="h-4 w-4 text-destructive" />;
  if (status === "validated" || status === "uploaded") return <CheckCircle2 className="h-4 w-4 text-success" />;
  return <FileText className="h-4 w-4 text-primary" />;
}

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Download every row / only the filtered rows (as CSV) to edit offline. */
  onDownloadAll?: () => void;
  onDownloadFiltered?: () => void;
}

export function BulkUploadDialog({ open, onOpenChange, onDownloadAll, onDownloadFiltered }: BulkUploadDialogProps) {
  const [items, setItems] = useState<UploadItem[]>(DEMO_SEED);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validatedCount = useMemo(() => items.filter((i) => i.status === "validated").length, [items]);
  const busy = items.some((i) => i.status === "uploading");

  const close = () => {
    if (busy) return;
    setItems(DEMO_SEED);
    setExpanded(new Set());
    onOpenChange(false);
  };

  const addFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;
    const next = files.map((file) => ({ id: makeId(), name: file.name, size: file.size, status: "validating" as FileStatus, errors: [] }));
    setItems((prev) => [...prev, ...next]);
    next.forEach((item, i) =>
      validate(files[i]).then(({ errors, rows }) =>
        setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, status: errors.length ? "failed" : "validated", errors, rows } : it))),
      ),
    );
  }, []);

  const uploadAll = () => {
    const ready = items.filter((i) => i.status === "validated").map((i) => i.id);
    if (ready.length === 0) return;
    setItems((prev) => prev.map((i) => (ready.includes(i.id) ? { ...i, status: "uploading" } : i)));
    ready.forEach((id, i) => {
      window.setTimeout(() => {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: "uploaded" } : it)));
        if (i === ready.length - 1) {
          toast.success("Upload complete", { description: `${ready.length} file${ready.length === 1 ? "" : "s"} submitted for processing.` });
        }
      }, 900 + i * 500);
    });
  };

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  return (
    <Dialog open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogContent className="flex max-h-[85vh] max-w-2xl flex-col gap-0 p-0">
        <DialogHeader className="space-y-1 border-b border-border px-6 pb-4 pt-5 text-left">
          <DialogTitle className="text-base">Bulk edit file upload</DialogTitle>
          <DialogDescription className="text-xs">Download, edit, then re-upload — every file is validated before it's applied.</DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-medium text-foreground">Download data</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => (onDownloadAll ? onDownloadAll() : toast.success("Downloading all rows as CSV…"))}>
                <Download className="h-3.5 w-3.5" />
                Download all
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => (onDownloadFiltered ? onDownloadFiltered() : toast.success("Downloading filtered rows as CSV…"))}>
                <Download className="h-3.5 w-3.5" />
                Download with filters
              </Button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => { e.preventDefault(); setDragActive(false); addFiles(Array.from(e.dataTransfer.files)); }}
            className={cn(
              "flex w-full flex-col items-center gap-2 rounded-lg border border-dashed px-6 py-8 text-center transition-colors",
              dragActive ? "border-primary bg-primary/[0.06]" : "border-border bg-field hover:border-primary/50",
            )}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <AnxUpload className="h-5 w-5" />
            </span>
            <span className="text-sm text-foreground">
              Drag and drop CSV files here, or <span className="font-medium text-primary">browse</span>
            </span>
            <span className="text-2xs text-muted-foreground">CSV only · max 10 MB · up to 25,000 rows per file</span>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              multiple
              className="hidden"
              onChange={(e) => { addFiles(Array.from(e.target.files ?? [])); e.target.value = ""; }}
            />
          </button>

          <p className="flex items-start gap-2 rounded-md bg-caution-50 px-3 py-2 text-2xs text-body dark:bg-warning/10">
            <Info className="mt-px h-3.5 w-3.5 shrink-0 text-warning" />
            <span>
              <span className="font-medium text-foreground">Bulk edits over 100 rows are processed separately.</span> They won't update instantly; you'll get an
              email once the update is complete.
            </span>
          </p>

          {items.length > 0 && (
            <div className="space-y-2">
              {items.map((item) => {
                const meta = STATUS_META[item.status];
                const working = item.status === "validating" || item.status === "uploading";
                const showAll = expanded.has(item.id);
                const errors = showAll ? item.errors : item.errors.slice(0, 3);
                return (
                  <div key={item.id} className="overflow-hidden rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-3 px-3 py-2.5">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-field">
                        <StatusIcon status={item.status} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-foreground">{item.name}</p>
                        <p className="text-2xs text-muted-foreground">
                          {formatFileSize(item.size)}
                          {typeof item.rows === "number" ? ` · ${item.rows.toLocaleString()} rows` : ""}
                        </p>
                      </div>
                      <span className={cn("rounded-full px-2 py-0.5 text-2xs font-medium", meta.tone)}>{meta.label}</span>
                      {item.status !== "uploading" && (
                        <button
                          type="button"
                          aria-label="Remove file"
                          onClick={() => setItems((prev) => prev.filter((i) => i.id !== item.id))}
                          className="rounded p-1 text-muted-foreground hover:bg-hover hover:text-foreground"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    {working && (
                      <div className="h-0.5 overflow-hidden bg-track">
                        <div className="h-full w-1/3 animate-[k-indeterminate_1.2s_ease-in-out_infinite] rounded-full bg-primary" />
                      </div>
                    )}
                    {item.status === "failed" && (
                      <div className="border-t border-destructive/15 bg-destructive/[0.04] px-3 py-2">
                        <p className="text-2xs font-medium text-destructive">
                          {item.errors.length} issue{item.errors.length === 1 ? "" : "s"} found
                        </p>
                        <ul className="mt-1 list-disc space-y-0.5 pl-4 text-2xs text-body">
                          {errors.map((e, i) => <li key={i}>{e}</li>)}
                        </ul>
                        {item.errors.length > 3 && (
                          <button type="button" onClick={() => toggleExpanded(item.id)} className="mt-1 inline-flex items-center gap-1 text-2xs font-medium text-primary">
                            {showAll ? "Show less" : `Show all ${item.errors.length} issues`}
                            <ChevronDown className={cn("h-3 w-3 transition-transform", showAll && "rotate-180")} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-3">
          {validatedCount > 0 && (
            <span className="mr-auto text-xs text-muted-foreground">
              {validatedCount} file{validatedCount === 1 ? "" : "s"} ready to upload
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={close} disabled={busy}>Cancel</Button>
          <Button size="sm" onClick={uploadAll} disabled={validatedCount === 0 || busy}>
            {busy ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
