"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

export default function SubmitDialog(props) {
  const { openSubmit, setOpenSubmit } = props;

  return (
    <>
      <Dialog
        open={openSubmit}
        onClose={() => setOpenSubmit(false)}
        slotProps={{
          paper: {
            sx: {
              width: "400px",
              height: "200px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            },
          },
          backdrop: {
            sx: {
              backgroundColor: "rgba(107, 114, 128, 0.75)",
            },
          },
        }}
      >
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
            textAlign: "center",
            mt: 2,
          }}
        >
          <DialogContentText
            color="primary.main"
            sx={{ fontSize: "1.25rem", fontWeight: 700 }}
          >
            SUBMITTED
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={() => setOpenSubmit(false)} color="canclebtn">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
