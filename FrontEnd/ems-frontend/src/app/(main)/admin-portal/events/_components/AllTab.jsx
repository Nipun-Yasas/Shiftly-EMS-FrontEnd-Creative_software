"use client";

import React from "react";
import Box from "@mui/material/Box";
import SearchField from "../../_components/SearchField";
import EventDataGrid from "./EventDataGrid";

export default function AllTab({
  loading,
  events,
  searchQuery,
  onSearchChange,
  onViewDetails,
  onApprovalAction,
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <SearchField
          placeholder="Search event history..."
          value={searchQuery}
          onChange={onSearchChange}
          sx={{ minWidth: 300 }}
        />
      </Box>

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
