"use client";

import React from "react";
import Box from "@mui/material/Box";

import EventDataGrid from "./EventDataGrid";

export default function AllTab({
  loading,
  events,
  onViewDetails,
  onApprovalAction,
}) {
  return (
    <Box sx={{ p: 3, mb: 3 }}>
      <EventDataGrid
        loading={loading}
        events={events.filter((e) => e.status !== "pending")}
        onViewDetails={onViewDetails}
        onApprovalAction={onApprovalAction}
        showApprovalActions={false}
      />
    </Box>
  );
}
