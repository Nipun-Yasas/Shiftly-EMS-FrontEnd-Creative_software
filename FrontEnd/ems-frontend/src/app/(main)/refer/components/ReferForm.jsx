import { useRef, useState } from "react";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Formik, Form, Field } from "formik";
import { Stack, Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

const vacancyOptions = [
  { id: 1, name: "Software Engineer" },
  { id: 2, name: "HR" },
];

const Item = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
}));

export default function ReferForm(props) {
  const { setOpenSubmit } = props;

  const resumeRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");

  return (
    <>
      <Formik
        initialValues={{
          vacancy: "",
          applicantname: "",
          applicantemail: "",
          message: "",
          resume: null,
        }}
        validate={(values) => {
          const errors = {};
          if (!values.vacancy) {
            errors.vacancy = "Vacancy is required";
          }
          if (!values.applicantname) {
            errors.applicantname = "Applicant name is required";
          }
          if (!values.applicantemail) {
            errors.applicantemail = "Applicant email is required";
          }
          if (!values.message) {
            errors.message = "Message is required";
          }
          if (!values.resume) {
            errors.resume = "resume is required";
          }
          return errors;
        }}
        onSubmit={(values, { resetForm }) => {
          console.log("Submitted:", values);
          resetForm();
          setFileName("");
          setPreview(null);
          if (resumeRef.current) {
            resumeRef.current.value = "";
          }
        }}
      >
        {({
          errors,
          touched,
          setFieldTouched,
          setFieldValue,
          values,
          validateForm,
          isValid,
          resetForm,
        }) => (
          <Form>
            <Stack>
              <Item>
                <div className="relative">
                  <Listbox
                    value={values.vacancy}
                    onChange={(selectedOption) => {
                      setFieldValue("vacancy", selectedOption.name);
                      setFieldTouched("vacancy", true, false);
                      console.log(selectedOption);
                    }}
                  >
                    <div className="relative">
                      <ListboxButton
                        name="vacancy"
                        onBlur={() => {
                          setFieldTouched("vacancy", true, true);
                        }}
                        className={`grid w-full px-1 text-left focus:outline-none border-b-2 ${
                          errors.vacancy && touched.vacancy
                            ? "border-red-500"
                            : values.vacancy
                              ? "border-gray-400"
                              : "focus:border-(color:--primary) border-gray-400"
                        }`}
                      >
                        <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                          <span
                            className={`block truncate  ${
                              !values.vacancy ? "text-gray-400" : ""
                            }`}
                          >
                            {values.vacancy || "Select a vacancy"}
                          </span>
                        </span>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        />
                      </ListboxButton>

                      <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto bg-white py-1 text-base shadow-lg sm:text-sm">
                        {vacancyOptions.map((option) => (
                          <ListboxOption
                            key={option.id}
                            value={option}
                            className="group relative py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-gray-300 data-focus:text-white"
                          >
                            <div className="flex items-center">
                              <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                                {option.name}
                              </span>
                            </div>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600 group-not-data-selected:hidden group-data-focus:text-white">
                              <CheckIcon
                                aria-hidden="true"
                                className="size-5"
                              />
                            </span>
                          </ListboxOption>
                        ))}
                      </ListboxOptions>
                    </div>
                  </Listbox>
                  {errors.vacancy && touched.vacancy && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.vacancy}
                    </p>
                  )}
                </div>
              </Item>

              <Item>
                <Field
                  name="applicantname"
                  type="text"
                  placeholder="Enter Applicant name"
                  className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--primary) focus:border-(color:--primary)${
                    errors.applicantname && touched.applicantname
                      ? "border-b-2 border-red-500"
                      : ""
                  }`}
                />
                {errors.applicantname && touched.applicantname && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.applicantname}
                  </p>
                )}
              </Item>
              <Item>
                <Field
                  name="applicantemail"
                  type="text"
                  placeholder="Enter Applicant email"
                  className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--primary) focus:border-(color:--primary)${
                    errors.applicantemail && touched.applicantemail
                      ? "border-b-2 border-red-500"
                      : ""
                  }`}
                />
                {errors.applicantemail && touched.applicantemail && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.applicantemail}
                  </p>
                )}
              </Item>

              <Item>
                <Field
                  name="message"
                  type="text"
                  as="textarea"
                  rows="3"
                  placeholder="Write a message"
                  className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--primary) focus:border-(color:--primary) ${
                    errors.message && touched.message ? "border-red-500" : ""
                  }`}
                />
                {errors.message && touched.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </Item>

              <Item>
                <Box display="flex" justifyContent="center" width="100%">
                  {errors.resume && touched.resume && (
                    <Typography color="error" fontSize="0.875rem" mt={2} mx={2}>
                      {errors.resume}
                    </Typography>
                  )}
                  <Box width="50%">
                    <input
                      ref={resumeRef}
                      type="file"
                      id="resume"
                      name="resume"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFieldValue("resume", file);
                          setFileName(file.name);
                          const fileType = file.type;

                          if (fileType.startsWith("image/")) {
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onloadend = () => {
                              setPreview({
                                type: "image",
                                url: reader.result,
                              });
                            };
                          } else if (fileType === "application/pdf") {
                            const url = URL.createObjectURL(file);
                            setPreview({ type: "pdf", url });
                          } else {
                            setPreview(null);
                          }
                        }
                      }}
                      style={{ display: "none" }}
                    />

                    <Item>
                      <label htmlFor="resume">
                        <Button
                          color="canclebtn"
                          variant="outlined"
                          component="span"
                          startIcon={
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="size-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                              />
                            </svg>
                          }
                          fullWidth
                          sx={{
                            borderColor:
                              errors.resume && touched.resume
                                ? "error.main"
                                : "grey.400",
                            px: 2,
                            py: 1.5,
                            textTransform: "none",
                          }}
                        >
                          Upload Resume
                        </Button>
                      </label>
                    </Item>
                  </Box>
                </Box>

                <Item>
                  {preview ? (
                    preview.type === "image" ? (
                      <Box
                        component="img"
                        src={preview.url}
                        alt="Resume Preview"
                        sx={{ width: "100%", height: 192, objectFit: "cover" }}
                      />
                    ) : preview.type === "pdf" ? (
                      <Box
                        component="iframe"
                        src={preview.url}
                        sx={{
                          width: "100%",
                          height: 192,
                          border: "1px solid #ccc",
                        }}
                        title="PDF Preview"
                      />
                    ) : null
                  ) : (
                    fileName && (
                      <p className="text-red-500 text-sm mt-1">{{fileName}}</p>
                      
                    )
                  )}
                </Item>
              </Item>

              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Button
                  color="canclebtn"
                  type="reset"
                  onClick={() => {
                    resetForm();
                    setFileName("");
                    setPreview(null);
                    if (resumeRef.current) {
                      resumeRef.current.value = "";
                    }
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={Object.keys(errors).length > 0}
                  onClick={() => {
                    validateForm;
                    if (isValid) {
                      setOpenSubmit(true);
                    }
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
