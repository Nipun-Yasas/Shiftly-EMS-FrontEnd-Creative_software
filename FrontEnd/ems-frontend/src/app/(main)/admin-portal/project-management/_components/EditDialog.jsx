import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { Formik, Form } from "formik";

import ProjectForm, { projectValidationSchema } from "./ProjectForm";

const departments = [
  { id: 1, name: "Engineering", label: "Engineering" },
  { id: 2, name: "Project Management", label: "Project Management" },
  { id: 3, name: "Human Resources", label: "Human Resources" },
  { id: 4, name: "IT", label: "Information Technology" },
  { id: 5, name: "Finance", label: "Finance" },
  { id: 6, name: "Marketing", label: "Marketing" },
  { id: 7, name: "Sales", label: "Sales" },
  { id: 8, name: "Operations", label: "Operations" },
];

const teams = [
  { id: 1, name: "Alpha Team", label: "Alpha Team" },
  { id: 2, name: "Beta Team", label: "Beta Team" },
  { id: 3, name: "Gamma Team", label: "Gamma Team" },
  { id: 4, name: "Delta Team", label: "Delta Team" },
  { id: 5, name: "Epsilon Team", label: "Epsilon Team" },
  { id: 6, name: "Zeta Team", label: "Zeta Team" },
  { id: 7, name: "Theta Team", label: "Theta Team" },
  { id: 8, name: "Sigma Team", label: "Sigma Team" },
];

export default function EditDialog({
  open,
  onClose,
  onSubmit,
  editingProject,
}) {
  const getInitialValues = () => {
    if (editingProject) {
      return {
        projectName: editingProject.projectName || "",
        description: editingProject.description || "",
        department:
          departments.find((d) => d.name === editingProject.department) || null,
        teamName: teams.find((t) => t.name === editingProject.teamName) || null,
        startDate: editingProject.startDate || null,
        deadline: editingProject.deadline || null,
        progress: editingProject.progress || 0,
      };
    }
    return {
      projectName: "",
      description: "",
      department: null,
      teamName: null,
      startDate: null,
      deadline: null,
      progress: 0,
    };
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Edit Project
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Formik
          initialValues={getInitialValues()}
          validationSchema={projectValidationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <ProjectForm
                isSubmitting={isSubmitting}
                isEdit={true}
                onCancel={onClose}
              />
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
