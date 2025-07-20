"use client";

import { useState, useEffect } from "react";
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

import { useAuth } from "../../context/AuthContext";
import TextInput from "../inputs/TextInput";
import PasswordInput from "../inputs/PasswordInput";
import CustomCheckBox from "../inputs/CustomCheckBox";
import FormItem from "../landing/FormItem";

export default function LoginForm(props) {
  const { openLogin, setOpenLogin, openSignUp } = props;
  const [error, setError] = useState(null);
  const { signIn, user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsSubmitting(true);
      setError(null);
      
      const userData = await signIn(values.username, values.password);
      if (userData) {
        setOpenLogin(false);
        router.replace("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setError(null);
      setOpenLogin(false);
    }
  };

  return (
    <Dialog
      open={openLogin}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      disableEscapeKeyDown={isSubmitting}
    >
      <DialogContent>
        <IconButton
          onClick={handleClose}
          disabled={isSubmitting}
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

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting: formSubmitting }) => (
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
                  <CustomCheckBox 
                    name="remember" 
                    label="Remember Me" 
                    disabled={isSubmitting}
                  />

                  <Link href="/change-password">
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
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#D00940'
                    },
                    '&.Mui-disabled': {
                      backgroundColor: '#E90A4D',
                      opacity: 0.5
                    }
                  }}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>

                <Box sx={{ textAlign: "center" }}>
                  <Typography sx={{ fontSize: "0.875rem" }}>
                    Don't have an account?{" "}
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
