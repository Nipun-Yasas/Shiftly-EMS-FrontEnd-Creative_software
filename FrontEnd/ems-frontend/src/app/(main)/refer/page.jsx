"use client";

import { useState } from "react";

import { Paper, Box, Typography } from "@mui/material";

import ReferForm from "./_components/ReferForm";
import SubmitDialog from "../../_components/dialog/SubmitDialog";

export default function Refer() {
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
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5">Refer Candidates Form</Typography>
        </Box>

        <Box sx={{ width: "100%", maxWidth: 1000, mt: 3, px: 2 }}>
          <ReferForm setOpenSubmit={setOpenSubmit} />
        </Box>
        
      </Paper>

      <SubmitDialog openSubmit={openSubmit} setOpenSubmit={setOpenSubmit} />
    </>
  );
}
