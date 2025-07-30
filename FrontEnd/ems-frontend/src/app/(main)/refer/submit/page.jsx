"use client";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import ReferForm from "../_components/ReferForm";

export default function Refer() {
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
        <ReferForm />
      </Box>
    </Paper>
  );
}
