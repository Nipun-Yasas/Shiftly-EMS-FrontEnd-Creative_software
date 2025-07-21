"use client";

import { useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import TimesheetForm from "../_components/TimesheetForm";
import SubmitDialog from "../../../_components/dialog/SubmitDialog";

export default function TimesheetSubmitPage() {
  const [openSubmit, setOpenSubmit] = useState(false);

  return (
    <Paper
      elevation={3}
      square={false}
      sx={{
        justifyItems: "center",
        alignContent: "center",
        height: "100%",
        width: "100%"
      }}
    >
      <Box sx={{ width: "100%", px: 5 }}>
        <TimesheetForm setOpenSubmit={setOpenSubmit} />
      </Box>

      <SubmitDialog openSubmit={openSubmit} setOpenSubmit={setOpenSubmit} />
    </Paper>
  );
}

