'use client';

import React, { useEffect, useState } from 'react';
import { Formik, Form } from "formik";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Stack,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import InputItem from "../../../_components/inputs/InputItem";
import TextInput from "../../../_components/inputs/TextInput";
import SelectInput from "../../../_components/inputs/SelectInput";
import theme from '@/theme';

const LetterRequestModal = ({ letterType, onClose, open }) => {
  const theme = useTheme();

  const letterTypes = [
    { id: 1, name: "EPF/ETF Name Change Letter" },
    { id: 2, name: "Letter for Skill Assessment" },
    { id: 3, name: "Salary Undertaking Letter" },
    { id: 4, name: "Salary Confirmation Letter" },
    { id: 5, name: "Employment Confirmation Letter" },
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
          backgroundColor: theme.palette.background,
          border: `1px solid ${theme.palette.divider}`,
          p: 3,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <DialogTitle
          sx={{
            fontWeight: 'bold',
            fontSize: '1.25rem',
            color: theme.palette.text.primary,
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

      <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Formik
          initialValues={{
            letterType: letterTypes.find(type => type.name === selectedLetterType) || null,
            recipientName: "",
            additionalDetails: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.letterType) {
              errors.letterType = "Letter type is required";
            }
            if (!values.recipientName) {
              errors.recipientName = "Recipient name is required";
            }
            if (!values.additionalDetails) {
              errors.additionalDetails = "Additional details are required";
            }
            return errors;
          }}
          onSubmit={(values, { resetForm }) => {
            // Handle form submission here
            resetForm();
          }}
        >
          {({ validateForm, resetForm }) => (
            <Form>
              <Stack>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 0, sm: 2 },
                  }}
                >
                  <InputItem>
                    <SelectInput
                      name="letterType"
                      label="Letter Type"
                      options={letterTypes}
                      getOptionLabel={(option) => option.name || ""}
                    />
                  </InputItem>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 0, sm: 2 },
                  }}
                >
                  <InputItem>
                    <TextInput 
                      name="recipientName" 
                      label="Recipient Name"
                      placeholder="Enter your full name"
                    />
                  </InputItem>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 0, sm: 2 },
                  }}
                >
                  <InputItem>
                    <TextInput 
                      name="additionalDetails" 
                      label="Additional Details"
                      placeholder="Your reason..."
                      multiline
                      rows={4}
                    />
                  </InputItem>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-end" },
                    pb: 2,
                    gap: 2,
                    mt: 2,
                  }}
                >
                  <Button
                   color='text.primary'
                    type="reset"
                    onClick={() => {
                      resetForm();
                      onClose();
                    }}
                  >
                    RESET
                  </Button>


                  <Button
                    sx={{
                      color:'white'
                    }}
                    type="submit"
                    variant="contained"
                    onClick={() => {
                      validateForm();
                    }}
                  >
                    GENERATE
                  </Button>

                  
                </Box>
              </Stack>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default LetterRequestModal;