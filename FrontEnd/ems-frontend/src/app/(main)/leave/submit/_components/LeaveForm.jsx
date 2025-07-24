"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import InputItem from "../../../../_components/inputs/InputItem";
import TextInput from "../../../../_components/inputs/TextInput";
import SelectInput from "../../../../_components/inputs/SelectInput";
import DateInput from "../../../../_components/inputs/DateInput";
import axiosInstance from "../../../../_utils/axiosInstance";
import { API_PATHS } from "../../../../_utils/apiPaths";

const leaveOptions = [
  { id: 1, name: "Casual Leave", value: "casual" },
  { id: 2, name: "Sick Leave", value: "sick" },
  { id: 3, name: "Vacation Leave", value: "vacation" },
  { id: 4, name: "Maternity Leave", value: "maternity" },
  { id: 5, name: "Other", value: "other" },
];

const LeaveForm = ({ onSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(leaveOptions[0]);

  const initialValues = {
    leave_type: leaveOptions[0].value,
    leave_from: "",
    leave_to: "",
    duration: "",
    cover_person: "",
    report_to: "",
    reason: "",
  };

  const validationSchema = Yup.object({
    leave_type: Yup.mixed()
      .transform((val) => (val && typeof val === "object" ? val.value : val))
      .required("Leave Type is required")
      .typeError("Leave Type must be a string"),
    leave_from: Yup.date().required("Start date is required"),
    leave_to: Yup.date()
      .min(Yup.ref("leave_from"), "End date must be after start date")
      .required("End date is required"),
    duration: Yup.number()
      .typeError("Must be a number")
      .required("Duration is required"),
    cover_person: Yup.string().required("Cover person is required"),
    report_to: Yup.string().required("Report person is required"),
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
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { resetForm }) => {
          try {
            setIsSubmitting(true);
            // Ensure leaveType is a string, not an object
            const leaveTypeValue =
              typeof values.leave_type === "object" &&
              values.leave_type !== null
                ? values.leave_type.value
                : values.leave_type;
            const payload = {
              leaveType: leaveTypeValue,
              leaveFrom: values.leave_from,
              leaveTo: values.leave_to,
              duration: values.duration,
              coverPersonName: values.cover_person,
              reportToName: values.report_to,
              reason: values.reason,
              leaveStatus: "PENDING",
            };
            await axiosInstance.post(API_PATHS.LEAVES.ADD_MY_LEAVE, payload);
            resetForm();
            setSelectedLeave(leaveOptions[0]);
            onSubmitSuccess();
          } catch (error) {
            console.error("Submit error:", error);
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        {({ values, setFieldValue }) => {
          useEffect(() => {
            const duration = calculateDuration(
              values.leave_from,
              values.leave_to
            );
            if (duration !== "") {
              setFieldValue("duration", duration);
            }
          }, [values.leave_from, values.leave_to, setFieldValue]);

          return (
            <Form>
              <Stack spacing={2}>
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
                      name="leave_type"
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
                      name="leave_from"
                      disablePast={true}
                      label="Leave From"
                    />
                  </InputItem>
                  <InputItem>
                    <DateInput
                      name="leave_to"
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
                    <TextInput name="cover_person" label="Cover Person" />
                  </InputItem>
                  <InputItem>
                    <TextInput name="report_to" label="Report to Person" />
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
                    pt: 2,
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Request Leave"}
                  </Button>

                  <Button
                    type="reset"
                    color="text.primary"
                    onClick={() => {
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default LeaveForm;
