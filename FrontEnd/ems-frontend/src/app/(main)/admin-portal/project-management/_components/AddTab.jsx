import React from "react";
import Box from "@mui/material/Box";

import { Formik, Form } from "formik";

import ProjectForm, { projectValidationSchema } from "./ProjectForm";

export default function AddTab({
  onSubmit,
  initialFormValues,
  departments = [],
  teams = [],
  loadingDepartments = false,
  loadingTeams = false,
}) {
  return (
    <Box sx={{ p: 3, align: "space-between", height: "100%" }}>
      <Formik
        initialValues={initialFormValues}
        validationSchema={projectValidationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, resetForm }) => (
          <Form>
            <ProjectForm
              isSubmitting={isSubmitting}
              isEdit={false}
              showResetButton={true}
              resetForm={resetForm}
              departments={departments}
              teams={teams}
              loadingDepartments={loadingDepartments}
              loadingTeams={loadingTeams}
            />
          </Form>
        )}
      </Formik>
    </Box>
  );
}
