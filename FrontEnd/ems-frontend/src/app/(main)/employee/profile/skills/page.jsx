import React, { useState } from 'react';
import PlusIcon from "@mui/icons-material/Add";
import { Modal, Box, Snackbar, Alert } from '@mui/material';
import SkillsForm from '../components/SkillsForm';

const Skills = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [formData, setFormData] = useState({
    skillName: '',
    proficiency: '',
  });
  const [skills, setSkills] = useState([]);

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
    // Add new skill to the list
    setSkills((prev) => [...prev, formData]);
    console.log('Form submitted:', formData);
    setOpenModal(false);
    setOpenSnackbar(true);
    // Reset form
    setFormData({ skillName: '', proficiency: '' });
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
          <h2 id="skills-form-modal" className="text-lg font-semibold mb-4">
            Add Skill
          </h2>
          <SkillsForm
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

      {/* Skills Table */}
      {skills.length > 0 && (
        <div className="w-full max-w-4xl">
          <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: 'var(--font-poppins)' }}>
            Skills List
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse shadow rounded-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Skill Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Proficiency</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 text-sm text-gray-900">{skill.skillName}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{skill.proficiency}</td>
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

export default Skills;