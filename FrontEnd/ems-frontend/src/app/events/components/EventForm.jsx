"use client";

import React from "react";
import { useRef, useState } from "react";

import { Formik, Form, Field } from "formik";
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import { Listbox,ListboxButton,ListboxOption,ListboxOptions } from "@headlessui/react";

import axios from "axios";
import SubmitDialog from "./SubmitDialog";

const audienceOptions = [
  { id: 1, name: "Software Engineer" },
  { id: 2, name: "HR" },
];
const eventTypeOptions = [
  { id: 1, name: "All" },
  { id: 2, name: "Managers only" },
];

const EventForm = (props) => {
  
  const { openForm,setOpenForm } = props;
  const [openMessage, setOpenMessage] = useState(false);
  const [status, setStatus] = useState("");
  // const bannerRef = useRef(null);
  // const [preview, setPreview] = useState(null);
  // const [fileName, setFileName] = useState("");

  const handleSubmit = async (values,{setSubmitting,resetForm}) =>{
    try{
      const response = await axios.post("http://localhost:8080/event/add", values);
      console.log(response.data);

      if(response.status === 200){
        setOpenMessage(true);  
        setStatus('success');
    
      }
    }
    catch(error){
      setStatus(error);
      console.log({error})
    }
    finally{
      setSubmitting(false);
      resetForm();
          // setFileName("");
          // setPreview(null);
          // if (bannerRef.current) {
          //   bannerRef.current.value = "";
          // }
    }

  }

  return (
    <>
      <Formik
        initialValues={{
          title: "",
          actionbtn: "",
          showtitle: false,
          formUrl: "",
          responseUrl: "",
          audience: "",
          projects: "",
          eventType: "",
          enableDate: "",
          expireDate: "",
          // banner: null,
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
          // if (!values.banner) {
          //   errors.banner = "Banner is required";
          // }
          return errors;
        }}
        onSubmit={(values,{setSubmitting,resetForm}) => {
  
          console.log("Submitted:", values);
          handleSubmit(values,{resetForm,setSubmitting});
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
          isSubmitting,
          resetForm
        }) => (
          <Form>
            <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Field
                  name="title"
                  type="text"
                  placeholder="Title"
                  className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--primary) focus:border-(color:--primary)${
                    errors.title && touched.title
                      ? "border-b-2 border-red-500"
                      : ""
                  }`}
                />
                {errors.title && touched.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>
              <div className="sm:col-span-3">
                <Field
                  name="actionbtn"
                  type="text"
                  placeholder="Action Button Text"
                  className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--primary) focus:border-(color:--primary)${
                    errors.actionbtn && touched.actionbtn
                      ? "border-b-2 border-red-500"
                      : ""
                  }`}
                />
                {errors.actionbtn && touched.actionbtn && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.actionbtn}
                  </p>
                )}
              </div>

              <div className="sm:col-span-full mt-2 mb-2">
                <label>
                  <Field type="checkbox" name="showtitle" className="mr-2" />
                  Show title on the Event Banner
                </label>
              </div>

              <div className="sm:col-span-full">
                <Field
                  name="formUrl"
                  type="text"
                  placeholder="URL of the form(Eg: Google form)"
                  className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--primary) focus:border-(color:--primary) ${
                    errors.formUrl && touched.formUrl ? "border-red-500" : ""
                  }`}
                />
                {errors.formUrl && touched.formUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.formUrl}</p>
                )}
              </div>

              <div className="sm:col-span-full">
                <Field
                  name="responseUrl"
                  type="text"
                  placeholder="Response URL of the form"
                  className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--primary) focus:border-(color:--primary) ${
                    errors.responseUrl && touched.responseUrl
                      ? "border-b-2 border-red-500"
                      : ""
                  }`}
                />
                {errors.responseUrl && touched.responseUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.responseUrl}</p>
                )}
              </div>

              <div className="sm:col-span-full">
                <div className="relative">
                  <Listbox
                    value={values.audience}
                    onChange={(selectedOption) => {
                      setFieldValue("audience", selectedOption.name);
                      setFieldTouched("audience", true, false);
                    }}
                  >
                    <div className="relative">
                      <ListboxButton
                        name="audience"
                        onBlur={() => {
                          setFieldTouched("audience", true, true);
                        }}
                        className={`grid w-full px-1 text-left focus:outline-none border-b-2 ${
                          errors.audience && touched.audience
                            ? "border-red-500"
                            : values.audience
                            ? "border-gray-400"
                            : "focus:border-(color:--primary) border-gray-400"
                        }`}
                      >
                        <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                          <span
                            className={`block truncate  ${
                              !values.audience ? "text-gray-400" : ""
                            }`}
                          >
                            {values.audience || "Select a audience"}
                          </span>
                        </span>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        />
                      </ListboxButton>

                      <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto bg-white py-1 text-base shadow-lg sm:text-sm">
                        {audienceOptions.map((option) => (
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
                  {errors.audience && touched.audience && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.audience}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-full">
                <Field
                  name="projects"
                  type="text"
                  placeholder="Project"
                  className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--primary) focus:border-(color:--primary) ${
                    errors.projects && touched.projects ? "border-red-500" : ""
                  }`}
                />
                {errors.projects && touched.projects && (
                  <p className="text-red-500 text-sm mt-1">{errors.projects}</p>
                )}
              </div>

              <div className="sm:col-span-full">
                <div className="relative">
                  <Listbox
                    value={values.eventType}
                    onChange={(selectedOption) => {
                      setFieldValue("eventType", selectedOption.name);
                      setFieldTouched("eventType", true, false);
                    }}
                  >
                    <div className="relative">
                      <ListboxButton
                        name="eventType"
                        onBlur={() => {
                          setFieldTouched("eventType", true, true);
                        }}
                        className={`grid w-full px-1 text-left focus:outline-none border-b-2 ${
                          errors.eventType && touched.eventType
                            ? "border-red-500"
                            : values.eventType
                            ? "border-gray-400"
                            : "focus:border-(color:--primary) border-gray-400"
                        }`}
                      >
                        <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                          <span
                            className={`block truncate ${
                              !values.eventType ? "text-gray-400" : ""
                            }`}
                          >
                            {values.eventType || "Select a Event type"}
                          </span>
                        </span>
                        <ChevronDownIcon
                          aria-hidden="true"
                          className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                        />
                      </ListboxButton>

                      <ListboxOptions className="absolute z-10 mt-1 max-h-56 w-full overflow-auto bg-white py-1 text-base shadow-lg sm:text-sm">
                        {eventTypeOptions.map((option) => (
                          <ListboxOption
                            key={option.id}
                            value={option}
                            className="group relative py-2 pr-9 pl-3 text-gray-900 select-none outline-none data-focus:bg-gray-300 data-focus:text-white"
                          >
                            <div className="flex items-center">
                              <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                                {option.name}
                              </span>
                            </div>
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600 group-not-data-selected:hidden group-data-focus:text-white group-data-focus:bg-red-900">
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
                  {errors.eventType && touched.eventType && (
                    <p className="text-red-500 text-sm mt-1">{errors.eventType}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <Field
                  name="enableDate"
                  type="text"
                  onFocus={(e) => (e.target.type = "date")}
                  onBlur={(e) => {
                    e.target.type = "text";
                    setFieldTouched("enableDate", true, true);
                  }}
                  placeholder="Select a Starting Date"
                  className={`w-full bg-white px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder-gray-400 focus:outline-none focus:border-(color:--primary)  appearance-none ${
                    errors.enableDate && touched.enableDate
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {errors.enableDate && touched.enableDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.enableDate}
                  </p>
                )}
              </div>
              <div className="sm:col-span-3">
                <Field
                  name="expireDate"
                  type="text"
                  onFocus={(e) => {
                    e.target.type = "date";
                  }}
                  onBlur={(e) => {
                    e.target.type = "text";
                    setFieldTouched("expireDate", true, true);
                  }}
                  placeholder="Select a Ending Date"
                  className={`w-full bg-white px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder-gray-400 focus:outline-none focus:border-(color:--primary)  appearance-none ${
                    errors.expireDate && touched.expireDate ? "border-red-500" : ""
                  }`}
                />
                {errors.expireDate && touched.expireDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.expireDate}</p>
                )}
              </div>
              {/* <div className="sm:col-span-full">
                <div className="flex justify-center w-full">
                  {errors.banner && touched.banner && (
                    <p className="text-red-500 text-sm mt-2 mx-5">
                      {errors.banner}
                    </p>
                  )}
                  <div className="w-[30%]">
                    <input
                      ref={bannerRef}
                      type="file"
                      id="banner"
                      name="banner"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFieldValue("banner", file);
                          setFileName(file.name);

                          const reader = new FileReader();
                          reader.readAsDataURL(file);
                          reader.onloadend = () => {
                            setPreview(reader.result);
                          };
                        }
                      }}
                      className="hidden"
                    />
                    <div className="flex justify-center">
                    <label
                      id="banner-label"
                      htmlFor="banner"
                      className={`flex bg-white border-2 border-gray-400 px-4 py-2 rounded-md text-gray-400 text-center cursor-pointer hover:bg-gray-100
                      ${
                        errors.banner && touched.banner ? "border-red-500" : ""
                      }`}
                    >
                      <img
                        src="/upload.png"
                        alt="Upload Icon"
                        className="w-5 h-5 mr-3"
                      />
                      Upload Banner
                    </label>
                    </div>

                  </div>
                </div>
                <div className="sm:col-span-full mt-5">
                  {preview && (
                    <img
                      src={preview}
                      alt="Banner Preview"
                      className="w-full h-48 object-cover"
                    />
                  )}
                  {fileName && (
                    <p className="mt-2 text-gray-700 text-sm text-center">
                      {fileName}
                    </p>
                  )}
                </div>
              </div> */}

              <div className="sm:col-span-full">
                <div className="px-4 flex justify-end">
                  <button
                    type="reset"
                    disabled={isSubmitting}
                    onClick={() => {
                      resetForm();
                      setFileName("");
                      setPreview(null);
                      if (bannerRef.current) {
                        bannerRef.current.value = "";
                      }
                    }}
                    className="justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-(color:--primary) shadow-xs ring-gray-300 ring-inset hover:bg-gray-300 sm:w-auto"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid}
                    onClick={() => {
                      validateForm;
                      
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

      <SubmitDialog openMessage={openMessage} setOpenMessage={setOpenMessage} setOpenForm={setOpenForm} status={status} />
    </>
  );
}

export default EventForm;