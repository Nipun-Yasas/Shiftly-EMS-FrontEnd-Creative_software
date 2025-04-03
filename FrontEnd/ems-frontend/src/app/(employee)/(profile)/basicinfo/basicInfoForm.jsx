import AutoResizeInput from "../AutoResizeInput";

export default function BasicInfoForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
      {/* Left */}
      <div className="space-y-4">
        <AutoResizeInput label="Full Name" defaultValue="Brooklyn Simmons" />
        <AutoResizeInput label="Entity" defaultValue="CTS" />
        <AutoResizeInput label="Employee Number" defaultValue="12344" />
        <AutoResizeInput label="Designation" defaultValue="Software Engineer" />
        <AutoResizeInput label="Birthday" defaultValue="01 Nov 1990" />
      </div>

      {/* Right */}
      <div className="space-y-4">
        <AutoResizeInput label="Gender" defaultValue="Male" />
        <AutoResizeInput label="EPF Number" defaultValue="1244" />
        <AutoResizeInput label="Email" defaultValue="brooklyn.s@example.com" />
        <AutoResizeInput label="Location" defaultValue="Sri-Lanka" />
        <AutoResizeInput label="Reporting Person" defaultValue="John Smith" />
      </div>
    </div>
  );
}
