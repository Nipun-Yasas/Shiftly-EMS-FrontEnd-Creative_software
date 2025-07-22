'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import ExperienceForm from './ExperienceForm';

const columns = [
  { field: "id", headerName: "ID", flex:1 },
  { field: "jobTitle", headerName: "Job Title", flex:1 },
  { field: "company", headerName: "Company", flex:1 },
  { field: "duration", headerName: "Duration", flex:1 },
];

const ExperienceTab = ({ employeeData }) => {
  const theme = useTheme();

  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    duration: '',
  });

  // Get experience data from employeeData
  const experienceData = employeeData?.experience || [];
  
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just close dialog and show success message
    // In a real implementation, you would update the employee experience via API
    setOpenDialog(false);
    setOpenSnackbar(true);
    setFormData({ jobTitle: '', company: '', duration: '' });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ 
      position: 'relative', 
      minHeight: { xs: '60vh', sm: '70vh' }, 
      p: { xs: 1, sm: 2, md: 3 },
      maxWidth: '100%',
      overflow: 'hidden'
    }}>
      <IconButton
        color="primary"
        onClick={handleOpenDialog}
        sx={{
          position: 'absolute',
          top: { xs: 8, sm: 16 },
          right: { xs: 8, sm: 16 },
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          zIndex: 1,
          '&:hover': {
            bgcolor: theme.palette.primary.light,
            color: 'white'
          },
        }}
      >
        <AddIcon />
      </IconButton>

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="experience-form-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="experience-form-dialog-title">
          Add Experience
        </DialogTitle>
        <DialogContent>
          <ExperienceForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Submitted successfully!
        </Alert>
      </Snackbar>

      {/* Experience Display */}
      {experienceData && experienceData.length > 0 ? (
        <Box sx={{ width: "100%", p: 3 }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 600,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            Work Experience
          </Typography>
          <Box sx={{ 
            backgroundColor: theme.palette.grey[50],
            p: 3,
            borderRadius: 2,
            border: `1px solid ${theme.palette.grey[200]}`
          }}>
            {experienceData.map((experience, index) => (
              <Typography
                key={index}
                variant="body1"
                color="text.primary"
                sx={{
                  lineHeight: 1.6,
                  mb: index < experienceData.length - 1 ? 2 : 0,
                  p: 2,
                  backgroundColor: 'white',
                  borderRadius: 1,
                  border: `1px solid ${theme.palette.grey[200]}`,
                  position: 'relative',
                  '&:before': {
                    content: `"${index + 1}."`,
                    position: 'absolute',
                    left: -16,
                    top: 8,
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                  }
                }}
              >
                {experience}
              </Typography>
            ))}
          </Box>
        </Box>
      ) : (
        <Box 
          sx={{ 
            width: "100%", 
            p: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 200
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            No Experience Information Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Work experience will be displayed here once added to the profile.
          </Typography>
        </Box>
      )}
      
    </Box>
  );
};

export default ExperienceTab;