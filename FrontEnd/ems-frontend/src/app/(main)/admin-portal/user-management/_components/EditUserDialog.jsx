'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';

import { Formik, Form } from 'formik';

import UserForm, { userEditValidationSchema } from './UserForm';

const roles = [
  { id: 1, name: 'Admin', label: 'Administrator' },
  { id: 2, name: 'Manager', label: 'Manager' },
  { id: 3, name: 'Employee', label: 'Employee' },
  { id: 4, name: 'HR', label: 'Human Resources' },
  { id: 5, name: 'Finance', label: 'Finance' },
  { id: 6, name: 'Supervisor', label: 'Supervisor' },
];

export default function EditUserDialog({ 
  editDialogOpen, 
  setOpenDialog, 
  editingUser, 
  setEditingUser, 
  handleSubmit
}) {
  const handleClose = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  const getInitialValues = () => {
    if (editingUser) {
      return {
        userId: editingUser.userId,
        username: editingUser.username,
        email: editingUser.email,
        password: '',
        roleId: roles.find((r) => r.name === editingUser.roleId?.name) || null,
        isActive: editingUser.isActive,
      };
    }
    return {};
  };

  return (
    <Dialog
      open={editDialogOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          Edit User
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Formik
          initialValues={getInitialValues()}
          validationSchema={userEditValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <UserForm isEdit={true}>
                <DialogActions sx={{ mt: 3 }}>
                  <Button color='textblack' onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    startIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                  >
                    {isSubmitting ? 'Updating...' : 'Update User'}
                  </Button>
                </DialogActions>
              </UserForm>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
