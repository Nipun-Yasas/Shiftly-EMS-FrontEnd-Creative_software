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
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import AddIcon from '@mui/icons-material/Add';
import EducationForm from './EducationForm';

const columns = [
  { field: "id", headerName: "ID", flex:1 },
  { field: "degree", headerName: "Degree", flex:1 },
  { field: "institution", headerName: "Institution", flex:1 },
  { field: "duration", headerName: "Duration", flex:1 },
];

const EducationTab = ({ employeeData }) => {
  const theme = useTheme();

  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    duration: '',
  });

  // Get education data from employeeData (should be an array now)
  const educationData = employeeData?.education || [];
  
  // Convert education to array format
  const educationArray = Array.isArray(educationData) ? educationData : 
    (typeof educationData === 'string' && educationData ? [educationData] : []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just close modal and show success message
    // In a real implementation, you would update the employee education via API
    setOpenDialog(false);
    setOpenSnackbar(true);
    setFormData({ degree: '', institution: '', duration: '' });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', p: { xs: 2, sm: 4 } }}>
      <IconButton
        color="primary"
        onClick={handleOpenDialog}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
        }}
      >
        <AddIcon />
      </IconButton>

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="education-form-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="education-form-dialog-title">
          Add Education
        </DialogTitle>
        <DialogContent>
          <EducationForm
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

      {/* Education Display */}
      {educationArray && educationArray.length > 0 ? (
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
            Education Background
          </Typography>
          <Box sx={{ 
            backgroundColor: theme.palette.grey[50],
            p: 3,
            borderRadius: 2,
            border: `1px solid ${theme.palette.grey[200]}`
          }}>
            {educationArray.map((education, index) => (
              <Typography
                key={index}
                variant="body1"
                color="text.primary"
                sx={{
                  lineHeight: 1.6,
                  mb: index < educationArray.length - 1 ? 2 : 0,
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
                {education}
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
            No Education Information Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Education background will be displayed here once added to the profile.
          </Typography>
        </Box>
      )}
      
    </Box>
  );
};

export default EducationTab;
