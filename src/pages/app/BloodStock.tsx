import { CrudPage } from "@/components/CrudPage";
import { useTable } from "@/hooks/useTable";
import { BloodChip } from "@/components/StatusBadge";

export default function BloodStock() {
  const groups = useTable<any>("blood_group");
  const banks = useTable<any>("blood_bank");
  const groupName = (id: number) => groups.data?.find(g => g.blood_group_id === id)?.group_name;
  const bankName = (id: number) => banks.data?.find(b => b.bank_id === id)?.name;
  return (
    <CrudPage title="Blood Stock Inventory" subtitle="Live monitoring of stock levels across every blood bank."
      table="blood_stock" pk="stock_id"
      defaultRow={{ units_available: 0 }}
      fields={[
        { key: "bank_id", label: "Bank", type: "select", options: (banks.data ?? []).map(b => ({ label: b.name, value: b.bank_id })), render: v => bankName(v) },
        { key: "blood_group_id", label: "Group", type: "select", options: (groups.data ?? []).map(g => ({ label: g.group_name, value: g.blood_group_id })), render: v => <BloodChip group={groupName(v)} /> },
        { key: "units_available", label: "Units Available", type: "number", required: true, render: v => <span className="font-bold text-primary">{v}</span> },
        { key: "expiry_date", label: "Expires", type: "date", required: true },
      ]} />
  );
}