"use client";

import { useState } from "react";

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
  const { signIn } = useAuth();
  const router = useRouter();

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
      await signIn(values.username, values.password);
      setError(null);
      setOpenLogin(false);
      router.push("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Login failed";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        fullWidth
        maxWidth="xs"
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
        aria-labelledby="login-dialog-title"
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
            onClick={() => setOpenLogin(false)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "grey.500",
              "&:hover": { color: "grey.900" },
            }}
            aria-label="Close login dialog"
          >
            <X size={24} />
          </IconButton>

          <Typography variant="h6" id="login-dialog-title">
            Log in
          </Typography>

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
                    <PasswordInput
                      name="password"
                      label="Password"
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
                    <CustomCheckBox name="remember" label="Remember Me" />

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
                    {isSubmitting ? "Logging in..." : "Login"}
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
                      Don't have an account?
                    </Typography>
                    <Button
                      variant="text"
                      color="info.main"
                      onClick={() => {
                        setOpenLogin(false);
                        openSignUp();
                      }}
                      className="hover:cursor-pointer"
                      aria-label="Open sign up dialog"
                    >
                      <Typography
                        color="info.main"
                        sx={{ fontSize: { xs: "0.875rem", sm: "0.9rem" } }}
                      >
                        Create account
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
