'use client';

import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  Chip,
  IconButton,
  useTheme,
  Divider
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Preview,
  CheckCircle,
  Assignment,
  Work,
  AttachMoney,
  VerifiedUser,
  BusinessCenter,
  Email,
  Print
} from '@mui/icons-material';

const LetterGenerationInterface = ({ letterType, formData, onBack, onStartOver }) => {
  const theme = useTheme();
  const [generationStep, setGenerationStep] = useState(0);
  const [generatedLetter, setGeneratedLetter] = useState(null);

  const steps = [
    'Processing Request',
    'Generating Letter',
    'Finalizing Document',
    'Ready for Download'
  ];

  const getLetterIcon = (letterTypeName) => {
    switch (letterTypeName) {
      case "EPF/ETF Name Change Letter": return <Assignment />;
      case "Letter for Skill Assessment": return <Work />;
      case "Salary Undertaking Letter": return <AttachMoney />;
      case "Salary Confirmation Letter": return <VerifiedUser />;
      case "Employment Confirmation Letter": return <BusinessCenter />;
      default: return <Assignment />;
    }
  };

  // Simulate letter generation process
  useEffect(() => {
    const generateLetter = async () => {
      for (let i = 0; i <= 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate processing time
        setGenerationStep(i);
      }
      
      // Simulate generated letter content
      setGeneratedLetter({
        content: `This is a sample ${letterType} generated based on your provided information...`,
        fileName: `${letterType.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`,
        generatedAt: new Date().toLocaleString()
      });
    };

    generateLetter();
  }, [letterType]);

  const handleDownload = () => {
    // Simulate download functionality
    console.log('Downloading letter:', generatedLetter.fileName);
    // In real implementation, this would trigger the actual download
    alert('Letter download started!');
  };

  const handleEmailSend = () => {
    // Simulate email functionality
    console.log('Sending letter via email');
    alert('Letter sent to your email address!');
  };

  const handlePrint = () => {
    // Simulate print functionality
    console.log('Printing letter');
    window.print();
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton
            onClick={onBack}
            sx={{
              mr: 2,
              color: theme.palette.text.primary,
              '&:hover': { backgroundColor: `${theme.palette.primary.main}20` }
            }}
          >
            <ArrowBack />
          </IconButton>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              backgroundColor: `${theme.palette.primary.main}20`,
              color: theme.palette.primary.main,
              mr: 2
            }}
          >
            {getLetterIcon(letterType)}
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.text.primary,
                fontFamily: 'var(--font-poppins)'
              }}
            >
              Letter Generation
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              {letterType}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Generation Progress */}
      <Card
        elevation={2}
        sx={{
          mb: 3,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: theme.palette.text.primary,
              mb: 3,
              textAlign: 'center'
            }}
          >
            {generationStep < 3 ? 'Generating Your Letter...' : 'Letter Generated Successfully!'}
          </Typography>

          <Stepper activeStep={generationStep} alternativeLabel sx={{ mb: 3 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel
                  StepIconComponent={({ active, completed }) => (
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: completed || active 
                          ? theme.palette.primary.main 
                          : theme.palette.grey[300],
                        color: completed || active ? 'white' : theme.palette.grey[600],
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {completed ? <CheckCircle sx={{ fontSize: 16 }} /> : index + 1}
                    </Box>
                  )}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>

          {generationStep < 3 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress 
                sx={{ color: theme.palette.primary.main }}
                size={32}
              />
            </Box>
          )}

          {generationStep === 3 && generatedLetter && (
            <Box sx={{ textAlign: 'center' }}>
              <CheckCircle 
                sx={{ 
                  fontSize: 48, 
                  color: theme.palette.success.main,
                  mb: 2
                }} 
              />
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.secondary }}
              >
                Your letter has been generated and is ready for download.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Letter Preview and Actions */}
      {generationStep === 3 && generatedLetter && (
        <>
          {/* Letter Details */}
          <Card
            elevation={2}
            sx={{
              mb: 3,
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.text.primary,
                  mb: 2
                }}
              >
                Letter Details
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Chip
                  label={`Type: ${letterType}`}
                  sx={{
                    backgroundColor: `${theme.palette.primary.main}15`,
                    color: theme.palette.primary.main
                  }}
                />
                <Chip
                  label={`Generated: ${generatedLetter.generatedAt}`}
                  sx={{
                    backgroundColor: `${theme.palette.success.main}15`,
                    color: theme.palette.success.main
                  }}
                />
                <Chip
                  label={`File: ${generatedLetter.fileName}`}
                  sx={{
                    backgroundColor: `${theme.palette.info.main}15`,
                    color: theme.palette.info.main
                  }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 'bold',
                  color: theme.palette.text.primary,
                  mb: 1
                }}
              >
                Form Data Summary:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Object.entries(formData).map(([key, value]) => (
                  value && (
                    <Chip
                      key={key}
                      label={`${key}: ${value}`}
                      size="small"
                      variant="outlined"
                    />
                  )
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.text.primary,
                mb: 3,
                textAlign: 'center'
              }}
            >
              What would you like to do next?
            </Typography>

            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: 2, 
                justifyContent: 'center',
                mb: 3
              }}
            >
              <Button
                onClick={handleDownload}
                variant="contained"
                startIcon={<Download />}
                sx={{
                  minWidth: 140,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'medium',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                }}
              >
                Download PDF
              </Button>

              <Button
                onClick={handleEmailSend}
                variant="outlined"
                startIcon={<Email />}
                sx={{
                  minWidth: 140,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'medium'
                }}
              >
                Email Letter
              </Button>

              <Button
                onClick={handlePrint}
                variant="outlined"
                startIcon={<Print />}
                sx={{
                  minWidth: 140,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'medium'
                }}
              >
                Print Letter
              </Button>

              <Button
                onClick={() => window.open('#', '_blank')}
                variant="outlined"
                startIcon={<Preview />}
                sx={{
                  minWidth: 140,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'medium'
                }}
              >
                Preview
              </Button>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                onClick={onStartOver}
                variant="text"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'medium'
                }}
              >
                Request Another Letter
              </Button>
            </Box>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default LetterGenerationInterface;
