import React, { useState } from 'react';
import PlusIcon from "@mui/icons-material/Add";
import { Modal, Box, Snackbar, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import EducationForm from '../components/EducationForm';

const Education = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    duration: '',
  });
  const router = useRouter();

  // Handle modal open/close
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submission logic (replace with actual API call if needed)
    console.log('Form submitted:', formData);
    setOpenModal(false);
    setOpenSnackbar(true);
    // Reset form
    setFormData({ degree: '', institution: '', duration: '' });
  };

  // Handle snackbar close and redirect
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
    // Redirect to previous page
    router.back();
  };

  return (
    <div className="relative">
      <PlusIcon
        className="cursor-pointer  ml-10 w-6 h-6   mt-0 scale-130 border rounded-2xl absolute top-0 right-0 m-4"
        style={{ color: 'var(--primary)' }}
        onClick={handleOpenModal}
      />

      {/* Modal for the form */}
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
          <h2 id="education-form-modal" className="text-lg font-semibold mb-4">
            Add Education
          </h2>
          <EducationForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleCancel={handleCloseModal}
          />
        </Box>
      </Modal>

      {/* Success Snackbar */}
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
    </div>
  );
};

export default Education;