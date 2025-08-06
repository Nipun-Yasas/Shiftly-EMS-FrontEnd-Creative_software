"use client";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import EventForm from "../_components/EventForm";

export default function page() {

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
        <EventForm redirectToHistory={true} />
      </Box>
    </Paper>
  );
}
