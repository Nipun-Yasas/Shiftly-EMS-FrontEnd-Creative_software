"use client";

import { useState, useEffect, useContext } from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";

import { UserContext } from "../../../context/UserContext";
import TimesheetForm from "../_components/TimesheetForm";

export default function page() {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState("");

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchEmployee = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.EMPLOYEE.GET_BY_USERID(user.id)
      );
      setEmployee(response.data);
      console.log(employee);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        date: values.date,
        mode: values.workMode?.name || "",
        activity: values.activity,
        hours: values.hours,
      };
      const response = await axiosInstance.post(
        API_PATHS.TIMESHEETS.ADD(employee.employeeId),
        payload
      );
      showSnackbar("Timesheet submitted successfully", "success");
      resetForm();
    } catch (error) {
      showSnackbar("Failed to submit timesheet", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  useEffect(() => {
    fetchEmployee();
  }, []);

  return (
    <Paper
      elevation={3}
      square={false}
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            p: 5,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {employee ? (
            <Box sx={{ width: "100%", p: 2 }}>
              <TimesheetForm handleSubmit={handleSubmit} />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                p: 5,
              }}
            >
              <Typography variant="h5" color="error.main">
                You are not assigned for a department please ask a admin to
                assign you
              </Typography>
            </Box>
          )}
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
