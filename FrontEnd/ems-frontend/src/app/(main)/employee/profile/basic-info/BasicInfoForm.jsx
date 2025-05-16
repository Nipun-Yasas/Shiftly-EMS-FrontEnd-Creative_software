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

const BasicInfoForm = () => {
  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <Grid container spacing={10}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Readonlyfield label="Full Name" value="Brooklyn Simmons" />
            <Readonlyfield label="Entity" value="CTS" />
            <Readonlyfield label="Employee Number" value="12344" />
            <Readonlyfield label="Designation" value="Software Engineer" />
            <Readonlyfield label="Birthday" value="01 Nov 1990" />
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Readonlyfield label="Gender" value="Male" />
            <Readonlyfield label="EPF Number" value="1244" />
            <Readonlyfield label="Email" value="brooklyn.s@example.com" />
            <Readonlyfield label="Location" value="Sri-Lanka" />
            <Readonlyfield label="Reporting Person" value="John Smith" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BasicInfoForm;
