import react from "react";

import { useRef, useState } from "react";

import { Label,Listbox,ListboxButton,ListboxOption,ListboxOptions } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";

import { Formik, Form, Field } from "formik";

const vacancyOptions = [
  { id: 1, name: "Software Engineer" },
  { id: 2, name: "HR" },
];

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
            <div className="grid mt-2 grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 w-full">
              <div className="sm:col-span-full">
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
                            : "focus:border-(color:--my1) border-gray-400"
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
              </div>

              <div className="sm:col-span-full">
                <Field
                  name="applicantname"
                  type="text"
                  placeholder="Enter Applicant name"
                  className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--my1) focus:border-(color:--my1)${
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
              </div>
              <div className="sm:col-span-full">
                <Field
                  name="applicantemail"
                  type="text"
                  placeholder="Enter Applicant email"
                  className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--my1) focus:border-(color:--my1)${
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
              </div>

              <div className="sm:col-span-full">
                <Field
                  name="message"
                  type="text"
                  as="textarea"
                  rows="3"
                  placeholder="Write a message"
                  className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--my1) focus:border-(color:--my1) ${
                    errors.message && touched.message ? "border-red-500" : ""
                  }`}
                />
                {errors.message && touched.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <div className="sm:col-span-full">
                <div className="flex justify-center w-full">
                  {errors.resume && touched.resume && (
                    <p className="text-red-500 text-sm mt-2 mx-5">
                      {errors.resume}
                    </p>
                  )}
                  <div className="w-1/2">
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
                      className="hidden"
                    />
                    <div className="flex justify-center">
                      <label
                        htmlFor="resume"
                        className={`flex bg-white border-2 border-gray-400 px-4 py-2 rounded-md text-gray-400 text-center cursor-pointer hover:bg-gray-100
                        ${
                        errors.resume && touched.resume
                        ? "border-red-500"
                        : ""
                        }`}
                      >
                        <img
                          src="/upload.png"
                          alt="Upload Icon"
                          className="w-5 h-5 mr-3"
                        />
                        Upload Resume
                      </label>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-full mt-5 flex flex-col items-center">
                  {preview ? (
                    preview.type === "image" ? (
                      <img
                        src={preview.url}
                        alt="Resume Preview"
                        className="w-full h-48 object-cover"
                      />
                    ) : preview.type === "pdf" ? (
                      <iframe
                        src={preview.url}
                        className="w-full h-48 border"
                        title="PDF Preview"
                      />
                    ) : null
                  ) : (
                    fileName && (
                      <p className="mt-2 text-gray-700 text-sm text-center">
                        {fileName}
                      </p>
                    )
                  )}
                </div>
              </div>
              <div className="sm:col-span-full">
                <div className="px-4 flex justify-end">
                  <button
                    type="reset"
                    onClick={() => {
                      resetForm();
                      setFileName("");
                      setPreview(null);
                      if (resumeRef.current) {
                        resumeRef.current.value = "";
                      }
                    }}
                    className="justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-gray-300 ring-inset hover:bg-gray-300 sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid}
                    onClick={() => {
                      validateForm;
                      if (isValid) {
                        setOpenSubmit(true);
                      }
                    }}
                    className={`justify-center ml-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-gray-300 ring-inset sm:w-auto ${
                      !isValid
                        ? "cursor-not-allowed"
                        : "hover:bg-gray-300 cursor-pointer"
                    }`}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
