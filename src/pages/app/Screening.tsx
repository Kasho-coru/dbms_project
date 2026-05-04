import { CrudPage } from "@/components/CrudPage";
import { useTable } from "@/hooks/useTable";
import { StatusBadge } from "@/components/StatusBadge";
export default function Screening() {
  const donors = useTable<any>("donor");
  const dName = (id: number) => donors.data?.find(d => d.donor_id === id)?.name;
  return (
    <CrudPage title="Medical Screening" subtitle="Eligibility verification before every donation."
      table="screening" pk="screening_id"
      defaultRow={{ result: "Pass", screening_date: new Date().toISOString().split("T")[0] }}
      fields={[
        { key: "donor_id", label: "Donor", type: "select", options: (donors.data ?? []).map(d => ({ label: d.name, value: d.donor_id })), render: v => dName(v) },
        { key: "screening_date", label: "Date", type: "date", required: true },
        { key: "result", label: "Result", type: "select", options: ["Pass","Fail"], render: v => <StatusBadge status={v} /> },
      ]} />
  );
}
