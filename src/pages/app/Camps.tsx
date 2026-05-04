import { CrudPage } from "@/components/CrudPage";
export default function Camps() {
  return (
    <CrudPage title="Donation Camps" subtitle="Outreach drives organized across cities."
      table="camps" pk="camp_id" searchKeys={["organizer","location"]}
      defaultRow={{ total_donors: 0 }}
      fields={[
        { key: "organizer", label: "Organizer", required: true },
        { key: "location", label: "Location", required: true },
        { key: "camp_date", label: "Date", type: "date", required: true },
        { key: "total_donors", label: "Total Donors", type: "number" },
      ]} />
  );
}
