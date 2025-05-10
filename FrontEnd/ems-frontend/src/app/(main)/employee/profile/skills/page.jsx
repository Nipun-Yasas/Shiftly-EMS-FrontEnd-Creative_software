'use client';

import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Modal,
  Snackbar,
  Alert,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme
} from '@mui/material';
import SkillsForm from '../components/SkillsForm';

const Skills = () => {
  const theme = useTheme();

  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    skillName: '',
    proficiency: '',
  });
  const [skills, setSkills] = useState([]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSkills((prev) => [...prev, formData]);
    setOpenModal(false);
    setOpenSnackbar(true);
    setFormData({ skillName: '', proficiency: '' });
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

      {/* Table */}
      {skills.length > 0 && (
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom>
            Skills List
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Skill Name</strong></TableCell>
                  <TableCell><strong>Proficiency</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {skills.map((skill, index) => (
                  <TableRow key={index}>
                    <TableCell>{skill.skillName}</TableCell>
                    <TableCell>{skill.proficiency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
};

export default Skills;
