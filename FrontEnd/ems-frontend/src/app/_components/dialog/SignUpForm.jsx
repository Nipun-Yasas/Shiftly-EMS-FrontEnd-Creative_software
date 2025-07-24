"use client";

import { useState } from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";
import { X } from "lucide-react";
import Link from "next/link";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import TextInput from "../inputs/TextInput";
import PasswordInput from "../inputs/PasswordInput";
import FormItem from "../landing/FormItem";

import axiosInstance from "../../_utils/axiosInstance";
import { API_PATHS } from "../../_utils/apiPaths";

export default function SignUpForm(props) {
  const { openSignUp, setOpenSignUp, openLogin } = props;
  
  const [error, setError] = useState(null);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Min 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm your password"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(null);
    
    try {
      
      const payload = {
        username: values.username,
        email: values.email,
        password: values.password
      };
      
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, payload);
      // Close signup dialog, show success message, and open login dialog
      setOpenSignUp(false);
      setShowSuccessSnackbar(true);
      // Open login dialog after a short delay to allow snackbar to show
      setTimeout(() => {
        openLogin();
      }, 500);
      
    } catch (error) {
      // Only log unexpected errors, not 409 conflicts (username/email exists)
      if (error.response?.status !== 409) {
        console.error("Signup error:", error);
      }
      
      if (error.response && error.response.status === 409) {
        // Handle username/email already exists (409 Conflict)
        const errorMessage = error.response.data?.message || "Username or email already exists. Please try with different credentials.";
        setError(errorMessage);
      } else if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        open={openSignUp}
        onClose={() => setOpenSignUp(false)}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "300px",
              borderRadius: 2,
            },
          },
          backdrop: {
            sx: {
              backgroundColor: "rgba(107, 114, 128, 0.75)",
            },
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
            p: { xs: 2, sm: 3 },
            textAlign: "center",
            maxWidth: "100%",
          }}
        >
          <IconButton
            onClick={() => setOpenSignUp(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "grey.500",
              "&:hover": { color: "grey.900" },
            }}
          >
            <X size={24} />
          </IconButton>

        {error && (
          <Typography color="error.main" sx={{ fontSize: "0.875rem" }}>
            {error}
          </Typography>
        )}

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Stack spacing={{ xs: 1, sm: 2 }} alignItems="center">
                  <FormItem>
                    <TextInput name="username" label="Username"  />
                  </FormItem>
                  <FormItem>
                    <TextInput name="email" label="Email" />
                  </FormItem>

                  <FormItem>
                    <PasswordInput
                      name="password"
                      label="Password"
                      type="password"
                    />
                  </FormItem>
                  <FormItem>
                    <PasswordInput
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                    />
                  </FormItem>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 1,
                    }}
                  >
                   

                    <Link href="/change-password">
                      <Typography
                        sx={{ fontSize: { xs: "0.875rem", sm: "1rem",color: '#E90A4D'} }}
                      >
                        Forgot Password?
                      </Typography>
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                    
                  >
                    {isSubmitting ? "Signing up..." : "Sign Up"}
                  </Button>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Typography
                      sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                    >
                      Already have an account?{" "}
                    </Typography>
                    <Button
                    variant="text"
                      onClick={() => {setOpenSignUp(false);
                        openLogin();
                      }}
                      className="hover:cursor-pointer"
                    >
                      <Typography
                        sx={{
                        fontSize: "0.875rem",
                        color: '#E90A4D',
                        opacity: isSubmitting ? 0.5 : 1,
                        textTransform: 'none'
                      }}
                      >
                        Sign Up
                      </Typography>
                    </Button>
                  </Box>
                </Stack>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSuccessSnackbar(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          Account created successfully! Please wait for admin verification before logging in.
        </Alert>
      </Snackbar>
    </>
  );
}
