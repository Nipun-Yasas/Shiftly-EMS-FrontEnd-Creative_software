
import Readonlyfield from "../components/Readonlyfield";

const BasicInfoForm = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
      {/* Left */}
      <div className="space-y-4">
        <Readonlyfield label="Full Name" value="Brooklyn Simmons" />
        <Readonlyfield label="Entity" value="CTS" />
        <Readonlyfield label="Employee Number" value="12344" />
        <Readonlyfield label="Designation" value="Software Engineer" />
        <Readonlyfield label="Birthday" value="01 Nov 1990" />
      </div>

      {/* Right */}
      <div className="space-y-4">
        <Readonlyfield label="Gender" value="Male" />
        <Readonlyfield label="EPF Number" value="1244" />
        <Readonlyfield label="Email" value="brooklyn.s@example.com" />
        <Readonlyfield label="Location" value="Sri-Lanka" />
        <Readonlyfield label="Reporting Person" value="John Smith" />
      </div>
    </div>
  );
}

export default BasicInfoForm;