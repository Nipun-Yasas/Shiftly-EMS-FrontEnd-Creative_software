import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import AddIcon from "@mui/icons-material/Add";

import { Formik, Form } from "formik";

import ProjectForm, { projectValidationSchema } from "./ProjectForm";

export default function AddProjectTab({
  onSubmit,
  projectStatuses,
  initialFormValues,
}) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Project
      </Typography>
      <Formik
        initialValues={initialFormValues}
        validationSchema={projectValidationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, resetForm }) => (
          <Form>
            <ProjectForm projectStatuses={projectStatuses}></ProjectForm>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", sm: "flex-end" },
                gap: 2,
                mt:2,
                pt:2,
                width: "100%",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? <CircularProgress size={20} /> : <AddIcon />
                }
              >
                {isSubmitting ? "Adding..." : "Add Project"}
              </Button>
              <Button
                type="button"
                color="textblack"
                onClick={() => resetForm()}
              >
                Reset
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
