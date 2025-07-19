import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { 
  Box, 
  Chip, 
  IconButton, 
  Tooltip 
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UnreadIcon
} from '@mui/icons-material';
import dayjs from 'dayjs';

export default function ReferDataGrid({ 
  rows, 
  loading, 
  onViewDetails, 
  onMarkAsRead, 
  onMarkAsUnread 
}) {
  const candidateColumns = [
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      renderCell: (params) => (
        <Chip
          icon={params.value === 'read' ? <CheckCircleIcon /> : <UnreadIcon />}
          label={params.value}
          color={params.value === 'read' ? 'success' : 'warning'}
          size="small"
        />
      )
    },
    { field: 'firstName', headerName: 'First Name', width: 130 },
    { field: 'lastName', headerName: 'Last Name', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'position', headerName: 'Position', width: 150 },
    { field: 'department', headerName: 'Department', width: 130 },
    {
      field: 'submissionDate',
      headerName: 'Submitted',
      width: 120,
      renderCell: (params) => dayjs(params.value).format('MMM DD, YYYY')
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      headerClassName: 'last-column',
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, mt: 1, width: '100%', justifyContent: 'center' }}>
          <Tooltip title="View Details">
            <IconButton 
              size="small" 
              onClick={() => onViewDetails(params.row)}
              color="primary"
            >
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.status === 'read' ? 'Mark as Unread' : 'Mark as Read'}>
            <IconButton 
              size="small" 
              onClick={() => 
                params.row.status === 'read' 
                  ? onMarkAsUnread(params.row.id)
                  : onMarkAsRead(params.row.id)
              }
              color={params.row.status === 'read' ? 'warning' : 'success'}
            >
              {params.row.status === 'read' ? <VisibilityOffIcon /> : <CheckCircleIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  return (
    <DataGrid
      rows={rows}
      columns={candidateColumns}
      pageSize={10}
      rowsPerPageOptions={[5, 10, 20]}
      loading={loading}
      disableSelectionOnClick
    />
  );
}
