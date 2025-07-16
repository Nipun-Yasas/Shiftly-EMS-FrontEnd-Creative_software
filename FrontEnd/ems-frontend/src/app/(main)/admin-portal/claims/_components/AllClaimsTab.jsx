"use client";

import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FilterList from "@mui/icons-material/FilterList";

import SearchField from "../../_components/SearchField";
import ClaimsDataGrid from "./ClaimsDataGrid";

export default function AllClaimsTab({
  claims,
  loading,
  searchQuery,
  onSearchChange,
  filterStatus = "all",
  setFilterStatus,
  onViewClaim,
  onApprovalAction,
}) {
  const filteredClaims = claims.filter((claim) => {
    const matchesSearch =
      !searchQuery ||
      claim.employee_name
        ?.toLowerCase()
        .includes(String(searchQuery).toLowerCase()) ||
      claim.department
        ?.toLowerCase()
        .includes(String(searchQuery).toLowerCase()) ||
      claim.type?.toLowerCase().includes(String(searchQuery).toLowerCase()) ||
      claim.description
        ?.toLowerCase()
        .includes(String(searchQuery).toLowerCase());

    const matchesFilter =
      filterStatus === "all" || claim.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <SearchField
          placeholder="Search all claims..."
          value={searchQuery}
          onChange={onSearchChange}
          sx={{ minWidth: { xs: "auto", sm: 200 } }}
        />

        {setFilterStatus && (
          <Button
            variant="outlined"
            startIcon={<FilterList />}
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
        )}
      </Box>

      <ClaimsDataGrid
        claims={filteredClaims}
        loading={loading}
        onViewClaim={onViewClaim}
        onApprovalAction={onApprovalAction}
        showApprovalActions={true}
      />
    </Box>
  );
}
