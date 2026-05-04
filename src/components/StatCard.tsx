import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string; value: string | number; icon: LucideIcon;
  hint?: string; tone?: "default" | "critical" | "success" | "warning";
}
const toneCls = {
  default: "bg-accent text-accent-foreground",
  critical: "bg-destructive/10 text-destructive",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};
export function StatCard({ label, value, icon: Icon, hint, tone = "default" }: Props) {
  return (
    <Card className="p-5 shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">{label}</div>
          <div className="text-3xl font-display font-bold mt-2">{value}</div>
          {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
        </div>
        <div className={cn("h-11 w-11 rounded-xl grid place-items-center group-hover:scale-110 transition-smooth", toneCls[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}