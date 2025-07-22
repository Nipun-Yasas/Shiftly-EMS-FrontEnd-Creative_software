'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import AddIcon from '@mui/icons-material/Add';
import SkillsForm from './SkillsForm';

const columns = [
  { field: "id", headerName: "ID", flex:1},
  { field: "skillName", headerName: "Skill Name",flex:1 },
  { field: "proficiency", headerName: "Proficiency", flex:1 },
];

const SkillsTab = ({ employeeData }) => {
  const theme = useTheme();

  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    skillName: '',
    proficiency: '',
  });

  // Parse skills from employeeData (should be an array now)
  const skillsData = employeeData?.skills || [];
  
  // Convert skills text to table data - you can modify this logic based on your data format
  const skillsArray = Array.isArray(skillsData) ? skillsData : 
    (typeof skillsData === 'string' && skillsData ? [skillsData] : []);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just close modal and show success message
    // In a real implementation, you would update the employee skills via API
    setOpenModal(false);
    setOpenSnackbar(true);
    setFormData({ skillName: '', proficiency: '' });
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
        onClick={handleOpenModal}
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

      {/* Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="skills-form-modal"
        aria-describedby="form-to-add-skills"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add Skill
          </Typography>
          <SkillsForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleCancel={handleCloseModal}
          />
        </Box>
      </Modal>

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

      {/* Skills Display */}
      {skillsArray && skillsArray.length > 0 ? (
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
            Skills & Expertise
          </Typography>
          <Box sx={{ 
            backgroundColor: theme.palette.grey[50],
            p: 3,
            borderRadius: 2,
            border: `1px solid ${theme.palette.grey[200]}`
          }}>
            {skillsArray.map((skill, index) => (
              <Typography
                key={index}
                variant="body1"
                color="text.primary"
                sx={{
                  lineHeight: 1.6,
                  mb: index < skillsArray.length - 1 ? 2 : 0,
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
                {skill}
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
            No Skills Information Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Skills information will be displayed here once added to the profile.
          </Typography>
        </Box>
      )}
      
    </Box>
  );
};

export default SkillsTab;
