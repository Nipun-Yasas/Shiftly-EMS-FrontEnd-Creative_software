"use client";

import React from "react";
import Box from "@mui/material/Box";

import SearchField from "../../_components/SearchField";
import LetterDataGrid from "./LetterDataGrid";

export default function ReadTab({
  letters,
  loading,
  searchQuery,
  handleSearchChange,
  onViewDetails,
  onMarkAsUnread,
  onGenerateLetter,
  onDownloadLetter,
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <SearchField
          placeholder="Search read letters..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{ minWidth: 300 }}
        />
      </Box>

      <LetterDataGrid
        loading={loading}
        letters={letters}
        onViewDetails={onViewDetails}
        onMarkAsRead={() => {}}
        onMarkAsUnread={onMarkAsUnread}
        onGenerateLetter={onGenerateLetter}
        onDownloadLetter={onDownloadLetter}
        statusFilter="read"
      />
    </Box>
  );
}
