'use client';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const LetterRequestModal = ({ letterType, onClose, open }) => {
  const theme = useTheme();

  const letterTypes = [
    "EPF/ETF Name Change Letter",
    "Letter for Skill Assessment",
    "Salary Undertaking Letter",
    "Salary Confirmation Letter",
    "Employment Confirmation Letter",
  ];


  const [selectedLetterType, setSelectedLetterType] = useState(letterType || '');

  // Update selected letter type when modal opens or when letterType changes
  useEffect(() => {
    if (letterType) {
      setSelectedLetterType(letterType);
    }
  }, [letterType]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: theme.palette.background.default,
          border: theme.palette.divider,
          p: 3,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <DialogTitle
          sx={{
            fontWeight: 'bold',
            fontSize: '1.25rem',
            color: theme.palette.primary.main,
            pr: 5,
          }}
        >
          {letterType}
        </DialogTitle>

        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: theme.palette.text.secondary,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Letter Type"
          select
          fullWidth
          value={selectedLetterType}
          onChange={(e) => setSelectedLetterType(e.target.value)}
          variant="outlined"
          InputLabelProps={{ style: { color: theme.palette.text.primary } }}
          InputProps={{
            style: {
              color: theme.palette.text.primary,
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.divider, // Default border
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main, // Hover border
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main, // Focus border
              },
            },
        }}
          
        >
              {letterTypes.map((type, index) => (
                <MenuItem key={index} value={type}>
                  {type}
                </MenuItem>
              ))}
      </TextField>


        <TextField
          label="Recipient Name"
          fullWidth
          placeholder="Enter your full name"
          variant="outlined"
          InputLabelProps={{ style: { color: theme.palette.text.primary } }}
          InputProps={{
            style: {
              color: theme.palette.text.primary,
            },
          }}

          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.divider, // Default border
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main, // Hover border
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main, // Focus border
              },
            },
        }}
        />

        <TextField
          label="Additional Details"
          placeholder="Your reason..."
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          InputLabelProps={{ style: { color: theme.palette.text.primary } }}
          InputProps={{
            style: {
              color: theme.palette.text.primary,
            },
          }}

          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.divider, // Default border
              },
              '&:hover fieldset': {
                borderColor: theme.palette.primary.main, // Hover border
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main, // Focus border
              },
            },
        }}
        />
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'flex-end' }}>
        <Button onClick={onClose} sx={{ color: theme.palette.primary.main }}>
          RESET
        </Button>
        <Button variant="contained" color="primary">
          GENERATE
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LetterRequestModal;
