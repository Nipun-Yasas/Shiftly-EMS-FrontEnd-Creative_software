'use client';

import { useState, useMemo, useEffect } from "react";
import { usePathname } from 'next/navigation';
import axiosInstance from "../../../_utils/axiosInstance";
import { API_PATHS } from "../../../_utils/apiPaths";
import { DataGrid } from "@mui/x-data-grid";
import { Paper, Box } from "@mui/material";
import { IconButton, Tooltip, Dialog, DialogTitle, DialogActions, Button, DialogContent, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";

const columns = [

  { field: "leave_type", headerName: "Leave Type", width: 150, renderCell: (params) => (<span>{params.value}</span>), },
  { field: "leave_from", headerName: "Leave From", width: 150 },
  { field: "leave_to", headerName: "Leave To", width: 150 },

  { field: "reason", headerName: "Reason", width: 150 },
  { field: "cover_person", headerName: "Cover Person", width: 150 },
  { field: "leave_status", headerName: "Status", width: 150, renderCell: (params) => (
      <span
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "9999px",
          fontSize: "0.875rem",
          fontWeight: 500,
          textAlign: "center",
          backgroundColor: params.value === "Approved" ? "#dcedc8" : "#fff3e0",
          color: params.value === "Approved" ? "#388e3c" : "#f57c00",
        }}
      >
        {params.value}
      </span>
    ),
  },
  {
    field: "actions",
    headerName: "Actions",
    align: "center",
    headerClassName: "last-column",
    width: 90,
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          gap: 0.5,
          mt: 1,
          width: "100%",
          justifyContent: "center",
        }}
      >
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
            onClick={() => {
              setUserToDelete(params.row);
              setDeleteConfirmOpen(true);
            }}
            sx={{ color: "error.main" }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  },
];

export default function LeaveHistory() {
  const pathname = usePathname();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [attribute, setAttribute] = useState("Leave To");
  // Delete dialog state
  const [leaveToDelete, setLeaveToDelete] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  // Edit dialog state
  const [leaveToEdit, setLeaveToEdit] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({ leave_type: '', leave_from: '', leave_to: '', reason: '', cover_person: '', leave_status: '' });

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(API_PATHS.LEAVES.GET_MY_LEAVES)
      .then((res) => {
        // Map backend data to DataGrid row format
        const mappedRows = res.data.map((leave) => ({
          id: leave.id,
          leave_type: leave.leaveType || '',
          leave_from: leave.leaveFrom || '',
          leave_to: leave.leaveTo || '',
          reason: leave.reason || '',
          cover_person: leave.coverPersonName || '',
          report_to: leave.reportToName || '',
          leave_status: leave.leaveStatus || '',
        }));
        setRows(mappedRows);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch leave history");
        setLoading(false);
      });
  }, [pathname]);

  // Delete logic
  const handleDelete = (row) => {
    setLeaveToDelete(row);
    setDeleteConfirmOpen(true);
  };
  const confirmDelete = () => {
    axiosInstance.delete(API_PATHS.LEAVES.DELETE_MY_LEAVE(leaveToDelete.id))
      .then(() => {
        setRows((prev) => prev.filter((r) => r.id !== leaveToDelete.id));
        setDeleteConfirmOpen(false);
        setLeaveToDelete(null);
      })
      .catch(() => {
        setError("Failed to delete leave");
        setDeleteConfirmOpen(false);
      });
  };

  // Edit logic
  const handleEdit = (row) => {
    setLeaveToEdit(row);
    setEditForm({
      leave_type: row.leave_type,
      leave_from: row.leave_from,
      leave_to: row.leave_to,
      reason: row.reason,
      cover_person: row.cover_person,
      leave_status: row.leave_status,
    });
    setEditDialogOpen(true);
  };
  const handleEditFormChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };
  const confirmEdit = () => {
    // Prepare payload for backend
    const payload = {
      leaveType: editForm.leave_type,
      leaveFrom: editForm.leave_from,
      leaveTo: editForm.leave_to,
      reason: editForm.reason,
      coverPersonName: editForm.cover_person,
      leaveStatus: editForm.leave_status,
    };
    axiosInstance.put(API_PATHS.LEAVES.UPDATE_MY_LEAVE(leaveToEdit.id), payload)
      .then((res) => {
        setRows((prev) => prev.map((r) => r.id === leaveToEdit.id ? {
          ...r,
          leave_type: res.data.leaveType,
          leave_from: res.data.leaveFrom,
          leave_to: res.data.leaveTo,
          reason: res.data.reason,
          cover_person: res.data.coverPersonName,
          leave_status: res.data.leaveStatus,
        } : r));
        setEditDialogOpen(false);
        setLeaveToEdit(null);
      })
      .catch(() => {
        setError("Failed to update leave");
        setEditDialogOpen(false);
      });
  };

  const attributeMap = {
    "Leave Id": "id",
    "Leave Type": "leave_type",
    "Leave From": "leave_from",
    "Leave To": "leave_to",
    "Cover Person": "cover_person",
    Status: "leave_status",
  };

  const filteredRows = useMemo(() => {
    if (!searchText.trim()) return rows;
    const field = attributeMap[attribute];
    return rows.filter((row) =>
      row[field]?.toString().toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, attribute, rows]);

  // Columns with working actions
  const columns = [
    { field: "leave_type", headerName: "Leave Type", width: 150, renderCell: (params) => (<span>{params.value}</span>), },
    { field: "leave_from", headerName: "Leave From", width: 150 },
    { field: "leave_to", headerName: "Leave To", width: 150 },
    { field: "reason", headerName: "Reason", width: 150 },
    { field: "cover_person", headerName: "Cover Person", width: 150 },
    { field: "leave_status", headerName: "Status", width: 150, renderCell: (params) => (
      <span
        style={{
          padding: "0.5rem 1rem",
          borderRadius: "9999px",
          fontSize: "0.875rem",
          fontWeight: 500,
          textAlign: "center",
          backgroundColor: params.value === "Approved" ? "#dcedc8" : "#fff3e0",
          color: params.value === "Approved" ? "#388e3c" : "#f57c00",
        }}
      >
        {params.value}
      </span>
    ), },
    {
      field: "actions",
      headerName: "Actions",
      align: "center",
      headerClassName: "last-column",
      width: 90,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5, mt: 1, width: "100%", justifyContent: "center" }}>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(params.row)} sx={{ color: "primary.main" }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDelete(params.row)} sx={{ color: "error.main" }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Paper elevation={3} sx={{ height: "100%", width: "100%" }}>
      <Box sx={{ width: "100%", p: 5 }}>
        {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          height="auto"
          pageSize={10}
          rowsPerPageOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          disableSelectionOnClick
        />
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
          <DialogTitle>Are you sure you want to delete this leave?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button onClick={confirmDelete} color="error">Delete</Button>
          </DialogActions>
        </Dialog>
        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
          <DialogTitle>Edit Leave</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 350 }}>
            <FormControl fullWidth>
              <InputLabel>Leave Type</InputLabel>
              <Select
                value={editForm.leave_type}
                onChange={e => handleEditFormChange('leave_type', e.target.value)}
                label="Leave Type"
              >
                <MenuItem value="SICK">Sick</MenuItem>
                <MenuItem value="CASUAL">Casual</MenuItem>
                <MenuItem value="MATERNITY">Maternity</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Leave From"
              type="date"
              value={editForm.leave_from}
              onChange={e => handleEditFormChange('leave_from', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Leave To"
              type="date"
              value={editForm.leave_to}
              onChange={e => handleEditFormChange('leave_to', e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Reason"
              value={editForm.reason}
              onChange={e => handleEditFormChange('reason', e.target.value)}
              fullWidth
            />
            <TextField
              label="Cover Person"
              value={editForm.cover_person}
              onChange={e => handleEditFormChange('cover_person', e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={editForm.leave_status}
                onChange={e => handleEditFormChange('leave_status', e.target.value)}
                label="Status"
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="APPROVED">Approved</MenuItem>
                <MenuItem value="REJECTED">Rejected</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmEdit} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Paper>
  );
}