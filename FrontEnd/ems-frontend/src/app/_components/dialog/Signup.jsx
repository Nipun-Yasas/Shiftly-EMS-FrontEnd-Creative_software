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

import TextInput from "../inputs/TextInput";
import PasswordInput from "../inputs/PasswordInput";
import CustomCheckBox from "../inputs/CustomCheckBox";
import FormItem from "../landing/FormItem";

import axiosInstance from "../../_utils/axiosInstance";
import { API_PATHS } from "../../_utils/apiPaths";

export default function SignupForm(props) {
  const { openSignUp, setOpenSignUp,openLogin } = props;
  
  const [error, setError] = useState(null);

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
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
    terms: Yup.bool().oneOf([true], "You must accept the terms"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        username: values.username,
        email: values.email,
        password: values.password,
      });
      setError(null);
      setOpenSignUp(false);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Registration failed";
      setError(message);
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

          <Typography variant="h6" id="signup-dialog-title">Sign Up</Typography>

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
                    <TextInput name="username" label="Username" />
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
                    <CustomCheckBox
                      name="terms"
                      label="I accept the terms and conditions"
                    />

                    <Link href="/change-password">
                      <Typography
                        color="primary.main"
                        sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                      >
                        Forgot Password?
                      </Typography>
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                    sx={{
                      my: 2,
                      py: 1,
                      width: { xs: "100%", sm: "auto" },
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                    }}
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
                      color="textblack.main"
                      sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                    >
                      Already have an account?{" "}
                    </Typography>
                    <Button
                    variant="text"
                    color="info.main"
                      onClick={() => {setOpenSignUp(false);
                        openLogin();
                      }}
                      className="hover:cursor-pointer"
                    >
                      <Typography
                        color="info.main"
                        sx={{ fontSize: { xs: "0.875rem", sm: "0.9rem" } }}
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
    </>
  );
}
