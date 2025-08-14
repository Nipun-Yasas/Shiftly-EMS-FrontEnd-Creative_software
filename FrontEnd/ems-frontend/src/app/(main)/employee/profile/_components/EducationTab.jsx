'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Formik, Form} from 'formik';
import Button from '@mui/material/Button';
import TextInput from '@/app/_components/inputs/TextInput';
import InputItem from '@/app/_components/inputs/InputItem';

const EducationTab = ({ employee }) => {
  const theme = useTheme();

  const [educationList, setEducationList] = useState(Array.isArray(employee?.education) ? employee.education : (employee?.education ? [employee.education] : []));
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Keep state in sync if employee changes
  useEffect(() => {
    setEducationList(Array.isArray(employee?.education) ? employee.education : (employee?.education ? [employee.education] : []));
  }, [employee]);

  // Add new education(s)
  const handleAddEducation = (newEducation) => {
    setEducationList((prev) => [...prev, ...newEducation]);
    setOpenDialog(false);
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '60vh', p: { xs: 2, sm: 4 } }}>
      

      {/* Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="education-form-dialog-title"
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3, p: 1 } }}
      >
        <DialogTitle id="education-form-dialog-title" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          Add Education
        </DialogTitle>
        <DialogContent>
          <EducationForm
            existingEducations={educationList}
            onAddEducation={handleAddEducation}
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

      {/* Education Display */}
      {educationList && educationList.length > 0 ? (
        <Box sx={{ width: '100%', p: { xs: 1, sm: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {educationList.map((education, index) => (
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
                    {education}
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

// New EducationForm for single multiline input
function EducationForm({ existingEducations, onAddEducation, handleCancel }) {
  // Combine existing educations into a single string (one per line)
  const initialEducationText = (existingEducations && existingEducations.length > 0)
    ? existingEducations.join('\n')
    : '';

  return (
    <Formik
      initialValues={{ education: initialEducationText }}
      onSubmit={(values, { resetForm }) => {
        const lines = values.education.split('\n').map(line => line.trim()).filter(Boolean);
        const newLines = lines.filter(line => !existingEducations.includes(line));
        if (newLines.length > 0 && onAddEducation) {
          onAddEducation(newLines);
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
                  name="education"
                  label="Education"
                  multiline
                  rows={4}
                  placeholder="Enter your education (one per line)"
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

export default EducationTab;
