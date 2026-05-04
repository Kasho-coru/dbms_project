import { CrudPage } from "@/components/CrudPage";
import { useTable } from "@/hooks/useTable";
export default function Donations() {
  const donors = useTable<any>("donors");
  const banks = useTable<any>("blood_banks");
  const dName = (id: number) => donors.data?.find(d => d.donor_id === id)?.name;
  const bName = (id: number) => banks.data?.find(b => b.bank_id === id)?.name;
  return (
    <CrudPage title="Donation Records" subtitle="Every contribution logged and traceable."
      table="donation_records" pk="donation_id"
      defaultRow={{ units_donated: 1, donation_date: new Date().toISOString().split("T")[0] }}
      fields={[
        { key: "donor_id", label: "Donor", type: "select", options: (donors.data ?? []).map(d => ({ label: d.name, value: d.donor_id })), render: v => dName(v) },
        { key: "bank_id", label: "Bank", type: "select", options: (banks.data ?? []).map(b => ({ label: b.name, value: b.bank_id })), render: v => bName(v) },
        { key: "donation_date", label: "Date", type: "date" },
        { key: "units_donated", label: "Units", type: "number", required: true, render: v => <span className="font-bold text-primary">{v}</span> },
      ]} />
  );
}
