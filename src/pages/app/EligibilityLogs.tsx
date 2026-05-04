import { CrudPage } from "@/components/CrudPage";
import { useTable } from "@/hooks/useTable";
import { StatusBadge } from "@/components/StatusBadge";

export default function EligibilityLogs() {
  const screenings = useTable<any>("screening");
  const donors = useTable<any>("donor");
  const screeningLabel = (id: number) => {
    const screening = screenings.data?.find(s => s.screening_id === id);
    const donor = donors.data?.find(d => d.donor_id === screening?.donor_id);
    return screening ? `#${screening.screening_id} · ${donor?.name ?? "Donor"} · ${screening.screening_date}` : "—";
  };

  return (
    <CrudPage
      title="Eligibility Logs"
      subtitle="Final eligibility status connected to donor screening results."
      table="eligibility_log"
      pk="log_id"
      searchKeys={["status", "remarks"]}
      defaultRow={{ status: "Eligible" }}
      fields={[
        { key: "screening_id", label: "Screening", type: "select", options: (screenings.data ?? []).map(s => ({ label: screeningLabel(s.screening_id), value: s.screening_id })), render: v => screeningLabel(v) },
        { key: "status", label: "Status", type: "select", options: ["Eligible", "Not Eligible"], required: true, render: v => <StatusBadge status={v} /> },
        { key: "remarks", label: "Remarks" },
      ]}
    />
  );
}