"use client";

import { useEffect, useState } from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputItem from "../../../_components/inputs/InputItem";
import TextInput from "../../../_components/inputs/TextInput";
import SelectInput from "../../../_components/inputs/SelectInput";
import DateInput from "../../../_components/inputs/DateInput";

const leaveOptions = [
  { id: 1, name: "Casual Leave", value: "casual" },
  { id: 2, name: "Sick Leave", value: "sick" },
  { id: 3, name: "Vacation Leave", value: "vacation" },
  { id: 4, name: "Maternity Leave", value: "maternity" },
  { id: 5, name: "Other", value: "other" },
];

export default function LeaveForm({
  edit = false,
  handleSubmit,
  initialValues,
  employees,
}) {
  const validationSchema = Yup.object({
    leaveType: Yup.mixed()
      .transform((val) => (val && typeof val === "object" ? val.value : val))
      .required("Leave Type is required")
      .typeError("Leave Type must be a string"),
    leaveFrom: Yup.date().required("Start date is required"),
    leaveTo: Yup.date()
      .min(Yup.ref("leaveFrom"), "End date must be after start date")
      .required("End date is required"),
    duration: Yup.number()
      .typeError("Must be a number")
      .required("Duration is required"),
    coverPersonId: Yup.mixed()
      .transform((val) => {
        if (val && typeof val === "object") {
          return String(val.userId ?? val.id ?? val.employeeId ?? "");
        }
        return val;
      })
      .required("Cover person is required")
      .typeError("Cover person must be a string"),
    reason: Yup.string().required("Leave reason is required"),
  });

  const calculateDuration = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);
    if (from && to && start <= end) {
      const diffTime = Math.abs(end - start);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return "";
  };

  return (
    <Box>
      <Formik
        initialValues={
          initialValues || {
            leaveType: null,
            leaveFrom: "",
            leaveTo: "",
            duration: "",
            coverPersonId: null,
            reason: "",
          }
        }
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, resetForm, isSubmitting }) => {
          useEffect(() => {
            const duration = calculateDuration(
              values.leaveFrom,
              values.leaveTo
            );
            if (duration !== "") {
              setFieldValue("duration", duration);
            }
          }, [values.leaveFrom, values.leaveTo, setFieldValue]);

          return (
            <Form>
              <Stack spacing={3} sx={{ m: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 0, sm: 2 },
                  }}
                >
                  <InputItem>
                    <SelectInput
                      name="leaveType"
                      label="Leave Type"
                      options={leaveOptions}
                      getOptionLabel={(option) => option.name || ""}
                    />
                  </InputItem>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 0, sm: 2 },
                  }}
                >
                  <InputItem>
                    <DateInput
                      name="leaveFrom"
                      disablePast={true}
                      label="Leave From"
                    />
                  </InputItem>
                  <InputItem>
                    <DateInput
                      name="leaveTo"
                      disablePast={true}
                      label="Leave To"
                    />
                  </InputItem>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 0, sm: 2 },
                  }}
                >
                  <InputItem>
                    <TextInput
                      name="duration"
                      label="Leave Duration"
                      disabled
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </InputItem>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 0, sm: 2 },
                  }}
                >
                  <InputItem>
                    <SelectInput
                      name="coverPersonId"
                      label="Cover Person"
                      options={employees}
                      getOptionLabel={(option) =>
                        option?.fullName ||
                        option?.employeeName ||
                        option?.name ||
                        ""
                      }
                      isOptionEqualToValue={(a, b) =>
                        (a?.userId ?? a?.id ?? a?.employeeId) ===
                        (b?.userId ?? b?.id ?? b?.employeeId)
                      }
                    />
                  </InputItem>
                </Box>

                <InputItem>
                  <TextInput
                    name="reason"
                    label="Leave Reason"
                    multiline
                    rows={3}
                  />
                </InputItem>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "center", md: "flex-end" },
                    gap: 2,
                  }}
                >
                  <Button
                    color="text.primary"
                    type="button"
                    onClick={() => resetForm()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? edit
                        ? "Updating..."
                        : "Submitting..."
                      : edit
                        ? "Update"
                        : "Submit"}
                  </Button>
                </Box>
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}
