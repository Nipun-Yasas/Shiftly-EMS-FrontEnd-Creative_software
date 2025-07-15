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
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";

import PersonIcon from "@mui/icons-material/Person";
import MailIcon from "@mui/icons-material/Mail";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DownloadIcon from "@mui/icons-material/Download";
import AssignmentIcon from "@mui/icons-material/Assignment";
import HistoryIcon from "@mui/icons-material/History";

import dayjs from "dayjs";

export default function LetterDetailDialog({
  open,
  onClose,
  selectedLetter,
  onViewHistory,
  onGenerateLetter,
  onDownloadLetter,
}) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          {selectedLetter
            ? `Letter Request - ${selectedLetter.employeeName}`
            : ""}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {selectedLetter && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Employee Information
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography>
                      <strong>Name:</strong> {selectedLetter.employeeName}
                    </Typography>
                    <Typography>
                      <strong>Employee ID:</strong> {selectedLetter.employeeId}
                    </Typography>
                    <Typography>
                      <strong>Email:</strong> {selectedLetter.email}
                    </Typography>
                    <Typography>
                      <strong>Department:</strong> {selectedLetter.department}
                    </Typography>
                    <Typography>
                      <strong>Position:</strong> {selectedLetter.position}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    <MailIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Request Details
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography>
                      <strong>Letter Type:</strong> {selectedLetter.letterType}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CalendarTodayIcon color="action" />
                      <Typography>
                        Requested:{" "}
                        {dayjs(selectedLetter.requestDate).format(
                          "MMMM DD, YYYY HH:mm"
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    <DescriptionIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Request Reason
                  </Typography>
                  <Typography sx={{ mb: 2 }}>
                    <strong>Reason:</strong> {selectedLetter.reason}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Additional Details:</strong>
                  </Typography>
                  <Typography
                    sx={{ whiteSpace: "pre-wrap", textAlign: "justify" }}
                  >
                    {selectedLetter.additionalDetails}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {selectedLetter.processedAt && (
              <Grid item xs={12}>
                <Alert severity="success">
                  <Typography>
                    <strong>Read At:</strong> {selectedLetter.readAt} on{" "}
                    {dayjs(selectedLetter.readAt).format("MMMM DD, YYYY HH:mm")}
                  </Typography>
                </Alert>
              </Grid>
            )}

            {selectedLetter.status === "read" && selectedLetter.readBy && (
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography>
                    <strong>Read by:</strong> {selectedLetter.readBy} on{" "}
                    {dayjs(selectedLetter.readAt).format("MMMM DD, YYYY HH:mm")}
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
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
            }}
          >
            {selectedLetter?.processedAt ? (
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() =>
                  onDownloadLetter(
                    selectedLetter?.id,
                    selectedLetter?.employeeName,
                    selectedLetter?.letterType
                  )
                }
                color="primary"
              >
                Download Letter
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<AssignmentIcon />}
                onClick={() => onGenerateLetter(selectedLetter?.id)}
                color="primary"
              >
                Generate Letter
              </Button>
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <Button
              variant="text"
              startIcon={<HistoryIcon />}
              onClick={() => onViewHistory(selectedLetter?.id)}
            >
              View
            </Button>
            <Button color="textblack" variant="text" onClick={onClose}>
              Close
            </Button>
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
