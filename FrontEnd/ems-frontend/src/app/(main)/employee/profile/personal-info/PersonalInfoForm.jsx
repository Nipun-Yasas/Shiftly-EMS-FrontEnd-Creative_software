import React from 'react';

import { Grid, TextField, Box } from '@mui/material';


const Readonlyfield = ({ label, value }) => (
  <TextField
    label={label}
    value={value}
    fullWidth
    InputProps={{
      readOnly: true,
    }}
    variant="outlined"
  />
);


const PersonalInfoForm = () => {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={10}>
        {/* Left Column (Personal Info) */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" gap={2}>
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

export default PersonalInfoForm;
