"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import ReferForm from "./ReferForm";

export default function EditDialog({
  open,
  onClose,
  record,
  handleUpdate,
  vacancies
}) {
  const getVacancyObject = (vacancyValue) => {
    if (!vacancyValue) return null;
    if (typeof vacancyValue === "object" && vacancyValue.id) {
      return vacancies.find((v) => v.id === vacancyValue.id) || vacancyValue;
    }
    return (
      vacancies.find(
        (option) =>
          option.vacancyName === vacancyValue || option.id === vacancyValue
      ) || null
    );
  };

  const getInitialValues = () => {
    if (!record)
      return "select a record to edit"
    return {
      vacancy: getVacancyObject(record.vacancy),
      applicantName: record.applicantName || "",
      applicantEmail: record.applicantEmail || "",
      message: record.message || "",
      file: record.fileUrl || null,
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
        Edit Refferal Entry
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
        <ReferForm
          edit={true}
          selectedRecord={record}
          handleSubmit={handleUpdate}
          initialValues={getInitialValues()}
          vacancies={vacancies}
        />
      </DialogContent>
    </Dialog>
  );
}
