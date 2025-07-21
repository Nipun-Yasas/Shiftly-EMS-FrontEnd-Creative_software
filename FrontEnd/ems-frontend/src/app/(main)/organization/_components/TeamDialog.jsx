import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Card } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DataGrid } from '@mui/x-data-grid';
import Avatar from '@mui/material/Avatar';

const TeamDialog = ({ open, onClose, team }) => {
  // Prepare rows and columns for DataGrid
  const rows = (team?.team || []).map((member, idx) => ({
    id: idx,
    name: member.name,
    role: member.role,
    photo: '', // Placeholder, can be replaced with member.photo if available
  }));

  const columns = [
    {
      field: 'photo',
      headerName: 'Photo',
      width: 80,
      sortable: false,
      renderCell: () => (
        <Avatar sx={{ width: 40, height: 40, boxShadow: 2, border: '2px solid #E90A4D' }} />
      ),
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'datagrid-header',
      cellClassName: 'datagrid-photo-cell', // Add this
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'datagrid-header',
      cellClassName: 'datagrid-cell',
    },
    {
      field: 'role',
      headerName: 'Role',
      flex: 1,
      minWidth: 120,
      headerAlign: 'center',
      align: 'center',
      headerClassName: 'datagrid-header',
      cellClassName: 'datagrid-cell',
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 2,color: '#E90A4D' }}>
        {team?.name} Department
        <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent>
        
          <div style={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
              disableRowSelectionOnClick
              sx={{
                border: '1.5px solid #E90A4D',
                borderRadius: 3, 
                boxShadow: 8, 

                '& .datagrid-header': {
                  
                  
                  fontWeight: 700,
                  fontSize: 16,
                },
                '& .datagrid-cell': {
                  fontWeight: 500,
                  fontSize: 15,
                },
                '& .datagrid-photo-cell': {
                  paddingTop: '5px',
                },
                '& .MuiDataGrid-cell, & .MuiDataGrid-columnHeader': {
                  outline: 'none !important',
                },
              }}
            />
          </div>
        
      </DialogContent>
    </Dialog>
  );
};

export default TeamDialog; 