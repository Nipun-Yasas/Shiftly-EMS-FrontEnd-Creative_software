'use client';

import React, { useEffect, useState } from 'react';
import { Formik, Form } from "formik";
import {
  Dialog, DialogTitle, DialogContent, Button, IconButton, Box, Stack,
  useTheme, CircularProgress, Alert, Typography, TextField
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Download } from '@mui/icons-material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';

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
  const [downloaded, setDownloaded] = useState(false);
  const [letterEdited, setLetterEdited] = useState(false);

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

  const renderField = (field) => {
    const baseProps = { name: field.name, label: field.label, key: field.name };
    if (field.type === 'date') return <InputItem key={field.name}><DateInput {...baseProps} /></InputItem>;
    return <InputItem key={field.name}><TextInput {...baseProps} multiline={field.type === 'textarea'} rows={field.type === 'textarea' ? 3 : undefined} placeholder={`Enter ${field.label.toLowerCase()}...`} /></InputItem>;
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

  useEffect(() => {
    if (letterType) {
      setSelectedLetterType(letterType);
      setCurrentLetterConfig(getLetterConfig(letterType));
    }
  }, [letterType]);
  useEffect(() => { if (!open) resetStates(); }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 3, bgcolor: 'background.paper', p: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.25rem', color: 'text.primary', fontFamily: 'var(--font-poppins)', pr: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {letterType}
          <Tooltip title="Fill out the form to generate your letter. You can edit it before downloading.">
            <InfoOutlinedIcon sx={{ color: 'primary.main' }} />
          </Tooltip>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ ml: 2, color: 'text.secondary' }}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Step indicator */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="primary">
            Step 1: Fill Details &nbsp;→&nbsp; Step 2: Edit Letter &nbsp;→&nbsp; Step 3: Download
          </Typography>
        </Box>
        {apiError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setApiError(null)}>{apiError}</Alert>}
        {generatedLetter ? (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 1, color: theme.palette.text.primary, fontWeight: 700 }}>
              Edit Your Letter Below:
            </Typography>
            <Box sx={{ border: '1.5px solid', borderColor: 'primary.main', borderRadius: 2, p: 3, bgcolor: theme.palette.mode === 'dark' ? '#23272f' : 'background.paper', maxHeight: 400, overflow: 'auto', mb: 2 }}>
              <RichTextEditor value={generatedLetter} onChange={setGeneratedLetter} />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                <Tooltip title="Download your edited letter as a .txt file">
                  <span>
                    <Button
                      variant="contained"
                      sx={{ bgcolor: 'primary.main', color: '#fff', minWidth: 140, '&:hover': { bgcolor: 'primary.dark' } }}
                      onClick={() => {
                        const blob = new Blob([generatedLetter], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${letterType.replace(/\s+/g, '_')}_letter.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                        setDownloaded(true);
                      }}
                      startIcon={<Download />}
                      disabled={!generatedLetter || generatedLetter.trim() === ''}
                    >
                      Download
                    </Button>
                  </span>
                </Tooltip>
              </Box>
              <Snackbar
                open={downloaded}
                autoHideDuration={2000}
                onClose={() => setDownloaded(false)}
                message="Letter downloaded!"
              />
            </Box>
          </Box>
        ) : (
          <Formik
            enableReinitialize
            initialValues={{ letterType: LETTER_TYPES.find(type => type.name === selectedLetterType) || null, ...currentLetterConfig.initialValues }}
            validate={values => {
              const errors = {};
              if (!values.letterType) errors.letterType = "Letter type is required";
              currentLetterConfig.fields.forEach(field => {
                if (field.required && (!values[field.name] || values[field.name].trim() === '')) {
                  errors[field.name] = `${field.label} is required`;
                }
              });
              return errors;
            }}
            onSubmit={generateLetterAPI}
            validateOnChange
            validateOnBlur
          >
            {({ validateForm, resetForm, values, setFieldValue, errors, touched }) => (
              <Form>
                <Stack>
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 0, sm: 2 } }}>
                    <InputItem>
                      <SelectInput
                        name="letterType" label="Letter Type" options={LETTER_TYPES}
                        getOptionLabel={option => option.name || ""}
                        onChange={(event, newValue) => { setFieldValue('letterType', newValue); if (newValue) handleLetterTypeChange(newValue.name); }}
                        autoFocus
                      />
                      {errors.letterType && touched.letterType && (
                        <Typography variant="caption" color="error">{errors.letterType}</Typography>
                      )}
                    </InputItem>
                  </Box>
                  {currentLetterConfig.fields.map(field => (
                    <InputItem key={field.name}>
                      <TextInput
                        name={field.name}
                        label={field.label}
                        multiline={field.type === 'textarea'}
                        rows={field.type === 'textarea' ? 3 : undefined}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                        autoFocus={field.name === currentLetterConfig.fields[0]?.name}
                      />
                      {errors[field.name] && touched[field.name] && (
                        <Typography variant="caption" color="error">{errors[field.name]}</Typography>
                      )}
                    </InputItem>
                  ))}
                  <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, pb: 2, gap: 2, mt: 2 }}>
                    <Button variant="outlined" type="reset" disabled={isLoading} sx={{ color: 'text.secondary', borderColor: 'divider', '&:hover': { borderColor: 'text.secondary', bgcolor: 'action.hover' } }}
                      onClick={() => { resetForm(); resetStates(); onClose(); }}>CANCEL</Button>
                    <Button type="submit" variant="contained" disabled={isLoading} sx={{ bgcolor: 'primary.main', color: '#fff', minWidth: 120, '&:hover': { bgcolor: 'primary.dark' } }}
                      onClick={async () => { const errors = await validateForm(); if (Object.keys(errors).length === 0) await generateLetterAPI(values); }}
                      startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}>
                      {isLoading ? 'GENERATING...' : 'GENERATE'}
                    </Button>
                  </Box>
                </Stack>
              </Form>
            )}
          </Formik>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LetterRequestModal;