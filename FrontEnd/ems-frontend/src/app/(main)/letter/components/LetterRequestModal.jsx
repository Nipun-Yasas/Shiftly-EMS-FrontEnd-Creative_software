'use client';

import React, { useEffect, useState } from 'react';
import { Formik, Form } from "formik";
import {
  Dialog, DialogTitle, DialogContent, Button, IconButton, Box, Stack,
  useTheme, CircularProgress, Alert, Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import InputItem from "../../../_components/inputs/InputItem";
import TextInput from "../../../_components/inputs/TextInput";
import SelectInput from "../../../_components/inputs/SelectInput";
import DateInput from "../../../_components/inputs/DateInput";

// Constants
const LETTER_TYPES = [
  { id: 1, name: "EPF/ETF Name Change Letter" },
  { id: 2, name: "Letter for Skill Assessment" },
  { id: 3, name: "Salary Undertaking Letter" },
  { id: 4, name: "Salary Confirmation Letter" },
  { id: 5, name: "Employment Confirmation Letter" },
];

const API_ENDPOINT = 'http://localhost:8080/api/v1/shiftly/ems/ai-letter/generate';

// Letter type configurations
const LETTER_CONFIGS = {
  "EPF/ETF Name Change Letter": {
    fields: [
      { name: "employeeId", label: "Employee ID", type: "text", required: true },
      { name: "currentName", label: "Current Name", type: "text", required: true },
      { name: "newName", label: "New Name", type: "text", required: true },
      { name: "nicNumber", label: "NIC Number", type: "text", required: true },
      { name: "epfNumber", label: "EPF Number", type: "text", required: true },
      { name: "etfNumber", label: "ETF Number", type: "text", required: true },
      { name: "reasonForChange", label: "Reason for Name Change", type: "textarea", required: true },
      { name: "effectiveDate", label: "Effective Date", type: "date", required: true },
    ],
    initialValues: { employeeId: "", currentName: "", newName: "", nicNumber: "", epfNumber: "", etfNumber: "", reasonForChange: "", effectiveDate: "" }
  },
  "Letter for Skill Assessment": {
    fields: [
      { name: "employeeId", label: "Employee ID", type: "text", required: true },
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "position", label: "Current Position", type: "text", required: true },
      { name: "department", label: "Department", type: "text", required: true },
      { name: "skillsToAssess", label: "Skills to be Assessed", type: "textarea", required: true },
      { name: "assessmentPurpose", label: "Purpose of Assessment", type: "textarea", required: true },
    ],
    initialValues: { employeeId: "", fullName: "", position: "", department: "", skillsToAssess: "", assessmentPurpose: "" }
  },
  "Salary Undertaking Letter": {
    fields: [
      { name: "employeeId", label: "Employee ID", type: "text", required: true },
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "position", label: "Position", type: "text", required: true },
      { name: "currentSalary", label: "Current Salary", type: "text", required: true },
      { name: "currency", label: "Currency", type: "text", required: true },
      { name: "salaryFrequency", label: "Salary Frequency (Monthly/Annual)", type: "text", required: true },
      { name: "undertakingPurpose", label: "Purpose of Undertaking", type: "textarea", required: true },
    ],
    initialValues: { employeeId: "", fullName: "", position: "", currentSalary: "", currency: "LKR", salaryFrequency: "Monthly", undertakingPurpose: "" }
  },
  "Salary Confirmation Letter": {
    fields: [
      { name: "employeeId", label: "Employee ID", type: "text", required: true },
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "position", label: "Position", type: "text", required: true },
      { name: "department", label: "Department", type: "text", required: true },
      { name: "currentSalary", label: "Current Salary", type: "text", required: true },
      { name: "currency", label: "Currency", type: "text", required: true },
      { name: "allowances", label: "Allowances (if any)", type: "textarea", required: false },
      { name: "confirmationPurpose", label: "Purpose of Confirmation", type: "textarea", required: true },
    ],
    initialValues: { employeeId: "", fullName: "", position: "", department: "", currentSalary: "", currency: "LKR", allowances: "", confirmationPurpose: "" }
  },
  "Employment Confirmation Letter": {
    fields: [
      { name: "employeeId", label: "Employee ID", type: "text", required: true },
      { name: "fullName", label: "Full Name", type: "text", required: true },
      { name: "position", label: "Position", type: "text", required: true },
      { name: "department", label: "Department", type: "text", required: true },
      { name: "employmentType", label: "Employment Type (Full-time/Part-time/Contract)", type: "text", required: true },
      { name: "workingHours", label: "Working Hours", type: "text", required: true },
      { name: "reportingManager", label: "Reporting Manager", type: "text", required: true },
      { name: "confirmationPurpose", label: "Purpose of Confirmation", type: "textarea", required: true },
    ],
    initialValues: { employeeId: "", fullName: "", position: "", department: "", employmentType: "Full-time", workingHours: "", reportingManager: "", confirmationPurpose: "" }
  }
};

const API_TYPE_MAPPING = {
  "EPF/ETF Name Change Letter": "EPF_NAME_CHANGE_LETTER",
  "Letter for Skill Assessment": "SKILL_ASSESSMENT_LETTER", 
  "Salary Undertaking Letter": "SALARY_UNDERTAKING_LETTER",
  "Salary Confirmation Letter": "SALARY_CONFIRMATION_LETTER",
  "Employment Confirmation Letter": "EMPLOYMENT_CONFIRMATION_LETTER"
};

const LetterRequestModal = ({ letterType, onClose, open }) => {
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [generatedLetter, setGeneratedLetter] = useState(null);
  const [selectedLetterType, setSelectedLetterType] = useState(letterType || '');
  const [currentLetterConfig, setCurrentLetterConfig] = useState(LETTER_CONFIGS[letterType] || { fields: [], initialValues: {} });

  // Helper functions
  const getLetterConfig = (typeName) => LETTER_CONFIGS[typeName] || { fields: [], initialValues: {} };
  const mapLetterTypeForAPI = (typeName) => API_TYPE_MAPPING[typeName] || "GENERAL_LETTER";

  const generateLetterAPI = async (formData) => {
    setIsLoading(true);
    setApiError(null);
    
    try {
      const requestPayload = {
        letterType: mapLetterTypeForAPI(formData.letterType.name),
        fields: { ...formData, letterType: undefined }
      };

      Object.keys(requestPayload.fields).forEach(key => {
        if (requestPayload.fields[key] === undefined || requestPayload.fields[key] === null) {
          delete requestPayload.fields[key];
        }
      });

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      result.success ? setGeneratedLetter(result.letterHtml) : setApiError(result.message || 'Failed to generate letter');
    } catch (error) {
      setApiError('We are currently experiencing technical difficulties. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintLetter = () => {
    if (!generatedLetter) return;
    const printWindow = window.open('', '_blank');
    
    const printStyles = `
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { 
        font-family: ${theme.typography.fontFamily}; 
        line-height: ${theme.typography.body1.lineHeight}; 
        color: ${theme.palette.text.primary}; 
        padding: ${theme.spacing(3)}; 
        background: ${theme.palette.background.paper}; 
      }
      .letter-header { 
        text-align: center; 
        margin-bottom: ${theme.spacing(4)}; 
        padding-bottom: ${theme.spacing(2)}; 
        border-bottom: 2px solid ${theme.palette.primary.main}; 
      }
      .company-name { 
        font-size: ${theme.typography.h4.fontSize}; 
        font-weight: ${theme.typography.h4.fontWeight}; 
        color: ${theme.palette.primary.main}; 
        margin-bottom: ${theme.spacing(1)}; 
        font-family: ${theme.typography.h4.fontFamily}; 
      }
      .company-details { 
        font-size: ${theme.typography.caption.fontSize}; 
        color: ${theme.palette.text.secondary}; 
        font-family: ${theme.typography.caption.fontFamily}; 
      }
      .letter-content { 
        margin: ${theme.spacing(4)} 0; 
        font-size: ${theme.typography.body1.fontSize}; 
        line-height: ${theme.typography.body1.lineHeight}; 
      }
      .letter-footer { 
        margin-top: ${theme.spacing(6)}; 
        padding-top: ${theme.spacing(2)}; 
        border-top: 1px solid ${theme.palette.divider}; 
        text-align: center; 
        font-size: ${theme.typography.caption.fontSize}; 
        color: ${theme.palette.text.secondary}; 
      }
      @media print { 
        body { margin: 0; padding: ${theme.spacing(2)}; } 
        .no-print { display: none; } 
        @page { margin: 1cm; }
      }
    `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Letter - Shiftly Solutions</title>
          <style>${printStyles}</style>
        </head>
        <body>
          <div class="letter-header">
            <div class="company-name">SHIFTLY SOLUTIONS</div>
            <div class="company-details">
              123 Business Avenue, Colombo 03, Sri Lanka | Tel: +94 11 123 4567 | Email: hr@shiftly.lk
            </div>
          </div>
          <div class="letter-content">${generatedLetter}</div>
          <div class="letter-footer">
            This is an official document generated by Shiftly Solutions HR Management System
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.focus(); printWindow.print(); printWindow.close(); };
  };

  const renderField = (field) => {
    const baseProps = { name: field.name, label: field.label, key: field.name };
    const fieldProps = {
      date: () => <InputItem key={field.name}><DateInput {...baseProps} /></InputItem>,
      textarea: () => <InputItem key={field.name}><TextInput {...baseProps} multiline rows={3} placeholder={`Enter ${field.label.toLowerCase()}...`} /></InputItem>,
      text: () => <InputItem key={field.name}><TextInput {...baseProps} placeholder={`Enter ${field.label.toLowerCase()}...`} /></InputItem>
    };
    return (fieldProps[field.type] || fieldProps.text)();
  };

  const handleLetterTypeChange = (newLetterType) => {
    setSelectedLetterType(newLetterType);
    setCurrentLetterConfig(getLetterConfig(newLetterType));
  };

  const resetStates = () => {
    setApiError(null);
    setGeneratedLetter(null);
    setIsLoading(false);
  };

  // Effects
  useEffect(() => {
    if (letterType) {
      setSelectedLetterType(letterType);
      setCurrentLetterConfig(getLetterConfig(letterType));
    }
  }, [letterType]);

  useEffect(() => { if (!open) resetStates(); }, [open]);

  // Styles
  const primaryColor = theme.palette.primary.main;
  const styles = {
    dialog: { borderRadius: 3, backgroundColor: theme.palette.background, border: `1px solid ${theme.palette.divider}`, p: 3 },
    title: { fontWeight: 'bold', fontSize: '1.25rem', color: theme.palette.text.primary, pr: 5 },
    primaryButton: { backgroundColor: primaryColor, color: 'white', minWidth: '120px', '&:hover': { backgroundColor: theme.palette.primary.dark }, '&:disabled': { backgroundColor: `${primaryColor}80` }},
    outlinedButton: { color: theme.palette.text.secondary, borderColor: theme.palette.divider, '&:hover': { borderColor: theme.palette.text.secondary, backgroundColor: theme.palette.action.hover }},
    letterContainer: { border: `1.5px solid ${primaryColor}`, borderRadius: 2, p: 3, backgroundColor: theme.palette.background.paper, maxHeight: '400px', overflow: 'auto' },
    printButton: { borderColor: primaryColor, color: primaryColor, '&:hover': { backgroundColor: `${primaryColor}04` }}
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" PaperProps={{ sx: styles.dialog }}>
      <Box sx={{ position: 'relative' }}>
        <DialogTitle sx={styles.title}>{letterType}</DialogTitle>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, color: theme.palette.text.secondary }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
        {apiError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError(null)}>{apiError}</Alert>}
        
        {generatedLetter && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, color: primaryColor, fontWeight: 'bold' }}>Generated Letter:</Typography>
            <Box sx={styles.letterContainer} dangerouslySetInnerHTML={{ __html: generatedLetter }} />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="outlined" onClick={handlePrintLetter} sx={styles.printButton}>Print Letter</Button>
              <Button variant="contained" sx={styles.primaryButton} onClick={resetStates}>Generate New Letter</Button>
            </Box>
          </Box>
        )}
        
        <Formik
          enableReinitialize={true}
          initialValues={{ letterType: LETTER_TYPES.find(type => type.name === selectedLetterType) || null, ...currentLetterConfig.initialValues }}
          validate={(values) => {
            const errors = {};
            if (!values.letterType) errors.letterType = "Letter type is required";
            currentLetterConfig.fields.forEach(field => {
              if (field.required && (!values[field.name] || values[field.name].trim() === '')) {
                errors[field.name] = `${field.label} is required`;
              }
            });
            return errors;
          }}
          onSubmit={async (values) => await generateLetterAPI(values)}
        >
          {({ validateForm, resetForm, values, setFieldValue }) => (
            <Form>
              <Stack>
                <Box sx={{ display: "flex", justifyContent: "space-between", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 0, sm: 2 } }}>
                  <InputItem>
                    <SelectInput
                      name="letterType" label="Letter Type" options={LETTER_TYPES}
                      getOptionLabel={(option) => option.name || ""}
                      onChange={(event, newValue) => { setFieldValue('letterType', newValue); if (newValue) handleLetterTypeChange(newValue.name); }}
                    />
                  </InputItem>
                </Box>
                
                {currentLetterConfig.fields.map((field) => (
                  <Box key={field.name} sx={{ display: "flex", justifyContent: "space-between", flexDirection: { xs: "column", sm: "row" }, gap: { xs: 0, sm: 2 } }}>
                    {renderField(field)}
                  </Box>
                ))}

                <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "flex-end" }, pb: 2, gap: 2, mt: 2 }}>
                  <Button variant="outlined" type="reset" disabled={isLoading} sx={styles.outlinedButton}
                    onClick={() => { resetForm(); resetStates(); onClose(); }}>CANCEL</Button>
                  <Button type="submit" variant="contained" disabled={isLoading} sx={styles.primaryButton}
                    onClick={async () => { const errors = await validateForm(); if (Object.keys(errors).length === 0) await generateLetterAPI(values); }}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}>
                    {isLoading ? 'GENERATING...' : 'GENERATE'}
                  </Button>
                </Box>
              </Stack>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default LetterRequestModal;