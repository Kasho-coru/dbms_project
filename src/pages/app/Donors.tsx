import { CrudPage } from "@/components/CrudPage";
import { useTable } from "@/hooks/useTable";
import { BloodChip, StatusBadge } from "@/components/StatusBadge";

export default function Donors() {
  const groups = useTable<any>("blood_groups");
  const groupOptions = (groups.data ?? []).map(g => ({ label: g.group_name, value: g.blood_group_id }));
  const groupName = (id: number) => groups.data?.find(g => g.blood_group_id === id)?.group_name;

  return (
    <CrudPage
      title="Donor Management"
      subtitle="Register, search, and manage all registered blood donors."
      table="donors"
      pk="donor_id"
      searchKeys={["name","email","contact_number"]}
      defaultRow={{ gender: "Male" }}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "age", label: "Age", type: "number", required: true },
        { key: "weight", label: "Weight (kg)", type: "number", required: true },
        { key: "gender", label: "Gender", type: "select", options: ["Male","Female","Other"] },
        { key: "blood_group_id", label: "Blood Group", type: "select", options: groupOptions, render: v => <BloodChip group={groupName(v)} /> },
        { key: "email", label: "Email" },
        { key: "contact_number", label: "Contact" },
      ]}
    />
  );
}