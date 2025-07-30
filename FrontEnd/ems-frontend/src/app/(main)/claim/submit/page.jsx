"use client";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import ClaimForm from "../_components/ClaimForm";

export default function ClaimSubmission() {
  return (
    <Paper
      elevation={3}
      square={false}
      sx={{
        height: "100%",
        width: "100%",
      }}
    >
      <Box sx={{ width: "100%", p: 5 }}>
        <ClaimForm />
      </Box>
    </Paper>
  );
}
