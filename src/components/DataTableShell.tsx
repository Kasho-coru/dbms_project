import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
export function DataTableShell({ title, action, children }: { title?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <Card className="p-0 overflow-hidden shadow-card">
      {(title || action) && (
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          {title && <h2 className="font-display font-semibold text-sm text-muted-foreground">{title}</h2>}
          {action}
        </div>
      )}
      <div className="overflow-x-auto">{children}</div>
    </Card>
  );
}