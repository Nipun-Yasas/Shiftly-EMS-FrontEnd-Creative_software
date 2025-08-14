"use client";

import React from "react";
import Box from "@mui/material/Box";

import EventDataGrid from "./EventDataGrid";

export default function ApprovedTab({ events, loading }) {
  return (
    <Box sx={{ p: 3, mb: 3 }}>
      <EventDataGrid events={events} loading={loading} />
    </Box>
  );
}
