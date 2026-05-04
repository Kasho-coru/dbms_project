import { CrudPage } from "@/components/CrudPage";
import { useTable } from "@/hooks/useTable";
import { BloodChip } from "@/components/StatusBadge";
export default function Transfers() {
  const banks = useTable<any>("blood_banks");
  const groups = useTable<any>("blood_groups");
  const bName = (id: number) => banks.data?.find(b => b.bank_id === id)?.name;
  const gName = (id: number) => groups.data?.find(g => g.blood_group_id === id)?.group_name;
  return (
    <CrudPage title="Blood Transfers" subtitle="Inter-bank stock movement and balancing."
      table="transfer_records" pk="transfer_id"
      defaultRow={{ units_transferred: 1, transfer_date: new Date().toISOString().split("T")[0] }}
      fields={[
        { key: "from_bank_id", label: "From", type: "select", options: (banks.data ?? []).map(b => ({ label: b.name, value: b.bank_id })), render: v => bName(v) },
        { key: "to_bank_id", label: "To", type: "select", options: (banks.data ?? []).map(b => ({ label: b.name, value: b.bank_id })), render: v => bName(v) },
        { key: "blood_group_id", label: "Group", type: "select", options: (groups.data ?? []).map(g => ({ label: g.group_name, value: g.blood_group_id })), render: v => <BloodChip group={gName(v)} /> },
        { key: "units_transferred", label: "Units", type: "number", required: true },
        { key: "transfer_date", label: "Date", type: "date" },
      ]} />
  );
}
