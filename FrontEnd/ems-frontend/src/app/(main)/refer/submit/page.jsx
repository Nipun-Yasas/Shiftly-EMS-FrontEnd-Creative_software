"use client";

import { useState } from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ReferForm from "../_components/ReferForm";
import SubmitDialog from "../../../_components/dialog/SubmitDialog";

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
       
        <Box sx={{ width: "100%", maxWidth: 1000, px: 3 }}>
          <ReferForm setOpenSubmit={setOpenSubmit} />
        </Box>
        
      </Paper>

      <SubmitDialog openSubmit={openSubmit} setOpenSubmit={setOpenSubmit} />
    </>
  );
}
