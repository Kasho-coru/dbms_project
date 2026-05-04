import { CrudPage } from "@/components/CrudPage";
import { StatusBadge } from "@/components/StatusBadge";
export default function Staff() {
  return (
    <CrudPage title="Staff Management" subtitle="Doctors, nurses, technicians, volunteers."
      table="staff" pk="staff_id" searchKeys={["name","email","role"]}
      defaultRow={{ availability: "Available", role: "Nurse" }}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "role", label: "Role", type: "select", options: ["Doctor","Nurse","Volunteer","Technician","Admin"] },
        { key: "email", label: "Email" },
        { key: "contact_number", label: "Contact" },
        { key: "availability", label: "Availability", type: "select", options: ["Available","Assigned","Off-duty"], render: v => <StatusBadge status={v} /> },
      ]} />
  );
}
