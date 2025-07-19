"use client";

import { useState } from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ClaimForm from "./_components/ClaimForm";
import SubmitDialog from "../../../_components/dialog/SubmitDialog";

export default function ClaimSubmission() {
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
        {/* <Box sx={{ mt: 3 }}>
          <Typography variant="h5">Claim Form</Typography>
        </Box> */}

        <Box sx={{ width: "100%", maxWidth: 1000, mt: 3, px: 2 }}>
          <ClaimForm setOpenSubmit={setOpenSubmit} />
        </Box>
      </Paper>

      <SubmitDialog openSubmit={openSubmit} setOpenSubmit={setOpenSubmit} />
    </>
  );
}
