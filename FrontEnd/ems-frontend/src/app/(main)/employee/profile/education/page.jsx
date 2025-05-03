import React, { useState } from 'react';
import PlusIcon from "@mui/icons-material/Add";
import { Modal, Box, Snackbar, Alert } from '@mui/material';
import EducationForm from '../components/EducationForm';

const Education = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    duration: '',
  });
  const [educations, setEducations] = useState([]);

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
    // Add new education to the list
    setEducations((prev) => [...prev, formData]);
    console.log('Form submitted:', formData);
    setOpenModal(false);
    setOpenSnackbar(true);
    // Reset form
    setFormData({ degree: '', institution: '', duration: '' });
  };

  // Handle snackbar close
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <div className="relative min-h-screen p-4 sm:p-6">
      <PlusIcon
        className="cursor-pointer w-6 h-6 scale-130 border rounded-2xl absolute top-0 right-0 m-4"
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

      {/* Education Table */}
      {educations.length > 0 && (
        <div className=" w-full max-w-4xl">
          <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
            Education List
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse shadow rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Degree</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Institution</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Duration</th>
                </tr>
              </thead>
              <tbody>
                {educations.map((edu, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 text-sm text-gray-900">{edu.degree}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{edu.institution}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{edu.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Education;