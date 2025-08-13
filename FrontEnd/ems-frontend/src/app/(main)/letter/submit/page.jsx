"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Snackbar, Alert } from "@mui/material";

import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { UserContext } from "../../../context/UserContext";
import { getUserData, saveUserData } from "../../../_utils/localStorageUtils";

import LetterTypeSelector from "../components/LetterTypeSelector";
import LetterRequestForm from "../components/LetterRequestForm";

// Local storage key for offline/cache history fallback
const LS_KEY = "letterHistory";

const SubmitLetterPage = () => {
  const router = useRouter();
  const { user } = useContext(UserContext);

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
      await axiosInstance.post(API_PATHS.LETTER.REQUEST.ADD, {
        letterType: mapLetterTypeToEnum(letterType),
        fields: formData,
      });
      setSnackbar({ open: true, message: "Letter request submitted", severity: "success" });
      setTimeout(() => router.push("/letter/history"), 400);
    } catch (e) {
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
      setSnackbar({ open: true, message: e?.response?.data?.message || "Failed to submit request", severity: "error" });
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
