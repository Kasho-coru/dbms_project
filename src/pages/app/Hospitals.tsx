import { CrudPage } from "@/components/CrudPage";
export default function Hospitals() {
  return (
    <CrudPage title="Hospitals" subtitle="Partner healthcare facilities placing blood requests."
      table="hospital" pk="hospital_id" searchKeys={["name","location"]}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "location", label: "Location", required: true },
        { key: "contact_number", label: "Contact" },
      ]} />
  );
}
