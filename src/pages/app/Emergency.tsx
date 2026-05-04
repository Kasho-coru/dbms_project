import { CrudPage } from "@/components/CrudPage";
import { useTable } from "@/hooks/useTable";
import { BloodChip, StatusBadge } from "@/components/StatusBadge";
export default function Emergency() {
  const groups = useTable<any>("blood_group");
  const hospitals = useTable<any>("hospital");
  const gName = (id: number) => groups.data?.find(g => g.blood_group_id === id)?.group_name;
  const hName = (id: number) => hospitals.data?.find(h => h.hospital_id === id)?.name;
  return (
    <CrudPage title="Emergency Requests" subtitle="Critical dispatch coordination — minutes save lives."
      table="emergency_request" pk="request_id"
      defaultRow={{ status: "Pending", units_required: 1, request_date: new Date().toISOString().split("T")[0] }}
      fields={[
        { key: "hospital_id", label: "Hospital", type: "select", options: (hospitals.data ?? []).map(h => ({ label: h.name, value: h.hospital_id })), render: v => hName(v) },
        { key: "blood_group_id", label: "Group", type: "select", options: (groups.data ?? []).map(g => ({ label: g.group_name, value: g.blood_group_id })), render: v => <BloodChip group={gName(v)} /> },
        { key: "units_required", label: "Units", type: "number", required: true },
        { key: "status", label: "Status", type: "select", options: ["Pending","Fulfilled","Cancelled"], render: v => <StatusBadge status={v} /> },
        { key: "request_date", label: "Request Date", type: "date" },
      ]} />
  );
}
