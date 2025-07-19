'use client';

import React, { useState } from 'react';
import {
  Box,
  Modal,
  Snackbar,
  Alert,
  Typography,
  IconButton,
  useTheme
} from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import AddIcon from '@mui/icons-material/Add';
import ExperienceForm from '../components/ExperienceForm';

const columns = [
  { field: "id", headerName: "ID", flex:1 },
  { field: "jobTitle", headerName: "Job Title", flex:1 },
  { field: "company", headerName: "Company", flex:1 },
  { field: "duration", headerName: "Duration", flex:1 },
];

const Experience = () => {
  const theme = useTheme();

  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    duration: '',
  });
  const [experiences, setExperiences] = useState([]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newExperience = {
      id: experiences.length + 1,
      ...formData
    };
    setExperiences((prev) => [...prev, newExperience]);
    setOpenModal(false);
    setOpenSnackbar(true);
    setFormData({ jobTitle: '', company: '', duration: '' });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', p: { xs: 2, sm: 4 } }}>
      <IconButton
        color="primary"
        onClick={handleOpenModal}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          '&:hover': {
            bgcolor: theme.palette.action.hover,
          },
        }}
      >
        <AddIcon />
      </IconButton>

      {/* Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="experience-form-modal"
        aria-describedby="form-to-add-experience"
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
            Add Experience
          </Typography>
          <ExperienceForm
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

      {/* DataGrid */}
      
        <Box sx={{ width: "100%", p: 3 }}>
          <DataGrid
            rows={experiences}
            columns={columns}
            height="auto"
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 50, 100]}
          />
        </Box>
      
    </Box>
  );
};

export default Experience;