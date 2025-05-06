"use client";

import { useState } from "react";

import { Paper, Box, Typography } from "@mui/material";

import EventForm from "../_components/EventForm";
import SubmitDialog from "../../../_components/dialog/SubmitDialog";

export default function page() {
  const [openSubmit, setOpenSubmit] = useState(false);

  return (
    <>
      <Paper
        elevation={3}
        square={false}
        sx={{
          justifyItems: "center",
          alignContent: "center",
          height: "100%",
          width: "100%",
        }}
      >
        <Box sx={{ mt: 2 }}>
          <Typography variant="h5">Add Event Form</Typography>
        </Box>

        <Box sx={{ width: "100%", maxWidth: 1000, px: 2 }}>
          <EventForm setOpenSubmit={setOpenSubmit} />
        </Box>
      </Paper>

      <SubmitDialog openSubmit={openSubmit} setOpenSubmit={setOpenSubmit} />
    </>
  );
}
