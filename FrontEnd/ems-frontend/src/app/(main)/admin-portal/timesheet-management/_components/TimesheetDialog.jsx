import React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonIcon from "@mui/icons-material/Person";

import { DataGrid } from "@mui/x-data-grid";

export default function TimesheetDialog({
  open,
  onClose,
  selectedEmployee,
  employeeTimesheets,
  onApprove,
  onReject,
}) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "success";
      case "pending":
        return "warning";
      case "rejected":
        return "error";
      default:
        return "default";
    }
  };

  const columns = [
    {
      field: "date",
      headerName: "Date",
      width: 100,
    },
    {
      field: "projectTask",
      headerName: "Project Task",
      width: 150,
    },
    {
      field: "workMode",
      headerName: "Work Mode",
      width: 120,
    },
    {
      field: "activity",
      headerName: "Activity",
      width: 130,
    },
    {
      field: "hours",
      headerName: "Hours",
      width: 90,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) =>
        params.row.status === "Pending" ? (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              color="success"
              onClick={() => onApprove(params.row.id)}
              title="Approve"
            >
              <CheckCircleIcon />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => onReject(params.row.id)}
              title="Reject"
            >
              <CancelIcon />
            </IconButton>
          </Box>
        ) : null,
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {selectedEmployee && (
        <>
          <DialogTitle>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">
                Timesheet Records: {selectedEmployee.name}
              </Typography>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "stretch", sm: "center" },
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                    }}
                  >
                    <PersonIcon fontSize="large" />
                  </Box>
                  <Box>
                    <Typography variant="h6">
                      {selectedEmployee.name}
                    </Typography>
                    <Typography variant="body2">
                      {selectedEmployee.email}
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Typography variant="body2">
                    <strong>Team:</strong> {selectedEmployee.team}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Project:</strong> {selectedEmployee.project}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2">
                    <strong>Pending Submissions:</strong>{" "}
                    {selectedEmployee.pendingSubmissions}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Last Updated:</strong> 3 days ago
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" sx={{ mb: 2 }}>
              Timesheet Entries
            </Typography>

            <Box>
              <DataGrid
                rows={employeeTimesheets}
                columns={columns}
                disableSelectionOnClick
                sx={{
                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                }}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                  },
                }}
                pageSizeOptions={[5, 10]}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button color="textblack" onClick={onClose}>
              Close
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
