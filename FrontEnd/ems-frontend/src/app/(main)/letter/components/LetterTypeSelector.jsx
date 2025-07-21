'use client';

import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Chip,
  useTheme
} from '@mui/material';
import {
  Assignment,
  Work,
  AttachMoney,
  VerifiedUser,
  BusinessCenter
} from '@mui/icons-material';

const LetterTypeSelector = ({ onSelectLetterType }) => {
  const theme = useTheme();

  const letterTypes = [
    {
      id: 1,
      name: "EPF/ETF Name Change Letter",
      description: "Request a letter for updating your name in EPF/ETF records",
      icon: <Assignment />,
      category: "Personal Documents",
      estimatedTime: "2-3 business days"
    },
    {
      id: 2,
      name: "Letter for Skill Assessment",
      description: "Official letter confirming your skills and competencies",
      icon: <Work />,
      category: "Professional",
      estimatedTime: "3-5 business days"
    },
    {
      id: 3,
      name: "Salary Undertaking Letter",
      description: "Letter providing salary undertaking for various purposes",
      icon: <AttachMoney />,
      category: "Financial",
      estimatedTime: "1-2 business days"
    },
    {
      id: 4,
      name: "Salary Confirmation Letter",
      description: "Official confirmation of your current salary details",
      icon: <VerifiedUser />,
      category: "Financial",
      estimatedTime: "1-2 business days"
    },
    {
      id: 5,
      name: "Employment Confirmation Letter",
      description: "Verification letter confirming your employment status",
      icon: <BusinessCenter />,
      category: "Employment",
      estimatedTime: "2-3 business days"
    }
  ];

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Personal Documents': return theme.palette.info.main;
      case 'Professional': return theme.palette.success.main;
      case 'Financial': return theme.palette.warning.main;
      case 'Employment': return theme.palette.primary.main;
      default: return theme.palette.grey[500];
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.secondary,
            maxWidth: 600,
            mx: 'auto'
          }}
        >
          Select the type of letter you need. We'll guide you through the process
          and generate your letter quickly and efficiently.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {letterTypes.map((letterType) => (
          <Grid item xs={12} sm={6} md={2.4} key={letterType.id}>
            <Card
              elevation={2}
              sx={{
                height: 180,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  elevation: 6,
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[6]
                },
                borderRadius: 2,
                border: '1.5px solid #E90A4D'
              }}
            >
              <CardActionArea
                onClick={() => onSelectLetterType(letterType.name)}
                sx={{ 
                  height: '100%',
                  p: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch'
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1.5 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        backgroundColor: `${getCategoryColor(letterType.category)}20`,
                        color: getCategoryColor(letterType.category),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {letterType.icon}
                    </Box>
                  </Box>

                  <Chip
                    label={letterType.category}
                    size="small"
                    sx={{
                      backgroundColor: `${getCategoryColor(letterType.category)}20`,
                      color: getCategoryColor(letterType.category),
                      fontWeight: 'medium',
                      fontSize: '0.7rem',
                      height: 20,
                      mb: 1,
                      alignSelf: 'center'
                    }}
                  />

                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 'bold',
                      color: theme.palette.text.primary,
                      mb: 1,
                      lineHeight: 1.2,
                      textAlign: 'center',
                      fontSize: '0.85rem'
                    }}
                  >
                    {letterType.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          Need help? Contact HR department for assistance with your letter request.
        </Typography>
      </Box>
    </Box>
  );
};

export default LetterTypeSelector;
