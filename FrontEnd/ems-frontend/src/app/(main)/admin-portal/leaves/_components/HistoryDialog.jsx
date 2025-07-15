"use client";

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

import HistoryIcon from "@mui/icons-material/History";
import dayjs from "dayjs";

export default function HistoryDialog({ open, onClose, actionHistory }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <HistoryIcon />
          Action History
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {actionHistory.length > 0 ? (
          <List>
            {actionHistory.map((action, index) => (
              <React.Fragment key={action.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>{action.adminName.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle2">
                          {action.adminName} {action.action}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dayjs(action.timestamp).format("MMM DD, YYYY HH:mm")}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {action.adminEmail}
                        </Typography>
                        {action.notes && (
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            {action.notes}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
                {index < actionHistory.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ p: 2, textAlign: "center" }}
          >
            No action history available
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button color="textblack" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
