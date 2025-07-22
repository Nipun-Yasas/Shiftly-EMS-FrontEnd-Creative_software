'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import { useTheme } from '@mui/material/styles';



import { Fab, Dialog, DialogTitle, DialogContent, Card, CardContent, Button, Stack } from '@mui/material';
import TextInput from '@/app/_components/inputs/TextInput';
import InputItem from '@/app/_components/inputs/InputItem';
import { Formik, Form } from 'formik';



const SkillsTab = ({ employeeData }) => {
  const theme = useTheme();

  // State for skills list
  const [skillsList, setSkillsList] = useState(Array.isArray(employeeData?.skills) ? employeeData.skills : (employeeData?.skills ? [employeeData.skills] : []));
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Keep state in sync if employeeData changes
  useEffect(() => {
    setSkillsList(Array.isArray(employeeData?.skills) ? employeeData.skills : (employeeData?.skills ? [employeeData.skills] : []));
  }, [employeeData]);

  // Add new skills
  const handleAddSkills = (newSkills) => {
    setSkillsList((prev) => [...prev, ...newSkills]);
    setOpenDialog(false);
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '60vh', p: { xs: 1, sm: 2, md: 3 }, maxWidth: '100%', overflow: 'hidden' }}>
      

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="skills-form-dialog-title"
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle id="skills-form-dialog-title" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          Add Skills
        </DialogTitle>
        <DialogContent>
          <SkillsForm
            existingSkills={skillsList}
            onAddSkills={handleAddSkills}
            handleCancel={() => setOpenDialog(false)}
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

      {/* Skills Display */}
      {skillsList && skillsList.length > 0 ? (
        <Box sx={{ width: '100%', p: { xs: 1, sm: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {skillsList.map((skill, index) => (
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
                  
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <CardContent sx={{ p: 0, width: '100%' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.05rem', color: theme.palette.text }}>
                    {skill}
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

// New SkillsForm for single multiline input
function SkillsForm({ existingSkills, onAddSkills, handleCancel }) {
  // Combine existing skills into a single string (one per line)
  const initialSkillsText = (existingSkills && existingSkills.length > 0)
    ? existingSkills.join('\n')
    : '';

  return (
    <Formik
      initialValues={{ skills: initialSkillsText }}
      onSubmit={(values, { resetForm }) => {
        const lines = values.skills.split('\n').map(line => line.trim()).filter(Boolean);
        const newLines = lines.filter(line => !existingSkills.includes(line));
        if (newLines.length > 0 && onAddSkills) {
          onAddSkills(newLines);
        }
        resetForm();
      }}
    >
      {({ resetForm }) => (
        <Form>
          <Stack>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 0, sm: 2 },
              }}
            >
              <InputItem>
                <TextInput
                  name="skills"
                  label="Skills"
                  multiline
                  rows={4}
                  placeholder="Enter your skills (one per line)"
                />
              </InputItem>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: { xs: 'center', md: 'flex-end' },
                pb: 2,
                gap: 2,
              }}
            >
              <Button
                color="text.primary"
                type="reset"
                onClick={() => {
                  resetForm();
                  handleCancel && handleCancel();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
              >
                Submit
              </Button>
            </Box>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}

export default SkillsTab;
