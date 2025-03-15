"use client";

import React from "react";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { DataGrid } from "@mui/x-data-grid";

import {Dialog,DialogBackdrop,DialogPanel,DialogTitle} from "@headlessui/react";

import { PlusIcon } from "@heroicons/react/20/solid";
import { Formik, Form, Field} from "formik";

const rows = [
  {
    id: 1,
    col1: "Hello",
    col2: "World",
    col3: "Hello",
    col4: "World",
    col5: "Hello",
    col6: "World",
    col7: "Hello",
    col8: "World",
  },
  {
    id: 2,
    col1: "Hello",
    col2: "World",
    col3: "Hello",
    col4: "World",
    col5: "Hello",
    col6: "World",
    col7: "Hello",
    col8: "World",
  },
  {
    id: 3,
    col1: "Hello",
    col2: "World",
    col3: "Hello",
    col4: "World",
    col5: "Hello",
    col6: "World",
    col7: "Hello",
    col8: "World",
  },
];

const columns = [
  { field: "col1", headerName: "Title", width: 150 },
  { field: "col2", headerName: "Form URL", width: 150 },
  { field: "col3", headerName: "Response URl", width: 150 },
  { field: "col4", headerName: "audience", width: 150 },
  { field: "col5", headerName: "Event Type", width: 150 },
  { field: "col6", headerName: "Projects", width: 150 },
  { field: "col7", headerName: "Created date", width: 150 },
  { field: "col8", headerName: "Expire date", width: 150 },
];

const audience = [
  { id: 1, name: "Software Engineer" },
  { id: 2, name: "HR" },
];

const eventType = [
  { id: 1, name: "All" },
  { id: 2, name: "Managers only" },
];

export default function Event() {

  const [openSubmit, setOpenSubmit] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  return (
    <>
      <div>
        <h2 className="text-(color:--my1) text-4xl font-bold">Events</h2>
        <p className="text-gray-500">
          Events <span className="text-gray-500">&gt;</span>
        </p>
        <div className="flex flex-col items-center">
          <div className="w-5/6 shadow-2xl rounded-xl">
            <div className="flex justify-end m-3">
              <button
                onClick={() => {
                  setOpenForm(true);
                }}
                className="mx-2 bg-(color:--my1) shadow-xl rounded-full w-8 h-8 text-white"
              >
                <PlusIcon
                  aria-hidden="true"
                  className="m-2 text-white sm:size-4 "
                />
              </button>
            </div>
            <div className="flex justify-center mt-2 m-3">
              <div style={{ height: 300, width: "100%" }}>
                <DataGrid rows={rows} columns={columns} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={openForm}
        onClose={() => setOpenForm(false)}
        className="relative z-10 w-full "
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative top-13 sm:top-10 transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 w-full sm:w-5/6 lg:w-2/3 md:w-5/6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <div className="flex justify-between">
                    <DialogTitle
                      as="h3"
                      className="text-xl mb-5 font-semibold text-gray-900"
                    >
                      Add events
                    </DialogTitle>
                    <div className="flex justify-end">
                      <button onClick={() => setOpenForm(false)}>
                        <FontAwesomeIcon
                          icon={faTimes}
                          className="w-auto h-auto"
                        />
                      </button>
                    </div>
                  </div>

                  <Formik
                    initialValues={{
                      title: "",
                      actionbtn: "",
                      showtitle: false,
                      url: "",
                      resurl: "",
                      audience: "",
                      project: "",
                      type: "",
                      startdate: "",
                      enddate: "",
                      banner: "",
                    }}
                    validate={(values) => {
                      const errors = {};
                      if (!values.title) {
                        errors.title = "Enter title";
                      }
                      if (!values.actionbtn) {
                        errors.actionbtn = "Enter Action Button text";
                      }
                      if (!values.toggle) {
                        errors.toggle = "Select a audience";
                      }
                      if (!values.url) {
                        errors.url = "Enter URL of the form(Eg: Google form)";
                      }
                      if (!values.resurl) {
                        errors.resurl = "Enter Response URL of the form";
                      }
                      if (!values.audience) {
                        errors.audience = "Select a audience";
                      }
                      if (!values.project) {
                        errors.project = "Enter project";
                      }
                      if (!values.type) {
                        errors.type = "Select a event type";
                      }
                      if (!values.startdate) {
                        errors.startdate = "Select starting date";
                      }
                      if (!values.enddate) {
                        errors.enddate = "Select ending date";
                      }
                      if (!values.banner) {
                        errors.banner = "Select a Banner";
                      }
                      return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                      setTimeout(() => {
                        alert(JSON.stringify(values, null, 2));
                        setSubmitting(false);
                      }, 400);
                    }}
                  >
                    {({
                      values,
                      errors,
                      touched,
                      isSubmitting,
                    }) => (
                      <Form>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                          <div className="sm:col-span-3">
                            <Field
                              id="title"
                              name="title"
                              type="text"
                              placeholder={
                                errors.title && touched.title
                                  ? errors.title
                                  : "Title"
                              }
                              className={`block w-full bg-white px-1 text-base text-gray-900 border-b-2 border-gray-300 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--my1) focus:border-(color:--my1) sm:text-sm/6 ${
                                errors.title && touched.title
                                  ? "placeholder:text-red-500"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <Field
                              id="actionbtn"
                              name="actionbtn"
                              type="text"
                              placeholder={
                                errors.actionbtn && touched.actionbtn
                                  ? errors.actionbtn
                                  : "Action Button Text"
                              }
                              className={`block w-full bg-white px-1 text-base text-gray-900 border-b-2 border-gray-300 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--my1) focus:border-(color:--my1) sm:text-sm/6 ${
                                errors.actionbtn && touched.actionbtn
                                  ? "placeholder:text-red-500"
                                  : ""
                              }`}
                            />
                          </div>

                          <div className="sm:col-span-full mt-2 mb-2">
                            <label>
                              <Field
                                type="checkbox"
                                name="showtitle"
                                className="mr-2"
                              />
                              Show title on the Event Banner
                            </label>
                          </div>

                          <div className="sm:col-span-full">
                            <Field
                              id="url"
                              name="url"
                              type="text"
                              placeholder={
                                errors.url && touched.url
                                  ? errors.url
                                  : "URL of the form(Eg: Google form)"
                              }
                              className={`block w-full bg-white px-1 py-1.5 text-base text-gray-900 border-b-2 border-gray-300 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--my1) focus:border-(color:--my1) sm:text-sm/6 ${
                                errors.url && touched.url
                                  ? "placeholder:text-red-500"
                                  : ""
                              }`}
                            />
                          </div>

                          <div className="sm:col-span-full">
                            <Field
                              id="resurl"
                              name="resurl"
                              type="text"
                              placeholder={
                                errors.resurl && touched.resurl
                                  ? errors.resurl
                                  : "Response URL of the form"
                              }
                              className={`block w-full bg-white px-1 py-1.5 text-base text-gray-900 border-b-2 border-gray-300 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--my1) focus:border-(color:--my1) sm:text-sm/6 ${
                                errors.resurl && touched.resurl
                                  ? "placeholder:text-red-500"
                                  : ""
                              }`}
                            />
                          </div>

                          <div className="sm:col-span-full">
                            <Field
                            id="audience"
                              name="audience"
                              as="select"
                              className={`w-full py-1.5 border-b-2 text-gray-400 bg-white focus:outline-none sm:text-sm ${
                                errors.audience && touched.audience
                                  ? "border-red-500 text-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <option value="" disabled hidden>
                                {errors.audience && touched.audience
                                  ? errors.audience
                                  : "Select an Audience"}
                              </option>
                              {audience.map((option) => (
                                <option key={option.id} value={option.name} className="text-black focus:hover:bg-red-500">
                                  {option.name}
                                </option>
                              ))}
                            </Field>
                          </div>

                          <div className="sm:col-span-full">
                            <Field
                              
                              name="project"
                              type="text"
                              placeholder={
                                errors.project && touched.project
                                  ? errors.project
                                  : "Project"
                              }
                              className={`block w-full bg-white px-1 py-1.5 text-base text-gray-900 border-b-2 border-gray-300 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--my1) focus:border-(color:--my1) sm:text-sm/6 ${
                                errors.project && touched.project
                                  ? "placeholder:text-red-500"
                                  : ""
                              }`}
                            />
                          </div>

                          <div className="sm:col-span-full">
                            <Field
                              name="type"
                              as="select"
                              className={`w-full px-2 py-1.5 border-b-2 text-gray-900 bg-white focus:outline-none sm:text-sm ${
                                errors.type && touched.type
                                  ? "border-red-500 text-red-500"
                                  : "border-gray-300"
                              }`}
                            >
                              <option value="" disabled hidden>
                                {errors.type && touched.type
                                  ? errors.type
                                  : "Select an event type"}
                              </option>
                              {eventType.map((eventType) => (
                                <option
                                  key={eventType.id}
                                  value={eventType.name}
                                >
                                  {eventType.name}
                                </option>
                              ))}
                            </Field>
                          </div>

                          <div className="sm:col-span-3">
                            <Field
                              id="startdate"
                              name="startdate"
                              type="text"
                              onFocus={(e) => (e.target.type = "date")}
                              onBlur={(e) => (e.target.type = "text")}
                              placeholder={
                                errors.startdate && touched.startdate
                                  ? errors.startdate
                                  : "Select a Date"
                              }
                              className={`block p-1 w-full bg-white px-1 text-base text-gray-900 border-b-2 border-gray-300 placeholder-gray-400 focus:outline-none focus:border-[--my1] sm:text-sm pr-10 appearance-none sm:text-sm/6 ${
                                errors.startdate && touched.startdate
                                  ? "placeholder:text-red-500"
                                  : ""
                              }`}
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <Field
                              id="btext"
                              name="btext"
                              type="text"
                              onFocus={(e) => (e.target.type = "date")}
                              onBlur={(e) => (e.target.type = "text")}
                              placeholder="Select a Date"
                              autoComplete="off"
                              className="block p-1 w-full bg-white px-1 text-base text-gray-900 border-b-2 border-gray-300 placeholder-gray-400 focus:outline-none focus:border-[--my1] sm:text-sm pr-10 appearance-none"
                            />
                          </div>
                          <div className="sm:col-span-full">
                            <div className="flex justify-end">
                              <Field
                                type="file"
                                id="banner"
                                name="banner"
                                accept="image/*"
                                onChange={(e) => {
                                  const fileName = e.target.files.length
                                    ? e.target.files[0].name
                                    : "";
                                  document.getElementById(
                                    "banner-label"
                                  ).innerText = fileName;
                                }}
                                className="hidden"
                              />
                              <label
                                id="banner-label"
                                htmlFor="banner"
                                className={`flex bg-white border border-gray-900 px-4 py-2 rounded-md text-gray-600 text-center cursor-pointer hover:bg-gray-100
                                    ${
                                      errors.banner && touched.banner
                                        ? "border-red-500"
                                        : ""
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
                          <div className="sm:col-span-full">
                            <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                
                                className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-(color:--my1) shadow-xs hover:bg-gray-100 sm:ml-3 sm:w-auto"
                              >
                                Add
                              </button>
                              <button
                                type="button"
                                data-autofocus
                                onClick={() => setOpenForm(false)}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900  shadow-xs ring-gray-300 ring-inset hover:bg-gray-100 sm:mt-0 sm:w-auto"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={openSubmit}
        onClose={() => setOpenSubmit(false)}
        className="relative z-10"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in w-full max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white mt-5 pt-5  ">
                <div className="mt-5 pt-5 text-center">
                  <DialogTitle
                    as="h3"
                    className="text-center font-bold text-lg text-(color:--my1)"
                  >
                    EVENT ADDED SUCCESSFULLY
                  </DialogTitle>
                </div>
              </div>
              <div className="px-4 py-3 flex justify-end ">
                <button
                  type="button"
                  onClick={() => {
                    setOpenSubmit(false);
                    setOpenForm(false);
                  }}
                  className="mt-5 rounded-md px-3 py-2 text-(color:--closebtn) font-semibold shadow-xs hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
