import React from "react";


import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import { useTheme } from '@mui/material/styles';

export default function EmployeeNotFound({handleUpdateProfile,error}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        maxWidth: "100%",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          textAlign: "center",
        }}
      >
        <PersonIcon
          sx={{
            fontSize: 80,
            color: theme.palette.text.secondary,
            mb: 2,
          }}
        />

        <Typography
          variant="h4"
          sx={{ mb: 2, color: theme.palette.text.primary }}
        >
          Complete Your Employee Profile
        </Typography>

        {error && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Typography
          variant="body1"
          sx={{ mb: 4, color: theme.palette.text.secondary }}
        >
          Your employee profile is not complete. Please update your profile
          information to access all features.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateProfile}
          sx={{ px: 4, py: 1.5 }}
          startIcon={<EditIcon />}
        >
          Update Profile
        </Button>
      </Paper>
    </Box>
  );
}
