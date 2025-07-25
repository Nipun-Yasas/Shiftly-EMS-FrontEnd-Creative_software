"use client";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TimesheetForm from "../_components/FormWrapper";

export default function TimesheetSubmitPage() {

  return (
    <Paper
      elevation={3}
      square={false}
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <Box sx={{ width: "100%", px: 5 }}>
        <TimesheetDebug />
        <TimesheetForm/>
      </Box>

    </Paper>
  );
}
