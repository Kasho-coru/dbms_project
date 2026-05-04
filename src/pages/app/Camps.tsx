import { CrudPage } from "@/components/CrudPage";
export default function Camps() {
  return (
    <CrudPage title="Donation Camps" subtitle="Outreach drives organized across cities."
      table="camp" pk="camp_id" searchKeys={["name","location"]}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "location", label: "Location", required: true },
        { key: "date", label: "Date", type: "date", required: true },
      ]} />
  );
}
