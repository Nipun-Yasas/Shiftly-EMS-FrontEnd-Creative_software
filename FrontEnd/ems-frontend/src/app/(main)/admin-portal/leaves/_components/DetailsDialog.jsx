"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonIcon from "@mui/icons-material/Person";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PeopleIcon from "@mui/icons-material/People";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

import {
  getStatusColor,
  getStatusIcon,
  getLeaveTypeColor,
} from "../../_helpers/colorhelper";

import dayjs from "dayjs";

export default function DetailsDialog({
  open,
  onClose,
  selectedLeave,
  onApprovalAction,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <EventAvailableIcon />
          <Typography variant="h6">Leave Details</Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {selectedLeave && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Employee Information
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        {selectedLeave.employeeName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedLeave.employeeEmail}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedLeave.department}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Coverage Details
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Cover Person:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PeopleIcon fontSize="small" />
                      <Typography variant="body1">
                        {selectedLeave.coverPerson}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Report to Person:
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <ReportProblemIcon fontSize="small" />
                      <Typography variant="body1">
                        {selectedLeave.reportPerson}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Leave Information
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Type:
                    </Typography>
                    <Chip
                      label={selectedLeave.leaveType}
                      style={{
                        backgroundColor: getLeaveTypeColor(
                          selectedLeave.leaveType
                        ),
                        color: "white",
                      }}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Duration:
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {selectedLeave.leaveDuration} day
                      {selectedLeave.leaveDuration > 1 ? "s" : ""}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status:
                    </Typography>
                    <Chip
                      icon={getStatusIcon(selectedLeave.status)}
                      label={
                        selectedLeave.status.charAt(0).toUpperCase() +
                        selectedLeave.status.slice(1)
                      }
                      color={getStatusColor(selectedLeave.status)}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Leave Period
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      From:
                    </Typography>
                    <Typography variant="body1">
                      {dayjs(selectedLeave.leaveFrom).format("MMMM DD, YYYY")}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      To:
                    </Typography>
                    <Typography variant="body1">
                      {dayjs(selectedLeave.leaveTo).format("MMMM DD, YYYY")}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Submission Date:
                    </Typography>
                    <Typography variant="body1">
                      {dayjs(selectedLeave.submissionDate).format(
                        "MMMM DD, YYYY HH:mm"
                      )}
                    </Typography>
                  </Box>
                  {selectedLeave.approvedAt && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Approved Date:
                      </Typography>
                      <Typography variant="body1">
                        {dayjs(selectedLeave.approvedAt).format(
                          "MMMM DD, YYYY HH:mm"
                        )}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Leave Reason
                  </Typography>
                  <Typography variant="body1">
                    {selectedLeave.reason}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {selectedLeave.rejectionReason && (
              <Grid item xs={12}>
                <Alert severity="error">
                  <Typography variant="subtitle2">Rejection Reason:</Typography>
                  <Typography variant="body2">
                    {selectedLeave.rejectionReason}
                  </Typography>
                </Alert>
              </Grid>
            )}
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "flex-end" },
            gap: { xs: 0, sm: 2 },
            alignItems: "center",
            width: "100%",
          }}
        >
          {selectedLeave?.status === "pending" && (
            <Box
              sx={{
                display: "flex",
                gap: 1,
                justifyContent: "center",
              }}
            >
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => onApprovalAction(selectedLeave, "approve")}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => onApprovalAction(selectedLeave, "reject")}
              >
                Reject
              </Button>
            </Box>
          )}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              mt: { xs: 1, sm: 0 },
            }}
          >
            <Button color="text.primary" variant="text" onClick={onClose}>
              Close
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
