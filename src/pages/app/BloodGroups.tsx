import { CrudPage } from "@/components/CrudPage";
import { BloodChip } from "@/components/StatusBadge";

export default function BloodGroups() {
  return (
    <CrudPage
      title="Blood Groups"
      subtitle="Master list of all supported blood groups."
      table="blood_group"
      pk="blood_group_id"
      searchKeys={["group_name"]}
      fields={[
        { key: "blood_group_id", label: "Blood Group ID", type: "number", required: true },
        { key: "group_name", label: "Group Name", required: true, render: v => <BloodChip group={v} /> },
      ]}
    />
  );
}