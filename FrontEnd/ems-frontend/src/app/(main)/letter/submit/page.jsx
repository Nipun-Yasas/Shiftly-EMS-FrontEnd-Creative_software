"use client";

import { useState, useContext, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

import { UserContext } from "../../../context/UserContext";

import LetterTypeSelector from "../components/LetterTypeSelector";
import LetterRequestForm from "../components/LetterRequestForm";

import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";

export default function SubmitLetterPage() {
  const { user } = useContext(UserContext);
  const [employee, setEmployee] = useState("");
  const [step, setStep] = useState("selection");
  const [selectedLetterType, setSelectedLetterType] = useState(null);
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.EMPLOYEE.GET_BY_USERID(user.id)
      );
      setEmployee(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

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
    setLoading(true);
    try {
      if (!employee.employeeId) {
        setSnackbar({
          open: true,
          message: "Employee ID not found. Please login again.",
          severity: "error",
        });
        return;
      }

      if (!formData || Object.keys(formData).length === 0) {
        setSnackbar({
          open: true,
          message: "Form data is empty. Please fill in the required fields.",
          severity: "error",
        });
        return;
      }

      const requiredFieldsMap = {
        EPF_ETF_NAME_CHANGE_LETTER: [
          "employeeId",
          "currentName",
          "newName",
          "nicNumber",
          "epfNumber",
          "etfNumber",
          "reasonForChange",
          "effectiveDate",
        ],
        SKILL_ASSESSMENT_LETTER: [
          "employeeId",
          "fullName",
          "position",
          "department",
          "skillsToAssess",
          "assessmentPurpose",
        ],
        SALARY_UNDERTAKING_LETTER: [
          "employeeId",
          "fullName",
          "position",
          "currentSalary",
          "salaryFrequency",
          "undertakingPurpose",
        ],
        SALARY_CONFIRMATION_LETTER: [
          "employeeId",
          "fullName",
          "position",
          "department",
          "currentSalary",
          "currency",
          "confirmationPurpose",
        ],
        EMPLOYMENT_CONFIRMATION_LETTER: [
          "employeeId",
          "fullName",
          "position",
          "department",
          "employmentType",
          "workingHours",
          "reportingManager",
          "confirmationPurpose",
        ],
      };

      const mappedLetterType = mapLetterTypeToEnum(letterType);
      const requiredFields = requiredFieldsMap[mappedLetterType] || [];
      const missingFields = requiredFields.filter(
        (field) => !formData[field] || formData[field].toString().trim() === ""
      );

      if (missingFields.length > 0) {
        setSnackbar({
          open: true,
          message: `Missing required fields: ${missingFields.join(", ")}`,
          severity: "error",
        });
        return;
      }

      const enrichedFormData = {
        ...formData,
        employeeId: employee.employeeId,
      };

      const requestPayload = {
        letterType: mapLetterTypeToEnum(letterType),
        fields: enrichedFormData,
      };

      const response = await axiosInstance.post(
        API_PATHS.LETTER.REQUEST.ADD(employee.employeeId),
        requestPayload
      );

      setSnackbar({
        open: true,
        message: "Letter request submitted successfully!",
        severity: "success",
      });
    } catch (e) {
      setSnackbar({ open: true, message: "cant submit", severity: "error" });
    }
  };

  return (
    <>
      {step === "selection" && (
        <LetterTypeSelector onSelectLetterType={handleLetterTypeSelect} />
      )}

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
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
