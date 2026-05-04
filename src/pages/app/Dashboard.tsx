import { useTable } from "@/hooks/useTable";
import { StatCard } from "@/components/StatCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { Users, Droplet, Siren, Building2, Syringe, UserCog } from "lucide-react";
import { Card } from "@/components/ui/card";
import { StatusBadge, BloodChip } from "@/components/StatusBadge";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

export default function Dashboard() {
  const donors = useTable<any>("donors");
  const stock = useTable<any>("blood_stock");
  const groups = useTable<any>("blood_groups");
  const requests = useTable<any>("emergency_requests");
  const banks = useTable<any>("blood_banks");
  const donations = useTable<any>("donation_records");
  const staff = useTable<any>("staff");
  const hospitals = useTable<any>("hospitals");

  const totalUnits = (stock.data ?? []).reduce((s, r) => s + (r.units_available || 0), 0);
  const pendingReqs = (requests.data ?? []).filter(r => r.status === "Pending" || r.status === "In Transit").length;
  const onDuty = (staff.data ?? []).filter(s => s.availability !== "Off-duty").length;

  const groupName = (id: number) => groups.data?.find(g => g.blood_group_id === id)?.group_name ?? "—";
  const bankName = (id: number) => banks.data?.find(b => b.bank_id === id)?.name ?? "—";
  const hospName = (id: number) => hospitals.data?.find(h => h.hospital_id === id)?.name ?? "—";
  const donorName = (id: number) => donors.data?.find(d => d.donor_id === id)?.name ?? "—";

  // Aggregate stock per group
  const chart = (groups.data ?? []).map(g => ({
    name: g.group_name,
    units: (stock.data ?? []).filter(s => s.blood_group_id === g.blood_group_id).reduce((s, r) => s + (r.units_available || 0), 0),
  }));

  const lowStock = (stock.data ?? []).filter(s => (s.units_available || 0) < 20);

  return (
    <div className="space-y-8">
      <PageHeader title="Emergency Command Center" subtitle="Live operations and real-time inventory management." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Donors" value={donors.data?.length ?? 0} icon={Users} hint="+12% this month" />
        <StatCard label="Stock Units" value={totalUnits} icon={Droplet} hint={`${lowStock.length} low alerts`} tone={lowStock.length ? "warning" : "default"} />
        <StatCard label="Active Alerts" value={pendingReqs} icon={Siren} hint="critical response" tone="critical" />
        <StatCard label="Partner Hospitals" value={hospitals.data?.length ?? 0} icon={Building2} hint="across all zones" tone="success" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-6 shadow-card lg:col-span-2">
          <h3 className="font-display font-semibold text-lg mb-4">Stock Distribution by Blood Group</h3>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={chart}>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                <Bar dataKey="units" radius={[8,8,0,0]}>
                  {chart.map((d,i) => (
                    <Cell key={i} fill={d.units < 15 ? "hsl(var(--destructive))" : d.units < 30 ? "hsl(var(--warning))" : "hsl(var(--primary))"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-6 shadow-card">
          <h3 className="font-display font-semibold text-lg mb-4">Active Emergency Requests</h3>
          <div className="space-y-3">
            {(requests.data ?? []).slice(0,4).map(r => (
              <div key={r.request_id} className="p-3 rounded-lg border border-border hover:border-primary/40 transition-smooth">
                <div className="flex items-center justify-between mb-1">
                  <StatusBadge status={r.status} />
                  <span className="text-xs text-muted-foreground">{r.request_date}</span>
                </div>
                <div className="text-sm font-semibold">{hospName(r.hospital_id)}</div>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                  <BloodChip group={groupName(r.blood_group_id)} />
                  Needs {r.units_required} units
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-6 shadow-card">
        <h3 className="font-display font-semibold text-lg mb-4">Recent Donations</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
              <tr><th className="text-left py-2">Donor</th><th className="text-left">Bank</th><th className="text-left">Date</th><th className="text-left">Units</th></tr>
            </thead>
            <tbody>
              {(donations.data ?? []).slice(-5).reverse().map(d => (
                <tr key={d.donation_id} className="border-b border-border last:border-0 hover:bg-accent/40 transition-smooth">
                  <td className="py-3 font-medium">{donorName(d.donor_id)}</td>
                  <td>{bankName(d.bank_id)}</td>
                  <td>{d.donation_date}</td>
                  <td><span className="font-semibold text-primary">{d.quantity}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="text-xs text-muted-foreground">On duty staff: {onDuty}</div>
    </div>
  );
}