
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material';
import { useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axiosInstance from '../../_utils/axiosInstance';
import { API_PATHS } from '../../_utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { getUserData, saveUserData } from '../../_utils/localStorageUtils';
import useLetterRequests from '../../_hooks/useLetterRequests';

import LetterTypeSelector from './components/LetterTypeSelector';
import LetterRequestForm from './components/LetterRequestForm';
import LetterGenerationInterface from './components/LetterGenerationInterface';

const RequestLetter = () => {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useContext(UserContext);
  const { createLetterRequest, error: letterError, clearError } = useLetterRequests();
  const [currentStep, setCurrentStep] = useState('selection'); // 'selection', 'form', 'generation' (admins only)
  const [selectedLetterType, setSelectedLetterType] = useState(null);
  const [formData, setFormData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Map frontend letterType to backend enum (same mapping used in generation UI)
  const mapLetterTypeToEnum = (type) => {
    switch (type) {
      case 'EPF/ETF Name Change Letter': return 'EPF_ETF_NAME_CHANGE_LETTER';
      case 'Letter for Skill Assessment': return 'SKILL_ASSESSMENT_LETTER';
      case 'Salary Undertaking Letter': return 'SALARY_UNDERTAKING_LETTER';
      case 'Salary Confirmation Letter': return 'SALARY_CONFIRMATION_LETTER';
      case 'Employment Confirmation Letter': return 'EMPLOYMENT_CONFIRMATION_LETTER';
      default: return type;
    }
  };

  const handleLetterTypeSelect = (letterType) => {
    setSelectedLetterType(letterType);
    setCurrentStep('form');
  };

  const handleFormSubmit = async (data) => {
    // If admin, allow direct generation workflow; otherwise submit request
    const roles = (user?.roles || []).map(r => r.toLowerCase());
    const isAdmin = roles.includes('admin') || roles.includes('super_admin');
    if (isAdmin) {
      setFormData(data.formData);
      setCurrentStep('generation');
      return;
    }

    try {
      // Get employee ID from user context
      const employeeId = user?.employeeId || user?.id;
      if (!employeeId) {
        setSnackbar({ open: true, message: 'Employee ID not found. Please login again.', severity: 'error' });
        return;
      }

      // Clear any previous errors
      clearError();

      // Create letter request using the new backend endpoint
      // The backend DTO expects fields as Map<String, Object>
      // Also ensure employeeId is included in the fields for the service layer
      const enrichedFormData = {
        ...data.formData,
        employeeId: employeeId.toString() // Ensure employeeId is in the fields as the service expects it
      };

      const requestData = {
        letterType: mapLetterTypeToEnum(data.letterType),
        fields: enrichedFormData, // Send as object to match DTO structure
      };

      await createLetterRequest(employeeId, requestData);
      
      setSnackbar({ open: true, message: 'Letter request submitted successfully', severity: 'success' });
      setTimeout(() => router.push('/letter/history'), 400);
    } catch (e) {
      // Fallback: cache request locally if backend unreachable, so history still shows it
      const isNetwork = e?.isNetworkError || !e?.response;
      if (isNetwork) {
        const LS_KEY = 'letterHistory';
        const existing = getUserData(LS_KEY, []);
        const newEntry = {
          id: Date.now(),
          letterType: data.letterType,
          requestedAt: new Date().toISOString(),
          recipientEmail: data.formData?.email || data.formData?.recipientEmail || '',
          status: 'pending',
          letterHtml: '',
          fields: data.formData || {},
        };
        saveUserData(LS_KEY, [newEntry, ...(Array.isArray(existing) ? existing : [])]);
        setSnackbar({ open: true, message: 'Server unreachable. Saved request locally and added to your history.', severity: 'warning' });
        setTimeout(() => router.push('/letter/history'), 400);
        return;
      }
      const errorMessage = letterError || e?.response?.data?.message || 'Failed to submit request';
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    }
  };

  const handleBackToSelection = () => {
    setCurrentStep('selection');
    setSelectedLetterType(null);
    setFormData(null);
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
    setFormData(null);
  };

  const handleStartOver = () => {
    setCurrentStep('selection');
    setSelectedLetterType(null);
    setFormData(null);
  };

  // Reverse map backend enum to display name
  const mapEnumToLetterTypeName = (enumVal) => {
    switch ((enumVal || '').toString()) {
      case 'EPF_ETF_NAME_CHANGE_LETTER': return 'EPF/ETF Name Change Letter';
      case 'SKILL_ASSESSMENT_LETTER': return 'Letter for Skill Assessment';
      case 'SALARY_UNDERTAKING_LETTER': return 'Salary Undertaking Letter';
      case 'SALARY_CONFIRMATION_LETTER': return 'Salary Confirmation Letter';
      case 'EMPLOYMENT_CONFIRMATION_LETTER': return 'Employment Confirmation Letter';
      default: return enumVal || '';
    }
  };

  // If requestId is provided (from admin list), and user is admin, jump directly to generation UI
  useEffect(() => {
    const requestId = searchParams?.get('requestId');
    if (!requestId) return;
    const roles = (user?.roles || []).map(r => r.toLowerCase());
    const isAdmin = roles.includes('admin') || roles.includes('super_admin');
    if (!isAdmin) {
      // Non-admins go to submit flow
      router.replace('/letter/submit');
      return;
    }
    (async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.LETTER.REQUEST.GET_BY_ID(requestId));
        const data = res?.data?.data || res?.data || {};
        const typeName = mapEnumToLetterTypeName(data.letterType || data.type);
        const fields = data.fields || {};
        if (!typeName) throw new Error('Invalid letter type');
        setSelectedLetterType(typeName);
        setFormData(fields);
        setCurrentStep('generation');
      } catch (e) {
        setSnackbar({ open: true, message: e?.response?.data?.message || e.message || 'Failed to load request', severity: 'error' });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <>
      {currentStep === 'selection' && (
        <LetterTypeSelector onSelectLetterType={handleLetterTypeSelect} />
      )}

      {currentStep === 'form' && (
        <LetterRequestForm
          letterType={selectedLetterType}
          onBack={handleBackToSelection}
          onGenerate={handleFormSubmit}
          isAdmin={(user?.roles || []).map(r => r.toLowerCase()).some(r => r === 'admin' || r === 'super_admin')}
        />
      )}

  {currentStep === 'generation' && (user?.roles || []).map(r => r.toLowerCase()).some(r => r === 'admin' || r === 'super_admin') && (
        <LetterGenerationInterface
          letterType={selectedLetterType}
          formData={formData}
          onBack={handleBackToForm}
          onStartOver={handleStartOver}
        />
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default RequestLetter;