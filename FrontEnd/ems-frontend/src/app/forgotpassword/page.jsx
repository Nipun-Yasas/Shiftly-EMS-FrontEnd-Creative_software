'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import LockResetIcon from '@mui/icons-material/LockReset';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import PasswordInput from '../_components/inputs/PasswordInput';
import InputItem from '../_components/inputs/InputItem';

const validationSchema = Yup.object({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'New password must be at least 8 characters long')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your new password'),
});

export default function ChangePasswordPage() {
  const theme = useTheme();
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleBack = () => {
    router.push('/');
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setError('');
    setSuccess('');

    try {
      // TODO: Add actual API call here
      // await changePassword({ 
      //   currentPassword: values.currentPassword, 
      //   newPassword: values.newPassword 
      // });
      
      setSuccess("Password changed successfully!");
      resetForm();
    } catch (err) {
      setError("Failed to change password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: "url('/images/bgforgot.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
        },
      }}
    >
      <IconButton
        onClick={handleBack}
        sx={{
          position: 'absolute',
            top: 20,
            left: 20,
            zIndex: 3,
            backgroundColor: '#E90A4D',
                    '&:hover': {
                      backgroundColor: '#D00940'
                    }
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Paper
        elevation={24}
        sx={{
          position: 'relative',
          zIndex: 2,
          p: 4,
          borderRadius: 3,
          width: '100%',
          maxWidth: 450,
          mx: 2,
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <LockResetIcon
            sx={{ 
              fontSize: 60, 
              color: '#E90A4D',
              mb: 2 
            }}
          />
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ 
              fontWeight: 'bold',
            
              color: '#E90A4D'
            }}
          >
            Change Password
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
          >
            Enter your current password and choose a new secure password
          </Typography>
        </Box>

        <Formik
          initialValues={{
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Stack spacing={3}>
                <InputItem>
                  <PasswordInput
                    name="currentPassword"
                    label="Current Password"
                    type="password"
                    disabled={isSubmitting}
                  />
                </InputItem>

                <InputItem>
                  <PasswordInput
                    name="newPassword"
                    label="New Password"
                    type="password"
                    disabled={isSubmitting}
                  />
                </InputItem>

                <InputItem>
                  <PasswordInput
                    name="confirmPassword"
                    label="Confirm New Password"
                    type="password"
                    disabled={isSubmitting}
                  />
                </InputItem>

                {error && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    {success}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  fullWidth
                  startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    backgroundColor: '#E90A4D',
                    '&:hover': {
                      backgroundColor: '#D00940'
                    }
                  }}
                >
                  {isSubmitting ? 'Changing Password...' : 'Change Password'}
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
}
