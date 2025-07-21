import React from 'react';
import { Grid, TextField, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Readonlyfield = ({ label, value }) => {
  const theme = useTheme();
  
  return (
    <TextField
      label={label}
      value={value}
      fullWidth
      InputProps={{
        readOnly: true,
      }}
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root': {
          backgroundColor: theme.palette.background,
          '& fieldset': {
            borderColor: theme.palette.text.primary,
          },
          '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
          },
        },
        '& .MuiInputLabel-root': {
          color: theme.palette.text,
          fontSize: { xs: '0.875rem', sm: '1rem' },
          '&.Mui-focused': {
            color: theme.palette.primary.main,
          }
        },
        '& .MuiInputBase-input': {
          fontSize: { xs: '0.875rem', sm: '1rem' },
          color: theme.palette.text,
          fontWeight: 400,
          backgroundColor: 'transparent'
        }
      }}
    />
  );
};

const PersonalInfo = () => {
  const theme = useTheme();

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: { xs: 1, sm: 2, md: 3 },
      maxWidth: '100%',
      overflow: 'hidden'
    }}>

      
      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {/* Left Column (Personal Info) */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" gap={{ xs: 1.5, sm: 2 }}>
            <Readonlyfield label="Full Name" value="Brooklyn Simmons" />
            <Readonlyfield label="Email" value="brooklyn.s@example.com" />
            <Readonlyfield label="Gender" value="Male" />
            <Readonlyfield label="Birthday" value="01 Nov 1990" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalInfo; 