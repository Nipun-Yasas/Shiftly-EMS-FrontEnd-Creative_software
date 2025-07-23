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

import TextInput from "../inputs/TextInput";
import PasswordInput from "../inputs/PasswordInput";
import FormItem from "../landing/FormItem";
import  {UserContext}  from "../../context/UserContext";
import axiosInstance from "../../_utils/axiosInstance";
import { API_PATHS } from "../../_utils/apiPaths";

export default function LoginForm(props) {
  const { openLogin, setOpenLogin, openSignUp } = props;
  const [error, setError] = useState(null);

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUser } = useContext(UserContext);

  const initialValues = {
    username: "",
    password: "",
    remember: false,
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
          const employeeResponse = await axiosInstance.get(API_PATHS.EMPLOYEE.GET_PROFILE);
          
          // If employee profile exists, redirect to dashboard
          if (employeeResponse.data) {
            router.push("/dashboard");
          }
        } catch (employeeError) {
          // If employee profile doesn't exist (404 or other error), redirect to profile creation
          if (employeeError.response && employeeError.response.status === 404) {
            router.push("/employee/profile");
          } else {
            // For other errors, still redirect to profile creation as fallback
            router.push("/employee/profile");
          }
        }
      } else {
        setError("Login failed: No token received");
      }
      
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setOpenLogin(false);
  };

  return (
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
                        fontSize: "0.875rem",
                        color: '#E90A4D',
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

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="contained"
                  sx={{
                    py: 1,
                    backgroundColor: '#E90A4D',
                    '&:hover': {
                      backgroundColor: '#D00940'
                    }
                  }}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>

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
  );
}
