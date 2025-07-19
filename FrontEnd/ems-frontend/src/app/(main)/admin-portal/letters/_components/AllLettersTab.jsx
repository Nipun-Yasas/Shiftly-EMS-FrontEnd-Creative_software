"use client";

import React from "react";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import SearchField from "../../../../_components/main/SearchField";
import LetterDataGrid from "./LetterDataGrid";

export default function AllLettersTab({
  letters,
  loading,
  searchQuery,
  handleSearchChange,
  letterTypes,
  filterStatus,
  setFilterStatus,
  filterType,
  setFilterType,
  onViewDetails,
  onMarkAsRead,
  onMarkAsUnread,
  onGenerateLetter,
  onDownloadLetter,
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          gap: 2,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <SearchField
          placeholder="Search letters..."
          value={searchQuery}
          onChange={handleSearchChange}
            sx={{ minWidth: { xs: "auto", sm: 200 } }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={filterStatus}
            label="Filter by Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="unread">Unread</MenuItem>
            <MenuItem value="read">Read</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select
            value={filterType}
            label="Filter by Type"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            {letterTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <LetterDataGrid
        loading={loading}
        letters={letters}
        onViewDetails={onViewDetails}
        onMarkAsRead={onMarkAsRead}
        onMarkAsUnread={onMarkAsUnread}
        onGenerateLetter={onGenerateLetter}
        onDownloadLetter={onDownloadLetter}
        showStatusColumn={true}
        statusFilter="all"
      />
    </Box>
  );
}
