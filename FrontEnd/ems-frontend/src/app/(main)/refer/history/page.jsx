"use client";

import { useState, useEffect, useContext } from "react";
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
import { API_PATHS } from '../../../_utils/apiPaths';
import { UserContext } from '../../../context/UserContext';
import { useVacancies } from '../../../_hooks/useVacancies';

export default function ReferHistory() {
  const [referData, setReferData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const { user } = useContext(UserContext);
  const { vacancies } = useVacancies();

  // Fetch referrals helper
  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.REFERRALS.GET_BY_USER_ID(user.id));
      const mapped = response.data.map(ref => {
        let vacancyName = ref.vacancyName;
        if (!vacancyName && ref.vacancyId && vacancies.length > 0) {
          const found = vacancies.find(v => v.id === ref.vacancyId);
          vacancyName = found ? found.name : ref.vacancyId;
        }
        return {
          id: ref.id,
          vacancy: vacancyName || ref.vacancyId,
          applicant_name: ref.applicantName,
          applicant_email: ref.applicantEmail,
          message: ref.message,
          resume_file_path: ref.fileUrl,
          status: ref.status,
        };
      });
      setReferData(mapped);
    } catch (error) {
      setReferData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    fetchReferrals();
  }, [user?.id, vacancies]);

  // Edit logic
  const handleUpdateRecord = async (id, data) => {
    setLoading(true);
    try {
      await axiosInstance.put(API_PATHS.REFERRALS.UPDATE(id), data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await fetchReferrals();
    } catch (error) {
      // fallback: do nothing or show error
    } finally {
      setLoading(false);
    }
  };

  // Delete logic
  const handleDeleteRecord = async (recordToDelete) => {
    setLoading(true);
    try {
      await axiosInstance.delete(API_PATHS.REFERRALS.DELETE(recordToDelete.id));
      await fetchReferrals();
    } catch (error) {
      setReferData(prev => prev.filter(record => record.id !== recordToDelete.id));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditDialogOpen(true);
  };

  const handleDelete = (record) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
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
    { 
      field: "resume_file_path", 
      headerName: "Uploaded Resume", 
      width: 180,
      renderCell: (params) => {
        const fileUrl = params.value;
        if (!fileUrl) return "No file";
        const fullUrl = "http://localhost:8080" + fileUrl;
        return (
          <a href={fullUrl} target="_blank" rel="noopener noreferrer" download>
            Download
          </a>
        );
      }
    },
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