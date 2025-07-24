import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { Formik, Form } from "formik";

import ProjectForm, { projectValidationSchema } from "./ProjectForm";

export default function EditDialog({
  open,
  onClose,
  onSubmit,
  editingProject,
  departments = [],
  teams = [],
  loadingDepartments = false,
  loadingTeams = false,
  onDepartmentChange,
  getEditInitialValues,
}) {
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
          initialValues={getEditInitialValues(editingProject)}
          validationSchema={projectValidationSchema}
          onSubmit={onSubmit}
          enableReinitialize
          validateOnChange={false}
          validateOnBlur={true}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form>
              <Box sx={{ mt: 1 }}>
                <ProjectForm
                  isSubmitting={isSubmitting}
                  isEdit={true}
                  onCancel={onClose}
                  departments={departments}
                  teams={teams}
                  loadingDepartments={loadingDepartments}
                  loadingTeams={loadingTeams}
                  onDepartmentChange={onDepartmentChange}
                  values={values}
                  setFieldValue={setFieldValue}
                />
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
