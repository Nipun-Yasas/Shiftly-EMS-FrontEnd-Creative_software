"use client";

import { useRef, useState } from "react";

import { Formik, Form } from "formik";
import * as Yup from "yup";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import InputItem from "../../../_components/inputs/InputItem";
import TextInput from "../../../_components/inputs/TextInput";
import SelectInput from "../../../_components/inputs/SelectInput";
import FileUpload from "../../../_components/inputs/FileUpload";
import DateInput from "../../../_components/inputs/DateInput";

const eventTypeOptions = [
  { id: 1, name: "Team Building" },
  { id: 2, name: "Corporate" },
  { id: 3, name: "Training" },
  { id: 4, name: "Social" },
  { id: 5, name: "Conference" },
  { id: 6, name: "Workshop" },
];

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Event title must be at least 3 characters")
    .max(100, "Event title must be less than 100 characters")
    .required("Event title is required"),

  eventType: Yup.object().nullable().required("Event type is required"),

  enableDate: Yup.date()
    .nullable()
    .typeError("Please enter a valid date")
    .required("Start date is required"),

  expireDate: Yup.date()
    .nullable()
    .typeError("Please enter a valid date")
    .required("End date is required")
    .when("enableDate", {
      is: (enableDate) =>
        enableDate && enableDate instanceof Date && !isNaN(enableDate),
      then: (schema) =>
        schema.min(Yup.ref("enableDate"), "End date must be after start date"),
      otherwise: (schema) => schema,
    }),

  image: Yup.mixed()
    .test(
      "fileType",
      "Only JPEG, JPG, and PNG files are allowed",
      function (value) {
        if (!value) return true;
        if (!(value instanceof File)) return true;
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        return allowedTypes.includes(value.type);
      }
    )
    .test("fileSize", "File size must be less than 5MB", function (value) {
      if (!value) return true;
      if (!(value instanceof File)) return true;
      return value.size <= 5 * 1024 * 1024;
    }),
});

export default function EventForm({
  edit = false,
  handleSubmit,
  initialValues,
}) {
  const bannerRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState(initialValues?.image || "");

  return (
    <Formik
      initialValues={
        initialValues || {
          title: "",
          eventType: null,
          enableDate: "",
          expireDate: "",
          image: null,
        }
      }
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize={edit}
      context={{ edit }}
      onReset={() => {
        setFileName("");
        setPreview(null);
        if (bannerRef.current) {
          bannerRef.current.value = "";
        }
      }}
    >
      {({ resetForm, isSubmitting }) => (
        <Form>
          <Stack spacing={3}>
            <InputItem>
              <TextInput name="title" label="Event Title" />
            </InputItem>

            <InputItem>
              <SelectInput
                name="eventType"
                label="Select Event Type"
                options={eventTypeOptions}
                getOptionLabel={(option) => option.name || ""}
              />
            </InputItem>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: { xs: "column", sm: "row" },
                gap: { xs: 0, sm: 2 },
              }}
            >
              <DateInput
                name="enableDate"
                label="Event Start Date"
                disablePast={true}
              />
              <DateInput
                name="expireDate"
                label="Event End Date"
                disablePast={true}
              />
            </Box>
            <InputItem>
              <FileUpload
                name="image"
                label="Upload Event Banner"
                fileTypes=".jpg,.jpeg,.png"
                fileName={fileName}
                setFileName={setFileName}
                preview={preview}
                setPreview={setPreview}
                inputRef={bannerRef}
              />
            </InputItem>

            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "center", md: "flex-end" },
                pb: 2,
                gap: 2,
              }}
            >
              <Button color="text.primary" type="reset" disabled={isSubmitting}>
                Cancel
              </Button>

              <Button type="submit" variant="contained" disabled={isSubmitting}>
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
      )}
    </Formik>
  );
}
