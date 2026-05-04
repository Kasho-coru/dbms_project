import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTable } from "@/hooks/useTable";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";

function downloadCsv(name: string, rows: any[]) {
  if (!rows.length) { toast.error("No data"); return; }
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(","), ...rows.map(r => keys.map(k => JSON.stringify(r[k] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = `${name}.csv`; a.click();
  URL.revokeObjectURL(url);
  toast.success(`${name}.csv downloaded`);
}
export default function Reports() {
  const donors = useTable<any>("donors");
  const stock = useTable<any>("blood_stock");
  const requests = useTable<any>("emergency_requests");
  const donations = useTable<any>("donation_records");
  const reports = [
    { title: "Donor Report", desc: "All registered donors with status.", data: donors.data, file: "donor_report" },
    { title: "Stock Report", desc: "Current inventory across all banks.", data: stock.data, file: "stock_report" },
    { title: "Emergency Report", desc: "All emergency requests by priority.", data: requests.data, file: "emergency_report" },
    { title: "Donation Report", desc: "Historical donation records.", data: donations.data, file: "donation_report" },
  ];
  return (
    <div className="space-y-6">
      <PageHeader title="Reports & Exports" subtitle="Download operational data as CSV." />
      <div className="grid sm:grid-cols-2 gap-4">
        {reports.map(r => (
          <Card key={r.file} className="p-6 shadow-card hover:shadow-elegant transition-smooth hover:-translate-y-0.5">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent grid place-items-center text-primary"><FileText className="h-6 w-6" /></div>
              <div className="flex-1">
                <h3 className="font-display font-semibold">{r.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
                <div className="text-xs text-muted-foreground mt-2">{r.data?.length ?? 0} records</div>
                <Button onClick={() => downloadCsv(r.file, r.data ?? [])} className="mt-4 gradient-primary text-primary-foreground">
                  <Download className="h-4 w-4 mr-1" /> Download CSV
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
