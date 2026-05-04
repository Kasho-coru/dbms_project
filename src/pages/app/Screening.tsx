import { CrudPage } from "@/components/CrudPage";
import { useTable } from "@/hooks/useTable";
import { StatusBadge } from "@/components/StatusBadge";
export default function Screening() {
  const donors = useTable<any>("donors");
  const dName = (id: number) => donors.data?.find(d => d.donor_id === id)?.name;
  return (
    <CrudPage title="Medical Screening" subtitle="Eligibility verification before every donation."
      table="screenings" pk="screening_id"
      defaultRow={{ screening_result: "Pass", status: "Completed" }}
      fields={[
        { key: "donor_id", label: "Donor", type: "select", options: (donors.data ?? []).map(d => ({ label: d.name, value: d.donor_id })), render: v => dName(v) },
        { key: "temperature", label: "Temp (°F)", type: "number" },
        { key: "blood_pressure", label: "BP" },
        { key: "disease_history", label: "Disease History" },
        { key: "screening_result", label: "Result", type: "select", options: ["Pass","Fail"], render: v => <StatusBadge status={v} /> },
        { key: "screening_date", label: "Date", type: "date" },
      ]} />
  );
}
