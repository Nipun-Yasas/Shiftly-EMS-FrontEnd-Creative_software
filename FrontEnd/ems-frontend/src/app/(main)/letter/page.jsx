'use client';

import { useState } from 'react';
import { useTheme } from '@mui/material';

import LetterTypeSelector from './components/LetterTypeSelector';
import LetterRequestForm from './components/LetterRequestForm';
import LetterGenerationInterface from './components/LetterGenerationInterface';

const RequestLetter = () => {
  const theme = useTheme();
  const [currentStep, setCurrentStep] = useState('selection'); // 'selection', 'form', 'generation'
  const [selectedLetterType, setSelectedLetterType] = useState(null);
  const [formData, setFormData] = useState(null);

  const handleLetterTypeSelect = (letterType) => {
    setSelectedLetterType(letterType);
    setCurrentStep('form');
  };

  const handleFormSubmit = (data) => {
    setFormData(data.formData);
    setCurrentStep('generation');
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
        />
      )}

      {currentStep === 'generation' && (
        <LetterGenerationInterface
          letterType={selectedLetterType}
          formData={formData}
          onBack={handleBackToForm}
          onStartOver={handleStartOver}
        />
      )}
    </>
  );
};

export default RequestLetter;