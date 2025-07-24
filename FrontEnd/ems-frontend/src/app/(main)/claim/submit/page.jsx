"use client";

import { useState } from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import ClaimForm from "./_components/ClaimForm";
// Remove SubmitDialog import
// import SubmitDialog from "../../../_components/dialog/SubmitDialog";

export default function ClaimSubmission() {
  // Remove openSubmit state
  // const [openSubmit, setOpenSubmit] = useState(false);

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
        <Box sx={{ width: "100%", maxWidth: 1000, mt: 3, px: 2 }}>
          {/* Remove setOpenSubmit prop */}
          <ClaimForm />
        </Box>
      </Paper>
      {/* Remove SubmitDialog */}
      {/* <SubmitDialog openSubmit={openSubmit} setOpenSubmit={setOpenSubmit} /> */}
    </>
  );
}
