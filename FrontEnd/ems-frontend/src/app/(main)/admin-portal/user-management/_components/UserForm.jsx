"use client";

import React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import * as Yup from "yup";
import SelectInput from "../../../../_components/inputs/SelectInput";
import InputItem from "../../../../_components/inputs/InputItem";

import { Formik, Form } from "formik";

const roles = [
  { id: 1, name: "ADMIN", label: "Admin" },
  { id: 2, name: "USER", label: "User" },
];

export const assignValidationSchema = Yup.object({
  roleId: Yup.object().required("Role is required"),
});

export default function UserForm({handleAssignSubmit,onCancel
}) {
  return (
    <Formik
    initialValues={
      {roleId: null}
    }
      validationSchema={assignValidationSchema}
      onSubmit={handleAssignSubmit}
      enableReinitialize
    >
      {({ isSubmitting, submitForm }) => (
        <Form>
          <Stack spacing={1}>
            <InputItem>
              <SelectInput
                name="roleId"
                label="User Role"
                options={roles}
                getOptionLabel={(option) => option.label}
              />
            </InputItem>
            <Stack
              direction="row"
              spacing={2}
              justifyContent={{ xs: "center", sm: "flex-end" }}
              width="100%"
            >
              {onCancel && (
                <Button color="text.primary" variant="text" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button
                onClick={submitForm}
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </Button>
            </Stack>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}
