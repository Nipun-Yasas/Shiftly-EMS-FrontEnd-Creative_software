"use client";

import React from "react";
import Box from "@mui/material/Box";
import SearchField from "../../_components/SearchField";
import EventDataGrid from "./EventDataGrid";

export default function NewEventsTab({
  loading,
  events,
  searchQuery,
  onSearchChange,
  onViewDetails,
  onApprovalAction,
}) {
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: "flex", gap: 2, alignItems: "center" }}>
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
