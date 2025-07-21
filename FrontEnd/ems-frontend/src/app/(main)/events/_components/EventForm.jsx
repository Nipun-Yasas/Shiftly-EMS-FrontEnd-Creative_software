"use client";

import { useRef, useState } from "react";

import { Formik, Form } from "formik";

import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import InputItem from "../../../_components/inputs/InputItem";
import TextInput from "../../../_components/inputs/TextInput";
import SelectInput from "../../../_components/inputs/SelectInput";
import FileUpload from "../../../_components/inputs/FileUpload";
import DateInput from "../../../_components/inputs/DateInput";
import CustomCheckBox from "../../../_components/inputs/CustomCheckBox";

const audienceOptions = [
  { id: 1, name: "Software Engineer" },
  { id: 2, name: "HR" },
];
const eventTypeOptions = [
  { id: 1, name: "All" },
  { id: 2, name: "Managers only" },
];

export default function EventForm(props) {
  const { setOpenSubmit } = props;

  const bannerRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");

  // const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:8080/event/add",
  //       values
  //     );
  //     console.log(response.data);

  //     if (response.status === 200) {
  //       setOpenMessage(true);
  //       setStatus("success");
  //     }
  //   } catch (error) {
  //     setStatus(error);
  //     console.log({ error });
  //   } finally {
  //     setSubmitting(false);
  //     resetForm();
  //     setFileName("");
  //     setPreview(null);
  //     if (bannerRef.current) {
  //       bannerRef.current.value = "";
  //     }
  //   }
  // };

  return (
    <>
      <Formik
        initialValues={{
          title: "",
          actionbtn: "",
          showTitle: false,
          formUrl: "",
          responseUrl: "",
          audience: null,
          projects: "",
          eventType: null,
          enableDate: "",
          expireDate: "",
          banner: null,
        }}
        validate={(values) => {
          const errors = {};
          if (!values.title) {
            errors.title = "Title is required";
          }
          if (!values.actionbtn) {
            errors.actionbtn = "Action Button text is required";
          }
          if (!values.formUrl) {
            errors.formUrl = "URL of the form(Eg: Google form) is required";
          }
          if (!values.responseUrl) {
            errors.responseUrl = "Response URL of the form is required";
          }
          if (!values.audience) {
            errors.audience = "Select a Audience";
          }
          if (!values.projects) {
            errors.projects = "Project is required";
          }
          if (!values.eventType) {
            errors.eventType = "Event type is required";
          }
          if (!values.enableDate) {
            errors.enableDate = "Starting date is required";
          }
          if (!values.expireDate) {
            errors.expireDate = "Ending date is required";
          }
          if (!values.banner) {
            errors.banner = "Banner is required";
          }
          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          setOpenSubmit(true);
          resetForm();
          setFileName("");
          setPreview(null);
          if (bannerRef.current) {
            bannerRef.current.value = "";
          }
        }}
      >
        {({ validateForm, resetForm }) => (
          <Form>
            <Stack>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: { xs: 0, sm: 2 },
                }}
              >
                <InputItem>
                  <TextInput name="title" label="Title" />
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
                    name="eventType"
                    label="Select a Event type"
                    options={eventTypeOptions}
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
                  m: 2,
                }}
              >
                <DateInput name="enableDate" label="Start Date" />
                <DateInput name="expireDate" label="Expire Date" />
              </Box>

              <FileUpload
                name="banner"
                label="Upload Banner"
                fileTypes=".jpg,.jpeg,.png"
                fileName={fileName}
                setFileName={setFileName}
                preview={preview}
                setPreview={setPreview}
              />

              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "flex-end" },
                  pb: 2,
                  gap: 2,
                }}
              >
                <Button
                  color="text.primary"
                  type="reset"
                  onClick={() => {
                    resetForm();
                    setFileName("");
                    setPreview(null);
                    if (bannerRef.current) {
                      bannerRef.current.value = "";
                    }
                  }}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  variant="contained"
                  onClick={() => {
                    validateForm();
                  }}
                >
                  Add
                </Button>

              </Box>
            </Stack>
          </Form>
        )}
      </Formik>
    </>
  );
}
