
'use client';

import { useState } from 'react';
import { useTheme } from '@mui/material';
import { useContext } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import axiosInstance from '../../_utils/axiosInstance';
import { API_PATHS } from '../../_utils/apiPaths';
import { UserContext } from '../../context/UserContext';
import { useRouter } from 'next/navigation';
import { getUserData, saveUserData } from '../../_utils/localStorageUtils';

import LetterTypeSelector from './components/LetterTypeSelector';
import LetterRequestForm from './components/LetterRequestForm';
import LetterGenerationInterface from './components/LetterGenerationInterface';

const RequestLetter = () => {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useContext(UserContext);
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
      await axiosInstance.post(API_PATHS.LETTER.REQUEST.ADD, {
        letterType: mapLetterTypeToEnum(data.letterType),
        fields: data.formData,
      });
      setSnackbar({ open: true, message: 'Letter request submitted', severity: 'success' });
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
      setSnackbar({ open: true, message: e?.response?.data?.message || 'Failed to submit request', severity: 'error' });
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