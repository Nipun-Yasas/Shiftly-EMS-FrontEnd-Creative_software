"use client";

import { useState } from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";


import EventForm from "../_components/EventForm";

export default function page() {

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
          <EventForm />
        </Box>
      
      </Paper>

  );
}
