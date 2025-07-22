"use client";

import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EditReferDialog from "../_components/EditReferDialog";
import DeleteConfirmDialog from "../_components/DeleteConfirmDialog";
import axiosInstance from '../../../_utils/axiosInstance';
import { REFERRAL_API } from '../../../_utils/apiPaths';

export default function ReferHistory() {
  const [referData, setReferData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(REFERRAL_API.GET_ALL);
        // Map backend fields to frontend DataGrid fields
        const mapped = response.data.map(ref => ({
          id: ref.id,
          vacancy: ref.vacancyName,
          applicant_name: ref.applicantName,
          applicant_email: ref.applicantEmail,
          message: ref.message,
          resume_file_path: ref.fileUrl,
          status: ref.status,
        }));
        setReferData(mapped);
      } catch (error) {
        setReferData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, []);

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
        {loading ? (
          <div>Loading...</div>
        ) : (
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
        )}
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