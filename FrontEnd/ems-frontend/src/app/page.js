"use client";

import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { CheckIcon } from "@heroicons/react/20/solid";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Formik, Form, Field } from "formik";

const audienceOptions = [
  { id: 1, name: "Software Engineer" },
  { id: 2, name: "HR" },
];
const eventTypeOptions = [
  { id: 1, name: "All" },
  { id: 2, name: "Managers only" },
];

export default function App() {
  return (
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
          errors.title = "Title is required";
        }
        if (!values.actionbtn) {
          errors.actionbtn = "Action Button text is required";
        }
        if (!values.url) {
          errors.url = "URL of the form(Eg: Google form) is required";
        }
        if (!values.resurl) {
          errors.resurl = "Response URL of the form is required";
        }
        if (!values.audience) {
          errors.audience = "Select a Audience";
        }
        if (!values.project) {
          errors.project = "Project is required";
        }
        if (!values.type) {
          errors.type = "Event type is required";
        }
        if (!values.startdate) {
          errors.startdate = "Starting date is required";
        }
        if (!values.enddate) {
          errors.enddate = "Ending date is required";
        }
        if (!values.banner) {
          errors.banner = "Banner is required";
        }
        return errors;
      }}
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {({ errors, touched, setFieldTouched, setFieldValue, values }) => (
        <Form>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <Field
                name="title"
                type="text"
                placeholder="Title"
                className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--my1) focus:border-(color:--my1)${errors.title && touched.title
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
                className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--my1) focus:border-(color:--my1)${errors.actionbtn && touched.actionbtn
                    ? "border-b-2 border-red-500"
                    : ""
                  }`}
              />
              {errors.actionbtn && touched.actionbtn && (
                <p className="text-red-500 text-sm mt-1">{errors.actionbtn}</p>
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
                name="url"
                type="text"
                placeholder="URL of the form(Eg: Google form)"
                className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--my1) focus:border-(color:--my1) ${errors.url && touched.url ? "border-red-500" : ""
                  }`}
              />
              {errors.url && touched.url && (
                <p className="text-red-500 text-sm mt-1">{errors.url}</p>
              )}
            </div>

            <div className="sm:col-span-full">
              <Field
                name="resurl"
                type="text"
                placeholder="Response URL of the form"
                className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--my1) focus:border-(color:--my1) ${errors.resurl && touched.resurl
                    ? "border-b-2 border-red-500"
                    : ""
                  }`}
              />
              {errors.resurl && touched.resurl && (
                <p className="text-red-500 text-sm mt-1">{errors.resurl}</p>
              )}
            </div>

            <div className="sm:col-span-full">
              <div className="relative">
                <Listbox
                  value={values.audience}
                  onChange={(selectedOption) => {
                    setFieldValue("audience", selectedOption.name);
                    setFieldTouched("audience", true, false);
                    console.log(selectedOption);
                  }}
                >
                  <div className="relative">
                    <ListboxButton
                      name="audience"
                      onBlur={() => {
                        setFieldTouched("audience", true, true);
                      }}
                      className={`grid w-full px-1 text-left focus:outline-none border-b-2 ${errors.audience && touched.audience
                          ? "border-red-500"
                          : values.audience
                            ? "border-gray-400"
                            : "focus:border-(color:--my1) border-gray-400"
                        }`}
                    >
                      <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                        <span
                          className={`block truncate  ${!values.audience ? "text-gray-400" : ""
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
                          className="group relative py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-gray-400 data-focus:text-white"
                        >
                          <div className="flex items-center">
                            <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                              {option.name}
                            </span>
                          </div>
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600 group-not-data-selected:hidden group-data-focus:text-white">
                            <CheckIcon aria-hidden="true" className="size-5" />
                          </span>
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
                {errors.audience && touched.audience && (
                  <p className="text-red-500 text-sm mt-1">{errors.audience}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-full">
              <Field
                name="project"
                type="text"
                placeholder="Project"
                className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--my1) focus:border-(color:--my1) ${errors.project && touched.project ? "border-red-500" : ""
                  }`}
              />
              {errors.project && touched.project && (
                <p className="text-red-500 text-sm mt-1">{errors.project}</p>
              )}
            </div>

            <div className="sm:col-span-full">
              <div className="relative">
                <Listbox
                  value={values.type}
                  onChange={(selectedOption) => {
                    setFieldValue("type", selectedOption.name);
                    setFieldTouched("type", true, false);
                  }}
                >
                  <div className="relative">
                    <ListboxButton
                      name="type"
                      onBlur={() => {
                        setFieldTouched("type", true, true);
                      }}
                      className={`grid w-full px-1 text-left focus:outline-none border-b-2 ${errors.type && touched.type
                          ? "border-red-500"
                          : values.type
                            ? "border-gray-400"
                            : "focus:border-(color:--my1) border-gray-400"
                        }`}
                    >
                      <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                        <span
                          className={`block truncate ${!values.type ? "text-gray-400" : ""
                            }`}
                        >
                          {values.type || "Select a Event type"}
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
                          className="group relative py-2 pr-9 pl-3 text-gray-900 select-none outline-none data-focus:bg-gray-400 data-focus:text-white"
                        >
                          <div className="flex items-center">
                            <span className="ml-3 block truncate font-normal group-data-selected:font-semibold">
                              {option.name}
                            </span>
                          </div>
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-600 group-not-data-selected:hidden group-data-focus:text-white group-data-focus:bg-red-900">
                            <CheckIcon aria-hidden="true" className="size-5" />
                          </span>
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </div>
                </Listbox>
                {errors.type && touched.type && (
                  <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <Field
                name="startdate"
                type="text"
                onFocus={(e) => (e.target.type = "date")}
                onBlur={(e) => {
                  e.target.type = "text";
                  setFieldTouched("startdate", true, true);
                }}
                placeholder="Select a Starting Date"
                className={`w-full bg-white px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder-gray-400 focus:outline-none focus:border-(color:--my1)  appearance-none ${errors.startdate && touched.startdate ? "border-red-500" : ""
                  }`}
              />
              {errors.startdate && touched.startdate && (
                <p className="text-red-500 text-sm mt-1">{errors.startdate}</p>
              )}
            </div>
            <div className="sm:col-span-3">
              <Field
                name="enddate"
                type="text"
                onFocus={(e) => {
                  e.target.type = "date";
                }}
                onBlur={(e) => {
                  e.target.type = "text";
                  setFieldTouched("enddate", true, true);
                }}
                placeholder="Select a Ending Date"
                className={`w-full bg-white px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder-gray-400 focus:outline-none focus:border-(color:--my1)  appearance-none ${errors.enddate && touched.enddate ? "border-red-500" : ""
                  }`}
              />
              {errors.enddate && touched.enddate && (
                <p className="text-red-500 text-sm mt-1">{errors.enddate}</p>
              )}
            </div>
            <div className="sm:col-span-full">
              <div className="flex justify-end">
                {errors.banner && touched.banner && (
                  <p className="text-red-500 text-sm mt-2 mx-5">
                    {errors.banner}
                  </p>
                )}
                <Field
                  type="file"
                  id="banner"
                  name="banner"
                  accept="image/*"
                  onChange={(e) => {
                    const fileName = e.target.files.length
                      ? e.target.files[0].name
                      : "";
                    document.getElementById("banner-label").innerText =fileName;
                      console.log(banner.values);
                      
                  }}
                  
                  className="hidden"
                />
                <label
                  id="banner-label"
                  htmlFor="banner"
                  className={`flex bg-white border border-gray-900 px-4 py-2 rounded-md text-gray-600 text-center cursor-pointer hover:bg-gray-100
                    ${errors.banner &&
                      touched.banner
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
              <div className="px-4 flex justify-end">
                <button
                  type="reset"
                  className="justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-gray-300 ring-inset hover:bg-gray-300 sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-(color:--my1) shadow-xs ring-gray-300 ring-inset hover:bg-gray-300 sm:w-auto"
                  
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
