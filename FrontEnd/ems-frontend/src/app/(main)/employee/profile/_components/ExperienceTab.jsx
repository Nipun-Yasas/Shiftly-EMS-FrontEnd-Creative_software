'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import ExperienceForm from './ExperienceForm';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';



import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import Fab from '@mui/material/Fab';



const ExperienceTab = ({ employeeData }) => {
  const theme = useTheme();

  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    
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
    setFormData({ jobTitle: '' });
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
      overflow: 'hidden',
    }}>
      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="experience-form-dialog-title"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, p: 1 }
        }}
      >
        <DialogTitle id="experience-form-dialog-title" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          Add Experience
        </DialogTitle>
        <DialogContent>
          <ExperienceForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleCancel={handleCloseDialog}
            existingExperiences={experienceData}
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
        <Box sx={{ width: '100%', p: { xs: 1, sm: 3 } }}>
                    {/* Vertical list of experience cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {experienceData.map((experience, index) => (
              <Card
                key={index}
                elevation={3}
                sx={{
                  width: '100%',
                  maxWidth: 600,
                  mx: 'auto',
                  px: { xs: 2, sm: 3 },
                  py: { xs: 2, sm: 2.5 },
                  borderRadius: 3,
                  boxShadow: theme.shadows[2],
                  background: theme.palette.background,
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <CardContent sx={{ p: 0, width: '100%' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.05rem', color: theme.palette.text }}>
                    {experience.jobTitle || experience}
                  </Typography>
                  
                  
                  
                </CardContent>
              </Card>
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