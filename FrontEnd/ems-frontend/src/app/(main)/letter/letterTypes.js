export const letterTypes = [
  {
    name: "EPF/ETF Name Change Letter",
    fields: [
      { name: "employeeId", label: "Employee ID", type: "text", required: true },
      { name: "currentName", label: "Current Name", type: "text", required: true },
      { name: "newName", label: "New Name", type: "text", required: true },
      { name: "nicNumber", label: "NIC Number", type: "text", required: true },
      { name: "epfNumber", label: "EPF Number", type: "text", required: true },
      { name: "etfNumber", label: "ETF Number", type: "text", required: true },
      { name: "reasonForChange", label: "Reason for Name Change", type: "textarea", required: true },
      { name: "effectiveDate", label: "Effective Date", type: "date", required: true },
      { name: "supervisorName", label: "Supervisor/Authorized Name", type: "text", required: true },
      { name: "signingPersonPosition", label: "Signing Person Position", type: "text", required: true }
    ],
    initialValues: {
      employeeId: "",
      currentName: "",
      newName: "",
      nicNumber: "",
      epfNumber: "",
      etfNumber: "",
      reasonForChange: "",
      effectiveDate: "",
      supervisorName: "",
      signingPersonPosition: ""
    }
  },
  {
    name: "Letter for Skill Assessment",
    fields: [
      { name: "employeeId", label: "Employee ID", type: "text", required: true },
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "position", label: "Current Position", type: "text", required: true },
      { name: "department", label: "Department", type: "text", required: true },
      { name: "joinDate", label: "Join Date", type: "date", required: true },
      { name: "skillsToAssess", label: "Skills to be Assessed", type: "textarea", required: true },
      { name: "assessmentPurpose", label: "Purpose of Assessment", type: "textarea", required: true },
      { name: "supervisorName", label: "Supervisor Name", type: "text", required: true },
      { name: "signingPersonPosition", label: "Signing Person Position", type: "text", required: true }
    ],
    initialValues: {
      employeeId: "",
      fullName: "",
      position: "",
      department: "",
      joinDate: "",
      skillsToAssess: "",
      assessmentPurpose: "",
      supervisorName: "",
      signingPersonPosition: ""
    }
  },
  {
    name: "Salary Undertaking Letter",
    fields: [
      { name: "employeeId", label: "Employee ID", type: "text", required: true },
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "position", label: "Position", type: "text", required: true },
      { name: "currentSalary", label: "Current Salary", type: "text", required: true },
      { name: "salaryFrequency", label: "Salary Frequency", type: "text", required: true },
      { name: "undertakingPurpose", label: "Purpose of Undertaking", type: "textarea", required: true },
      { name: "authorizedPersonName", label: "Authorized Person Name", type: "text", required: true },
      { name: "signingPersonPosition", label: "Signing Person Position", type: "text", required: true }
    ],
    initialValues: {
      employeeId: "",
      fullName: "",
      position: "",
      currentSalary: "",
      salaryFrequency: "Monthly",
      undertakingPurpose: "",
      authorizedPersonName: "",
      signingPersonPosition: ""
    }
  },
  {
    name: "Salary Confirmation Letter",
    fields: [
      { name: "employeeId", label: "Employee ID", type: "text", required: true },
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "position", label: "Position", type: "text", required: true },
      { name: "department", label: "Department", type: "text", required: true },
      { name: "joinDate", label: "Join Date", type: "date", required: true },
      { name: "currentSalary", label: "Current Salary", type: "text", required: true },
      { name: "currency", label: "Currency", type: "text", required: true },
      { name: "allowances", label: "Allowances", type: "textarea", required: false },
      { name: "confirmationPurpose", label: "Purpose of Confirmation", type: "textarea", required: true },
      { name: "authorizedPersonName", label: "Authorized Person Name", type: "text", required: true },
      { name: "signingPersonPosition", label: "Signing Person Position", type: "text", required: true }
    ],
    initialValues: {
      employeeId: "",
      fullName: "",
      position: "",
      department: "",
      joinDate: "",
      currentSalary: "",
      currency: "LKR",
      allowances: "",
      confirmationPurpose: "",
      authorizedPersonName: "",
      signingPersonPosition: ""
    }
  },
  {
    name: "Employment Confirmation Letter",
    fields: [
      { name: "employeeId", label: "Employee ID", type: "text", required: true },
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "position", label: "Position", type: "text", required: true },
      { name: "department", label: "Department", type: "text", required: true },
      { name: "joinDate", label: "Join Date", type: "date", required: true },
      { name: "employmentType", label: "Employment Type", type: "text", required: true },
      { name: "workingHours", label: "Working Hours", type: "text", required: true },
      { name: "reportingManager", label: "Reporting Manager", type: "text", required: true },
      { name: "confirmationPurpose", label: "Purpose of Confirmation", type: "textarea", required: true },
      { name: "signingPersonPosition", label: "Signing Person Position", type: "text", required: true }
    ],
    initialValues: {
      employeeId: "",
      fullName: "",
      position: "",
      department: "",
      joinDate: "",
      employmentType: "Full-time",
      workingHours: "",
      reportingManager: "",
      confirmationPurpose: "",
      signingPersonPosition: ""
    }
  },
  {
    name: "Default",
    fields: [
      { name: "recipientName", label: "Recipient Name", type: "text", required: true },
      { name: "additionalDetails", label: "Additional Details", type: "textarea", required: true }
    ],
    initialValues: {
      recipientName: "",
      additionalDetails: ""
    }
  }
];

export const fieldTypeSpecifications = {
  text: { component: "TextInput", properties: { multiline: false } },
  textarea: { component: "TextInput", properties: { multiline: true, rows: 3 } },
  date: { component: "DateInput", properties: {} }
}; 