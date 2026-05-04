import { CrudPage } from "@/components/CrudPage";
export default function Banks() {
  return (
    <CrudPage title="Blood Banks" subtitle="Network of partner blood storage facilities."
      table="blood_bank" pk="bank_id" searchKeys={["name","location"]}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "location", label: "Location", required: true },
        { key: "contact_number", label: "Contact" },
      ]} />
  );
}
