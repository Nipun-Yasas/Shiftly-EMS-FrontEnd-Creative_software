"use client";

import { useState,useContext } from "react";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Formik, Form } from "formik";
import * as Yup from "yup";

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
import  {UserContext}  from "../../context/UserContext";
import axiosInstance from "../../_utils/axiosInstance";
import { API_PATHS } from "../../_utils/apiPaths";

export default function LoginForm(props) {
  const { openLogin, setOpenLogin, openSignUp } = props;
  const [error, setError] = useState(null);
  const [showUnverifiedSnackbar, setShowUnverifiedSnackbar] = useState(false);

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUser } = useContext(UserContext);

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        username: values.username,
        password: values.password,
      });

      const { jwttoken, userDTO } = response.data;

      if (jwttoken) {
        localStorage.setItem("token", jwttoken);
        updateUser(userDTO);
        setOpenLogin(false); 
        
        // Check if user has employee profile
        try {
          const employeeResponse = await axiosInstance.get(
            `/api/v1/shiftly/ems/employee/user/${userDTO.id}`
          );
          
          // If employee profile exists, redirect to dashboard
          if (employeeResponse.data) {
            router.push("/dashboard");
          }
        } catch (employeeError) {
          // If employee profile doesn't exist (404), redirect to employee update
          if (employeeError.response?.status === 404) {
            router.push("/employee/update");
          } else {
            // For other errors, still redirect to dashboard (fallback)
            router.push("/dashboard");
          }
        }
      } else {
        setError("Login failed: No token received");
      }
      
    } catch (error) {
      // Handle network errors first
      if (error.isNetworkError || error.message === 'Network Error' || !error.response) {
        setError("Server is restarting. Please try again later.");
        setSubmitting(false);
        return;
      }

      // Only log unexpected errors, not known issues like unverified users (403)
      const isUnverifiedUser = error.response && error.response.status === 403;
      const is500Error = error.response && error.response.status === 500;
      
      if (!isUnverifiedUser && !is500Error) {
        console.error('Login error:', error);
        console.log('Error response:', error.response?.data);
      }
      
      // Handle different error scenarios
      if (error.response && error.response.status === 403) {
        // For 403 errors, it's an unverified user (don't log as this is expected)
        setShowUnverifiedSnackbar(true);
        setOpenLogin(false);
      } else if (error.response && error.response.status === 500) {
        // Keep 500 handling for backward compatibility
        setShowUnverifiedSnackbar(true);
        setOpenLogin(false);
      } else if (error.response && error.response.status === 401) {
        setError("Invalid username or password.");
      } else if (error.response && error.response.status === 400) {
        setError("Invalid request. Please check your credentials.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setOpenLogin(false);
  };

  return (
    <>
      <Dialog
        open={openLogin}
        onClose={(event, reason) => {
          // Only close if not submitting and not caused by escape key when disabled
          if (reason !== 'escapeKeyDown') {
            setError(null);
            setOpenLogin(false);
          }
        }}
        fullWidth
        maxWidth="xs"
      >
      <DialogContent>
        <IconButton
          onClick={handleClose}
          disabled={isSubmitting}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
          }}
        >
          <X size={24} />
        </IconButton>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Stack spacing={2}>
                <FormItem>
                  <TextInput 
                    name="username" 
                    label="Username" 
                    disabled={isSubmitting}
                  />
                </FormItem>

                <FormItem>
                  <PasswordInput
                    name="password"
                    label="Password"
                    type="password"
                    disabled={isSubmitting}
                  />
                </FormItem>

                {/* Demo Credentials */}
                <Box
                  sx={{
                    backgroundColor: '#f5f5f5',
                    padding: 1.5,
                    borderRadius: 1,
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: '#666',
                      textAlign: 'center'
                    }}
                  >
                    Demo: Username: <strong>superadmin</strong> | Password: <strong>admin1234</strong>
                  </Typography>
                </Box>

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

                  <Link href="/forgotpassword">
                    <Typography
                      sx={{ 
                        color: 'primary.main',
                        fontSize: "0.875rem",
                        opacity: isSubmitting ? 0.5 : 1,
                        pointerEvents: isSubmitting ? 'none' : 'auto'
                      }}
                    >
                      Forgot Password?
                    </Typography>
                  </Link>
                </Box>

                {error && (
                  <Typography
                    color="error"
                    sx={{ fontSize: "0.875rem", textAlign: "center" }}
                  >
                    {error}
                  </Typography>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 1,
                  }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                </Box>
                

                <Box sx={{ textAlign: "center" }}>
                  <Typography sx={{ fontSize: "0.875rem" }}>
                    Don't have an account?
                    <Button
                      variant="text"
                      onClick={() => {
                        handleClose();
                        openSignUp();
                      }}
                      disabled={isSubmitting}
                      sx={{
                        fontSize: "0.875rem",
                        color: '#E90A4D',
                        opacity: isSubmitting ? 0.5 : 1,
                        textTransform: 'none'
                      }}
                    >
                      Create account
                    </Button>
                  </Typography>
                </Box>
              </Stack>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>

    {/* Unverified User Snackbar */}
    <Snackbar
      open={showUnverifiedSnackbar}
      autoHideDuration={6000}
      onClose={() => setShowUnverifiedSnackbar(false)}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert 
        onClose={() => setShowUnverifiedSnackbar(false)} 
        severity="warning"
        sx={{ width: '100%' }}
      >
        Your account is not verified yet. Please wait for admin verification before logging in.
      </Alert>
    </Snackbar>
    </>
  );
}
