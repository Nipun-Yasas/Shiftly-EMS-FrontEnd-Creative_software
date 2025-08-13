"use client";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import LeaveForm from "./LeaveForm";

const leaveOptions = [
  { id: 1, name: "Casual Leave", value: "casual" },
  { id: 2, name: "Sick Leave", value: "sick" },
  { id: 3, name: "Vacation Leave", value: "vacation" },
  { id: 4, name: "Maternity Leave", value: "maternity" },
  { id: 5, name: "Other", value: "other" },
];

const calculateDuration = (from, to) => {
  if (!from || !to) return "";
  const start = new Date(from);
  const end = new Date(to);
  if (isNaN(start) || isNaN(end) || start > end) return "";
  const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return diff;
};

export default function EditDialog({
  open,
  onClose,
  record,
  handleUpdate,
  employees
}) {
  const getInitialValues = () => {
    if (!record) {
      return {
        leaveType: null,
        leaveFrom: "",
        leaveTo: "",
        duration: "",
        coverPersonId: null,
        reason: "",
      };
    }
    const coverPersonOption =
      employees
        ?.map(e => ({ id: e.id ?? e.employeeId, name: e.employeeName }))
        .find(
          o =>
            o.id === record.coverPersonId ||
            o.name?.toLowerCase() === (record.coverPersonName || "").toLowerCase()
        ) ||
      (record.coverPersonId
        ? { id: record.coverPersonId, name: record.coverPersonName }
        : null);

    return {
      leaveType:
        leaveOptions.find(
          o =>
            o.value.toLowerCase() === (record.leaveType || "").toLowerCase() ||
            o.name.toLowerCase() === (record.leaveType || "").toLowerCase()
        ) || null,
      leaveFrom: record.leaveFrom || "",
      leaveTo: record.leaveTo || "",
      duration: calculateDuration(record.leaveFrom, record.leaveTo),
      coverPersonId: coverPersonOption,
      reason: record.reason || "",
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
        Edit Leave Entry
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <LeaveForm
          edit
          selectedRecord={record}
          handleSubmit={handleUpdate}
          initialValues={getInitialValues()}
          leaveOptions={leaveOptions}
          employees={employees}
          calculateDuration={calculateDuration}
        />
      </DialogContent>
    </Dialog>
  );
}
