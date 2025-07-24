"use client";

import { useState, useEffect, useContext } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import dayjs from "dayjs";
import WeeklyTimeEntries from "./WeeklyTimeEntries";
import DailyTimeEntry from "./DailyTimeEntry";
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { UserContext } from "../../../context/UserContext";

export default function UpdateTimesheet() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  // Remove activeTab, dailyEntries, totalHours, and weekly logic
  const { user } = useContext(UserContext);

  // Daily entry for single day
  const [dailyEntry, setDailyEntry] = useState({
    workMode: "",
    activity: "",
    hours: ""
  });
  const [dailyOvertime, setDailyOvertime] = useState(0);

  // Calculate daily overtime
  useEffect(() => {
    const numHours = parseFloat(dailyEntry.hours) || 0;
    if (numHours > 8) {
      setDailyOvertime((numHours - 8).toFixed(2));
    } else {
      setDailyOvertime(0);
    }
  }, [dailyEntry.hours]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Build DTO for backend
      const dto = {
        userId: user?.id,
        date: selectedDate.format("YYYY-MM-DD"),
        mode: dailyEntry.workMode,
        activity: dailyEntry.activity,
        hours: parseFloat(dailyEntry.hours)
      };
      await axiosInstance.post(API_PATHS.TIMESHEETS.ADD, dto);
      setMessage({ text: "Timesheet submitted successfully!", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
      setDailyEntry({ workMode: "", activity: "", hours: "" });
    } catch (error) {
      console.error("Error submitting timesheet:", error);
      setMessage({ text: "Error submitting timesheet. Please try again.", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 3000);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setDailyEntry({ workMode: "", activity: "", hours: "" });
    setMessage({ text: "Form reset successfully", type: "success" });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}
      {/* Only Daily Time Entry Form */}
      <DailyTimeEntry
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        dailyEntry={dailyEntry}
        setDailyEntry={setDailyEntry}
        dailyOvertime={dailyOvertime}
        message={message}
        setMessage={setMessage}
        loading={loading}
      />
      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: { xs: 'center', md: 'flex-end' },
          pb: 2,
          gap: 2,
        }}
      >
        <Button
          color="text.primary"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </Box>
      <Snackbar
        open={!!message.text}
        autoHideDuration={3000}
        onClose={() => setMessage({ text: "", type: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          onClose={() => setMessage({ text: "", type: "" })} 
          severity={message.type}
          sx={{ width: '100%' }}
        >
          {message.text}
        </Alert>
      </Snackbar>
    </Paper>
  );
} 