import React from 'react';
import { Box, Button } from '@mui/material';
import { FilterList as FilterIcon } from '@mui/icons-material';
import SearchField from '../../../../_components/main/SearchField';
import ReferDataGrid from './ReferDataGrid';

export default function AllTab({ 
  searchQuery, 
  onSearchChange, 
  filteredCandidates, 
  loading, 
  onViewDetails, 
  onMarkAsRead, 
  onMarkAsUnread,
  filterStatus,
  onFilterChange
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
        <SearchField
          placeholder="Search candidates..."
          value={searchQuery}
          onChange={onSearchChange}
          sx={{ minWidth: { xs: "auto", sm: 200 } }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={onFilterChange}
        >
          {filterStatus === 'all' ? 'Show All' : 'Show Unread Only'}
        </Button>
      </Box>
      
      <ReferDataGrid
        rows={filteredCandidates}
        loading={loading}
        onViewDetails={onViewDetails}
        onMarkAsRead={onMarkAsRead}
        onMarkAsUnread={onMarkAsUnread}
      />
    </Box>
  );
}
