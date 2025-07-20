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
import EducationForm from '../_components/EducationForm';

const columns = [
  { field: "id", headerName: "ID", flex:1 },
  { field: "degree", headerName: "Degree", flex:1 },
  { field: "institution", headerName: "Institution", flex:1 },
  { field: "duration", headerName: "Duration", flex:1 },
];

const Education = () => {
  const theme = useTheme();

  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    duration: '',
  });
  const [educations, setEducations] = useState([]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEducation = {
      id: educations.length + 1,
      ...formData
    };
    setEducations((prev) => [...prev, newEducation]);
    setOpenModal(false);
    setOpenSnackbar(true);
    setFormData({ degree: '', institution: '', duration: '' });
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
        aria-labelledby="education-form-modal"
        aria-describedby="form-to-add-education"
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
            Add Education
          </Typography>
          <EducationForm
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
      
        <Box sx={{ 
        width: "100%", 
        p: { xs: 0.5, sm: 1, md: 1.5 },
        mt: { xs: 2, sm: 3 }
        }}>
          <DataGrid
            rows={educations}
            columns={columns}
            height={400}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 50, 100]}
            sx={{
              '& .MuiDataGrid-cell': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              },
              '& .MuiDataGrid-columnHeader': {
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                fontWeight: 600
              },
              // Fix for positioning "No rows" message
              '& .MuiDataGrid-overlayWrapperInner': {
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '60px'
              }
            }}
          />
        </Box>
      
    </Box>
  );
};

export default Education;