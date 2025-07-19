import React from 'react';
import { Box } from '@mui/material';
import SearchField from '../../../../_components/main/SearchField';
import ReferDataGrid from './ReferDataGrid';

export default function UnReadTab({ 
  searchQuery, 
  onSearchChange, 
  filteredCandidates, 
  loading, 
  onViewDetails, 
  onMarkAsRead, 
  onMarkAsUnread 
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{mb:3}}>
        <SearchField
          placeholder="Search unread candidates..."
          value={searchQuery}
          onChange={onSearchChange}
          sx={{ minWidth: { xs: "auto", sm: 200 } }}
        />
      </Box>
      
      <ReferDataGrid
        rows={filteredCandidates.filter(c => c.status === 'unread')}
        loading={loading}
        onViewDetails={onViewDetails}
        onMarkAsRead={onMarkAsRead}
        onMarkAsUnread={onMarkAsUnread}
      />
    </Box>
  );
}
