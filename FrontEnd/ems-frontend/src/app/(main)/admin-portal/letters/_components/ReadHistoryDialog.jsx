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

export default function ReadHistoryDialog({ open, onClose, readHistory }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography
          variant="h6"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <HistoryIcon />
          Letter Action History
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {readHistory.length === 0 ? (
          <Typography color="textSecondary" sx={{ textAlign: "center", py: 2 }}>
            No action history available
          </Typography>
        ) : (
          <List>
            {readHistory.map((history, index) => (
              <React.Fragment key={history.id}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {history.adminName.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={history.adminName}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          {history.adminEmail}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {history.action} on{" "}
                          {dayjs(history.readAt).format("MMMM DD, YYYY HH:mm")}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                {index < readHistory.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button color="textblack" onClick={onClose} variant="text">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
