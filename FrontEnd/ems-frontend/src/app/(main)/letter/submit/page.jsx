"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Snackbar, Alert } from "@mui/material";

import { UserContext } from "../../../context/UserContext";
import { getUserData, saveUserData } from "../../../_utils/localStorageUtils";
import { useLetterRequests } from "../../../_hooks/useLetterRequests";

import LetterTypeSelector from "../components/LetterTypeSelector";
import LetterRequestForm from "../components/LetterRequestForm";

// Local storage key for offline/cache history fallback
const LS_KEY = "letterHistory";

const SubmitLetterPage = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { createLetterRequest, error: letterError, clearError } = useLetterRequests();

  const [step, setStep] = useState("selection"); // selection | form
  const [selectedLetterType, setSelectedLetterType] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Map display name to backend enum
  const mapLetterTypeToEnum = (type) => {
    switch (type) {
      case "EPF/ETF Name Change Letter":
        return "EPF_ETF_NAME_CHANGE_LETTER";
      case "Letter for Skill Assessment":
        return "SKILL_ASSESSMENT_LETTER";
      case "Salary Undertaking Letter":
        return "SALARY_UNDERTAKING_LETTER";
      case "Salary Confirmation Letter":
        return "SALARY_CONFIRMATION_LETTER";
      case "Employment Confirmation Letter":
        return "EMPLOYMENT_CONFIRMATION_LETTER";
      default:
        return type;
    }
  };

  const handleLetterTypeSelect = (letterType) => {
    setSelectedLetterType(letterType);
    setStep("form");
  };

  const handleBack = () => {
    setStep("selection");
    setSelectedLetterType(null);
  };

  const handleSubmit = async ({ letterType, formData }) => {
    try {
      // Get employee ID from user context
      const employeeId = user?.employeeId || user?.id;
      if (!employeeId) {
        console.error("User context:", user);
        setSnackbar({ open: true, message: "Employee ID not found. Please login again.", severity: "error" });
        return;
      }

      // Validate form data
      if (!formData || Object.keys(formData).length === 0) {
        setSnackbar({ open: true, message: "Form data is empty. Please fill in the required fields.", severity: "error" });
        return;
      }

      // Validate required fields based on letter type (matching backend service requirements)
      const requiredFieldsMap = {
        "EPF_ETF_NAME_CHANGE_LETTER": ["employeeId","currentName","newName","nicNumber","epfNumber","etfNumber","reasonForChange","effectiveDate"],
        "SKILL_ASSESSMENT_LETTER": ["employeeId","fullName","position","department","skillsToAssess","assessmentPurpose"],
        "SALARY_UNDERTAKING_LETTER": ["employeeId","fullName","position","currentSalary","salaryFrequency","undertakingPurpose"],
        "SALARY_CONFIRMATION_LETTER": ["employeeId","fullName","position","department","currentSalary","currency","confirmationPurpose"],
        "EMPLOYMENT_CONFIRMATION_LETTER": ["employeeId","fullName","position","department","employmentType","workingHours","reportingManager","confirmationPurpose"]
      };

      const mappedLetterType = mapLetterTypeToEnum(letterType);
      const requiredFields = requiredFieldsMap[mappedLetterType] || [];
      const missingFields = requiredFields.filter(field => !formData[field] || formData[field].toString().trim() === '');
      
      if (missingFields.length > 0) {
        setSnackbar({ 
          open: true, 
          message: `Missing required fields: ${missingFields.join(', ')}`, 
          severity: "error" 
        });
        return;
      }

      // Clear any previous errors
      clearError();

      // Prepare the request payload to match backend DTO structure
      // The backend DTO expects Map<String, Object> fields, not fieldsJson
      // Also ensure employeeId is included in the fields for the service layer
      const enrichedFormData = {
        ...formData,
        employeeId: employeeId.toString() // Ensure employeeId is in the fields as the service expects it
      };

      const requestPayload = {
        letterType: mapLetterTypeToEnum(letterType),
        fields: enrichedFormData, // Send as Map<String, Object> to match DTO structure
      };

      console.log("Submitting letter request:", {
        employeeId,
        payload: requestPayload,
        originalFormData: formData,
        enrichedFormData: enrichedFormData,
        fieldsDataType: typeof enrichedFormData,
        fieldsKeys: Object.keys(enrichedFormData || {}),
        mappedLetterType: mapLetterTypeToEnum(letterType)
      });

      await createLetterRequest(employeeId, requestPayload);
      setSnackbar({ open: true, message: "Letter request submitted successfully!", severity: "success" });
      setTimeout(() => router.push("/letter/history"), 400);
    } catch (e) {
      console.error("Letter submission error:", e);
      console.error("Error response:", e?.response?.data);
      console.error("Error status:", e?.response?.status);
      // Network fallback: cache locally so history still shows entry
      const isNetwork = e?.isNetworkError || !e?.response;
      if (isNetwork) {
        const existing = getUserData(LS_KEY, []);
        const newEntry = {
          id: Date.now(),
          letterType,
          requestedAt: new Date().toISOString(),
          recipientEmail: formData?.email || formData?.recipientEmail || "",
          status: "pending",
          letterHtml: "",
          fields: formData || {},
        };
        saveUserData(LS_KEY, [newEntry, ...(Array.isArray(existing) ? existing : [])]);
        setSnackbar({ open: true, message: "Server unreachable. Saved request locally and added to your history.", severity: "warning" });
        setTimeout(() => router.push("/letter/history"), 400);
        return;
      }
      
      // Use the letterError from the hook if available
      const errorMessage = letterError || e?.response?.data?.message || "Failed to submit request";
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
    }
  };

  return (
    <>
      {step === "selection" && <LetterTypeSelector onSelectLetterType={handleLetterTypeSelect} />}

      {step === "form" && (
        <LetterRequestForm
          letterType={selectedLetterType}
          onBack={handleBack}
          onGenerate={handleSubmit}
          isAdmin={false}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SubmitLetterPage;
