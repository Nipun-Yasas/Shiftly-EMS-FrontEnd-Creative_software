"use client";

import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import FilterListIcon from "@mui/icons-material/FilterList";

import SearchField from "../../../../_components/main/SearchField";
import LeavesDataGrid from "./LeavesDataGrid";

export default function AllTab({
  leaves,
  loading,
  searchQuery,
  handleSearchChange,
  filterStatus,
  setFilterStatus,
  onViewDetails,
  onApprovalAction,
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1, sm: 2 },
          alignItems: "center",
        }}
      >
        <Box>
          <SearchField
            placeholder="Search all leaves..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ minWidth: { xs: "auto", sm: 200 } }}
          />
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => {
              const nextFilter =
                filterStatus === "all"
                  ? "pending"
                  : filterStatus === "pending"
                    ? "approved"
                    : filterStatus === "approved"
                      ? "rejected"
                      : "all";
              setFilterStatus(nextFilter);
            }}
          >
            Filter:{" "}
            {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
          </Button>
        </Box>
      </Box>

      <LeavesDataGrid
        loading={loading}
        leaves={leaves}
        onViewDetails={onViewDetails}
        onApprovalAction={onApprovalAction}
      />
    </Box>
  );
}
