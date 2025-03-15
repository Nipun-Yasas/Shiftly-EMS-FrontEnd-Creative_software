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
        audience: "",
        type: "",
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
      onSubmit={(values) => {
        alert(JSON.stringify(values, null, 2));
      }}
    >
      {({ errors, touched, setTouched, setFieldValue, values }) => (
        <Form>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <Field
                name="title"
                type="text"
                placeholder="Title"
                className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--my1) focus:border-(color:--my1)${
                  errors.title && touched.title
                    ? "border-b-2 border-red-500"
                    : ""
                }`}
              />
              {errors.title && touched.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}

            <div className="sm:col-span-full">
              <div className="relative">
                <Listbox
                  value={values.audience}
                  onChange={(selectedOption) => {
                    setFieldValue("audience", selectedOption.name);
                    setTouched({ audience: true }, false);
                    setFieldTouched("audience", true,true);
                  }}
                >
                  <div className="relative">
                    <ListboxButton
                      name="audience"
                      onBlur={() => {
                        setTouched({ audience: true }, true);
                      }}
                      className={`grid w-full px-1 text-left border-b-2 border-gray-400 focus:outline-none focus:placeholder-(color:--my1) focus:border-(color:--my1)${
                        errors.audience && touched.audience
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                        <span
                          className={`block truncate ${
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
                className={`w-full px-1 text-base text-gray-900 border-b-2 border-gray-400 placeholder:text-gray-400 focus:outline-none focus:placeholder-(color:--my1) focus:border-(color:--my1) ${
                  errors.project && touched.project
                    ? "border-red-500"
                    : ""
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
                    setTouched({ type: true }, false);
                  }}
                >
                  <div className="relative">
                    <ListboxButton
                      name="type"
                      onBlur={() => {
                        setTouched({ type: true }, true);
                      }}
                      className={`grid w-full text-left border-b-2 border-gray-400 ${
                        errors.type && touched.type
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
                        <span
                          className={`block truncate ${
                            !values.type ? "text-gray-400" : ""
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
            
            </div>

            <div className="sm:col-span-full">
              <div className="px-4 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md px-3  text-sm font-semibold text-(color:--my1) shadow-xs hover:bg-gray-100 sm:ml-3 sm:w-auto"
                >
                  Add
                </button>
                <button
                  type="button"
                  data-autofocus
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 text-sm font-semibold text-gray-900  shadow-xs ring-gray-300 ring-inset hover:bg-gray-100 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
}
