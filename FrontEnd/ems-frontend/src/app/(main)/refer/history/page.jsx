"use client";

import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditReferDialog from "../_components/EditReferDialog";
import DeleteConfirmDialog from "../_components/DeleteConfirmDialog";

const initialRows = [
  {
    id: 1,
    vacancy: "Software Engineer",
    applicant_name: "John Doe",
    applicant_email: "john.doe@example.com",
    message: "Experienced developer with 5+ years in React and Node.js",
    resume_file_path: "john_doe_resume.pdf",
    status: "Pending"
  },
  {
    id: 2,
    vacancy: "UI/UX Designer",
    applicant_name: "Jane Smith",
    applicant_email: "jane.smith@example.com",
    message: "Creative designer with strong portfolio in web and mobile design",
    resume_file_path: "jane_smith_portfolio.pdf",
    status: "Approved"
  },
  {
    id: 3,
    vacancy: "Product Manager",
    applicant_name: "Mike Johnson",
    applicant_email: "mike.johnson@example.com",
    message: "Strategic product leader with experience in agile methodologies",
    resume_file_path: "mike_johnson_cv.pdf",
    status: "Rejected"
  },
];

export default function ReferHistory() {
  const [referData, setReferData] = useState(initialRows);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditDialogOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  const handleUpdateRecord = (updatedRecord) => {
    setReferData(prev =>
      prev.map(record =>
        record.id === updatedRecord.id ? updatedRecord : record
      )
    );
  };

  const handleDeleteRecord = (recordToDelete) => {
    setReferData(prev =>
      prev.filter(record => record.id !== recordToDelete.id)
    );
  };

  const renderActions = (params) => {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={() => handleEdit(params.row)}
            sx={{ color: "primary.main" }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row)}
            sx={{ color: "error.main" }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  const columns = [
    { field: "vacancy", headerName: "Vacancy", width: 200 },
    { field: "applicant_name", headerName: "Candidate Name", width: 180 },
    { field: "applicant_email", headerName: "Candidate Email", width: 220 },
    { 
      field: "message", 
      headerName: "Message", 
      width: 300,
      renderCell: (params) => (
        <Box sx={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap',
          maxWidth: '100%'
        }}>
          {params.value}
        </Box>
      )
    },
    { field: "resume_file_path", headerName: "Uploaded Resume", width: 180 },
    { field: "status", headerName: "Referral State", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: renderActions,
    },
  ];

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ width: "100%", p: 5 }}>
        <DataGrid
          rows={referData}
          columns={columns}
          height="auto"
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 50, 100]}
        />
      </Box>
      
      <EditReferDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        record={selectedRecord}
        onUpdate={handleUpdateRecord}
      />
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        record={selectedRecord}
        onDelete={handleDeleteRecord}
      />
    </Paper>
  );
}