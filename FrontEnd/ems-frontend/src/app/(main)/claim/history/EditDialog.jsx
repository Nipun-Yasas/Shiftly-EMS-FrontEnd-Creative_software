import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import ClaimForm from '../submit/_components/ClaimForm';
import axiosInstance from '../../../_utils/axiosInstance';
import { API_PATHS } from '../../../_utils/apiPaths';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export default function EditDialog({ open, onClose, claim, onUpdate }) {
  if (!claim) return null;

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axiosInstance.put(
        API_PATHS.CLAIMS.UPDATE_CLAIM(claim.id),
        {
          claimType: values.claimtype?.name || values.claimtype,
          description: values.description,
          claimDate: values.claimdate,
          status: values.status || claim.status,
        }
      );
      onUpdate && onUpdate(response.data);
      onClose();
    } catch (error) {
      // handle error (show snackbar, etc.)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}  fullWidth>
      <DialogTitle sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
          pb: 2,
        }} >Edit Claim
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton></DialogTitle>
      <DialogContent >
        <ClaimForm
          initialValues={{
            claimtype: claim.claimType,
            claimdate: claim.claimDate,
            description: claim.description,
            claimfile: null,
            status: claim.status,
          }}
          onSubmit={handleSubmit}
          isEditMode={true}
        />
      </DialogContent>
     
    </Dialog>
  );
} 