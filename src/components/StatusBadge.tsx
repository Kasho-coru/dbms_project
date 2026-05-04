import { cn } from "@/lib/utils";

const map: Record<string, string> = {
  Active: "bg-success/15 text-success border-success/30",
  Available: "bg-success/15 text-success border-success/30",
  Pass: "bg-success/15 text-success border-success/30",
  Eligible: "bg-success/15 text-success border-success/30",
  Fulfilled: "bg-success/15 text-success border-success/30",
  Pending: "bg-warning/15 text-warning border-warning/30",
  "Low Stock": "bg-warning/15 text-warning border-warning/30",
  "In Transit": "bg-warning/15 text-warning border-warning/30",
  Medium: "bg-warning/15 text-warning border-warning/30",
  "Temporary Deferral": "bg-warning/15 text-warning border-warning/30",
  Assigned: "bg-warning/15 text-warning border-warning/30",
  Critical: "bg-destructive/15 text-destructive border-destructive/30",
  Fail: "bg-destructive/15 text-destructive border-destructive/30",
  High: "bg-destructive/15 text-destructive border-destructive/30",
  "Not Eligible": "bg-destructive/15 text-destructive border-destructive/30",
  Deferred: "bg-destructive/15 text-destructive border-destructive/30",
  Expired: "bg-destructive/15 text-destructive border-destructive/30",
  Cancelled: "bg-muted text-muted-foreground border-border",
  Inactive: "bg-muted text-muted-foreground border-border",
  "Off-duty": "bg-muted text-muted-foreground border-border",
  Low: "bg-success/15 text-success border-success/30",
};

export function StatusBadge({ status }: { status?: string | null }) {
  if (!status) return null;
  const cls = map[status] ?? "bg-accent text-accent-foreground border-border";
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border", cls)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export function BloodChip({ group }: { group?: string | null }) {
  if (!group) return null;
  return (
    <span className="inline-flex items-center justify-center min-w-[42px] px-2 py-1 rounded-md text-xs font-bold bg-primary text-primary-foreground shadow-sm">
      {group}
    </span>
  );
}