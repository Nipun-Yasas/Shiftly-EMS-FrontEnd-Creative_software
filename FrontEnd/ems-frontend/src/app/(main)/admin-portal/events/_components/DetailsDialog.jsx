"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";

import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import CategoryIcon from "@mui/icons-material/Category";
import LocationIcon from "@mui/icons-material/LocationOn";
import GroupIcon from "@mui/icons-material/Group";
import BudgetIcon from "@mui/icons-material/AttachMoney";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import HistoryIcon from "@mui/icons-material/History";

import dayjs from "dayjs";
import { getStatusIcon, getStatusColor } from "../../_helpers/colorhelper";

export default function DetailsDialog({
  open,
  onClose,
  selectedEvent,
  onApprovalAction,
  onViewHistory,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          {selectedEvent ? selectedEvent.title : ""}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {selectedEvent && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Organizer Information
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography>
                      <strong>Name:</strong> {selectedEvent.organizer}
                    </Typography>
                    <Typography>
                      <strong>Email:</strong> {selectedEvent.organizerEmail}
                    </Typography>
                    <Typography>
                      <strong>Department:</strong> {selectedEvent.department}
                    </Typography>
                    <Typography>
                      <strong>Submitted:</strong>{" "}
                      {dayjs(selectedEvent.submissionDate).format(
                        "MMMM DD, YYYY HH:mm"
                      )}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    <EventIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Event Details
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CategoryIcon color="action" />
                      <Typography>
                        <strong>Type:</strong> {selectedEvent.eventType}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocationIcon color="action" />
                      <Typography>
                        <strong>Location:</strong> {selectedEvent.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <GroupIcon color="action" />
                      <Typography>
                        <strong>Expected Attendees:</strong>{" "}
                        {selectedEvent.expectedAttendees}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <BudgetIcon color="action" />
                      <Typography>
                        <strong>Budget:</strong> $
                        {selectedEvent.budget?.toLocaleString()}
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
                    <CalendarIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Date & Time
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Typography>
                      <strong>Start:</strong>{" "}
                      {dayjs(selectedEvent.startDate).format(
                        "MMMM DD, YYYY HH:mm"
                      )}
                    </Typography>
                    <Typography>
                      <strong>End:</strong>{" "}
                      {dayjs(selectedEvent.endDate).format("MMMM DD, YYYY HH:mm")}
                    </Typography>
                    <Typography>
                      <strong>Duration:</strong>{" "}
                      {dayjs(selectedEvent.endDate).diff(
                        dayjs(selectedEvent.startDate),
                        "hour"
                      )}{" "}
                      hours
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Status & Approval
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Chip
                      icon={getStatusIcon(selectedEvent.status)}
                      label={
                        selectedEvent.status.charAt(0).toUpperCase() +
                        selectedEvent.status.slice(1)
                      }
                      color={getStatusColor(selectedEvent.status)}
                      size="medium"
                    />
                    {selectedEvent.approvedBy && (
                      <Typography>
                        <strong>Approved by:</strong> {selectedEvent.approvedBy}{" "}
                        on{" "}
                        {dayjs(selectedEvent.approvedAt).format(
                          "MMMM DD, YYYY HH:mm"
                        )}
                      </Typography>
                    )}
                    {selectedEvent.rejectionReason && (
                      <Alert severity="error">
                        <strong>Rejection Reason:</strong>{" "}
                        {selectedEvent.rejectionReason}
                      </Alert>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    <DescriptionIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Event Description
                  </Typography>
                  <Typography
                    sx={{
                      whiteSpace: "pre-wrap",
                      textAlign: "justify",
                      mb: 2,
                    }}
                  >
                    {selectedEvent.description}
                  </Typography>

                  <Typography
                    variant="h6"
                    gutterBottom
                    color="primary"
                    sx={{ mt: 2 }}
                  >
                    Requirements
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {selectedEvent.requirements?.map((requirement, index) => (
                      <Typography
                        key={index}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        • {requirement}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions dividers sx={{p:2}}>
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
        {selectedEvent?.status === "pending" && (
          <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
            <Button
              startIcon={<CheckCircleIcon />}
              onClick={() => onApprovalAction(selectedEvent, "approve")}
              variant="contained"
              color="success"
            >
              Approve 
            </Button>
            <Button
              startIcon={<CancelIcon />}
              onClick={() => onApprovalAction(selectedEvent, "reject")}
              variant="contained"
              color="error"
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
                    <Button color='text.primary' onClick={onClose} variant="text">
          Close
        </Button>
                  </Box>
        
        </Box>
      </DialogActions>
    </Dialog>
  );
}
