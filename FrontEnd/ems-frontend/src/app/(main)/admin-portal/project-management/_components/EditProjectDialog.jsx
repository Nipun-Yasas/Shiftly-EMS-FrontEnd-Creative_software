import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { Formik, Form } from "formik";

import ProjectForm, { projectValidationSchema } from "./ProjectForm";

export default function EditProjectDialog({
  open,
  onClose,
  onSubmit,
  editingProject,
  projectStatuses,
}) {
  const getInitialValues = () => {
    if (editingProject) {
      return {
        projectName: editingProject.projectName,
        description: editingProject.description,
        client: editingProject.client,
        projectManager: editingProject.projectManager,
        status:
          projectStatuses.find((s) => s.name === editingProject.status?.name) ||
          null,
        startDate: editingProject.startDate,
        endDate: editingProject.endDate,
        teamSize: editingProject.teamSize,
      };
    }
    return {};
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
      <DialogContent>
        <Formik
          initialValues={getInitialValues()}
          validationSchema={projectValidationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form>
              <ProjectForm projectStatuses={projectStatuses}>
                <DialogActions sx={{ mt: 3 }}>
                  <Button color="textblack" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    startIcon={
                      isSubmitting ? <CircularProgress size={20} /> : null
                    }
                  >
                    {isSubmitting ? "Updating..." : "Update"}
                  </Button>
                </DialogActions>
              </ProjectForm>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
