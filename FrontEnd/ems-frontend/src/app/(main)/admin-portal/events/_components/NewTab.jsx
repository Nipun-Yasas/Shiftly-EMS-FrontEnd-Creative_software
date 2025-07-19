"use client";

import React from "react";
import Box from "@mui/material/Box";
import SearchField from "../../_components/SearchField";
import EventDataGrid from "./EventDataGrid";

export default function NewTab({
  loading,
  events,
  searchQuery,
  onSearchChange,
  onViewDetails,
  onApprovalAction,
}) {
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 3 }}>
        <SearchField
          placeholder="Search events..."
          value={searchQuery}
          onChange={onSearchChange}
          sx={{ minWidth: 300 }}
        />
      </Box>

      <EventDataGrid
        loading={loading}
        events={events.filter((e) => e.status === "pending")}
        onViewDetails={onViewDetails}
        onApprovalAction={onApprovalAction}
        showApprovalActions={true}
      />
    </Box>
  );
}
