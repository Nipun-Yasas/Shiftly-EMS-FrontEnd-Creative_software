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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";

import Receipt from "@mui/icons-material/Receipt";
import Person from "@mui/icons-material/Person";
import Close from "@mui/icons-material/Close";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Cancel from "@mui/icons-material/Cancel";
import History from "@mui/icons-material/History";
import AccessTime from "@mui/icons-material/AccessTime";
import AttachFile from "@mui/icons-material/AttachFile";
import Visibility from "@mui/icons-material/Visibility";

import dayjs from "dayjs";
import { getStatusColor, getStatusIconComponent } from "../../_helpers/StatusHelper";

export default function ClaimDetailsDialog({
  open,
  onClose,
  claim,
  onApprovalAction,
  onViewHistory,
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
          <Receipt />
          <Typography variant="h6">
            Claim Details
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {claim && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Employee Information
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ mr: 2 }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">
                        {claim.employee_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {claim.employeeEmail}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {claim.department}
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
                    Claim Information
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Type:
                    </Typography>
                    <Typography variant="body1">
                      {claim.type}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Amount:
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${claim.amount?.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Status:
                    </Typography>
                    <Chip
                      icon={getStatusIconComponent(claim.status)}
                      label={
                        claim.status.charAt(0).toUpperCase() +
                        claim.status.slice(1)
                      }
                      color={getStatusColor(claim.status)}
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
                    Important Dates
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Claim Date:
                    </Typography>
                    <Typography variant="body1">
                      {dayjs(claim.claimDate).format("MMMM DD, YYYY")}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Submission Date:
                    </Typography>
                    <Typography variant="body1">
                      {dayjs(claim.submission_date).format(
                        "MMMM DD, YYYY HH:mm"
                      )}
                    </Typography>
                  </Box>
                  {claim.approvedAt && (
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Approved Date:
                      </Typography>
                      <Typography variant="body1">
                        {dayjs(claim.approvedAt).format(
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
                    Attachments
                  </Typography>
                  {claim.attachments?.length > 0 ? (
                    <List dense>
                      {claim.attachments.map((file, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: "primary.light" }}>
                              <AttachFile />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={file} />
                          
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No attachments
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {claim.rejectionReason && (
              <Grid item xs={12}>
                <Alert severity="error">
                  <Typography variant="subtitle2">Rejection Reason:</Typography>
                  <Typography variant="body2">
                    {claim.rejectionReason}
                  </Typography>
                </Alert>
              </Grid>
            )}
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom color="primary">
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {claim.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
        )}
      </DialogContent>
      <DialogActions
        sx={{
          p: 2,
        }}
      >
        <Box sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: { xs: "center", sm: "flex-end" },
            gap: { xs: 0, sm: 2 },
            alignItems: "center",
            width: "100%",
          }}>
        {claim?.status === "pending" && (
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
              startIcon={<CheckCircle />}
              onClick={() => onApprovalAction(claim)}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<Cancel />}
              onClick={() => onApprovalAction(claim)}
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
        <Button color="textblack" onClick={onClose}>Close</Button></Box>
        
        </Box>
      </DialogActions>
    </Dialog>
  );
}
