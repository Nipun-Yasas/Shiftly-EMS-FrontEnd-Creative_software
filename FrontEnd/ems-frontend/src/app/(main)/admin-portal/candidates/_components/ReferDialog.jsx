import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  Box
} from '@mui/material';

export default function ReferDialog({ 
  open, 
  onClose, 
  selectedCandidate, 
  actionType, 
  onConfirm 
}) {
  const isApprove = actionType === 'approve';
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {isApprove ? 'Approve Candidate' : 'Reject Candidate'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to {isApprove ? 'approve' : 'reject'} this candidate?
          </Typography>
          
          {selectedCandidate && (
            <Alert severity={isApprove ? 'success' : 'warning'}>
              <Typography>
                <strong>Candidate:</strong> {selectedCandidate.firstName} {selectedCandidate.lastName}
              </Typography>
              <Typography>
                <strong>Position:</strong> {selectedCandidate.position}
              </Typography>
              <Typography>
                <strong>Department:</strong> {selectedCandidate.department}
              </Typography>
            </Alert>
          )}
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          {isApprove 
            ? 'This action will mark the candidate as approved and notify them via email.'
            : 'This action will mark the candidate as rejected and notify them via email.'
          }
        </Typography>
      </DialogContent>
      <DialogActions>
        <Box
                  sx={{
                    justifyContent: { xs: "center", md: "flex-end" },
                    display: "flex",
                    gap: 1,
                    width: "100%",
                  }}
                >
                    <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={isApprove ? 'success' : 'error'}
        >
          {isApprove ? 'Approve' : 'Reject'}
        </Button>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
                </Box>
        
        
      </DialogActions>
    </Dialog>
  );
}
