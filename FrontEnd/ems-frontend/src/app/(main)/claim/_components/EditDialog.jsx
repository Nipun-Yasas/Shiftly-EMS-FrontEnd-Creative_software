"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import ClaimForm from "./ClaimForm";

const claimtypeOptions = [
  { id: 1, name: "Medical" },
  { id: 2, name: "Insuarance" },
];

export default function EditDialog({ open, onClose, record, handleUpdate }) {
  const getClaimTypeObject = (claimTypeValue) => {
    if (!claimTypeValue) return null;
    if (typeof claimTypeValue === "object" && claimTypeValue.id)
      return claimTypeValue;

    return (
      claimtypeOptions.find(
        (option) =>
          option.name === claimTypeValue || option.id === claimTypeValue
      ) || null
    );
  };

  const getInitialValues = () => {
    if (!record) return "select a record to edit";
    return {
      claimType: getClaimTypeObject(record.claimType),
      claimDate: record.claimDate,
      description: record.description || "",
      file: record.claimUrl || null,
    };
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        Edit Claim Entry
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ m: 2 }}>
        <ClaimForm
          edit={true}
          selectedRecord={record}
          handleSubmit={handleUpdate}
          initialValues={getInitialValues()}
        />
      </DialogContent>
    </Dialog>
  );
}
