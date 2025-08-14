// Test JSON serialization for letter requests
const testFormData = {
  fullName: "John Doe",
  employeeId: "EMP001",
  department: "IT",
  position: "Software Developer",
  email: "john.doe@company.com",
  phoneNumber: "+1234567890",
  joinDate: "2023-01-15",
  currentSalary: "75000",
  reason: "Loan application purpose"
};

// This is how the frontend should send data to the backend
const requestData = {
  letterType: "EMPLOYMENT_CONFIRMATION_LETTER",
  fieldsJson: JSON.stringify(testFormData) // Convert form data to JSON string
};

console.log("Request data that will be sent to backend:");
console.log(JSON.stringify(requestData, null, 2));

// This is how the frontend should parse data from the backend
const backendResponse = {
  id: 1,
  letterType: "EMPLOYMENT_CONFIRMATION_LETTER",
  fieldsJson: JSON.stringify(testFormData),
  requestedAt: "2025-08-14T10:30:00",
  status: "PENDING",
  generatedLetterHtml: null,
  employee: {
    id: 1,
    name: "John Doe"
  }
};

// Parse the fieldsJson back to object
let parsedFields = {};
try {
  if (backendResponse.fieldsJson && typeof backendResponse.fieldsJson === 'string') {
    parsedFields = JSON.parse(backendResponse.fieldsJson);
  }
} catch (error) {
  console.error('Failed to parse fieldsJson:', error);
  parsedFields = {};
}

console.log("\nParsed form data from backend response:");
console.log(JSON.stringify(parsedFields, null, 2));

// Verify the data integrity
console.log("\nData integrity check:");
console.log("Original form data:", testFormData);
console.log("Parsed form data:", parsedFields);
console.log("Data matches:", JSON.stringify(testFormData) === JSON.stringify(parsedFields));

module.exports = { testFormData, requestData, backendResponse, parsedFields };
