"use client";
import React, { useState } from "react";

/**
 * Component for updating timesheet entries
 * @returns {JSX.Element} The update timesheet section
 */
const UpdateTimesheet = () => {
  const [startDate, setStartDate] = useState("01/01/2023");
  const [endDate, setEndDate] = useState("01/01/2023");

  return (
    <section className="flex flex-col p-5 mb-5 bg-white rounded-2xl">
      <h2 className="text-xl text-black">Update Timesheet</h2>

      <div className="mb-5">
        <label
          htmlFor="week-select"
          className="mt-5 mb-2.5 text-xs text-black block"
        >
          Select the week
        </label>
        <div className="flex gap-3 items-center">
          <div className="relative w-[100px]">
            <label
              className="absolute -top-2 left-3 px-1 py-0 text-xs bg-white text-black text-opacity-60"
              htmlFor="start-date"
            >
              Start Date
            </label>
            <input
              id="start-date"
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 w-full text-sm rounded-xl border border-solid border-black border-opacity-20"
              aria-label="Start date"
            />
          </div>
          <span className="text-4xl leading-4 text-black" aria-hidden="true">
            -
          </span>
          <div className="relative w-[100px]">
            <label
              className="absolute -top-2 left-3 px-1 py-0 text-xs bg-white text-black text-opacity-60"
              htmlFor="end-date"
            >
              End Date
            </label>
            <input
              id="end-date"
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 w-full text-sm rounded-xl border border-solid border-black border-opacity-20"
              aria-label="End date"
            />
          </div>
          <button
            className="text-black cursor-pointer"
            aria-label="Open calendar"
          >
            <i className="ti ti-calendar" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex gap-5 pl-8 mb-5 max-md:flex-col">
        <ProjectSection />
        <WorkModeSection />
        <ActivitySection />
        <TimeEntrySection />
      </div>

      <div className="flex gap-3 items-center mt-5 max-sm:flex-wrap">
        <button
          className="flex gap-2 items-center px-4 py-0 h-9 text-sm text-blue-500 rounded-2xl border-2 border-blue-500 border-solid"
          aria-label="Add new row"
        >
          <i className="ti ti-plus" aria-hidden="true" />
          <span>Add row</span>
        </button>
        <button
          className="px-5 py-0 h-9 text-white bg-blue-500 rounded-2xl border-[none] ml-[653px]"
          aria-label="Save timesheet"
        >
          Save
        </button>
        <button
          className="px-5 py-0 ml-auto h-9 text-white bg-rose-600 rounded-2xl border border-red-400 border-none"
          aria-label="Delete timesheet"
        >
          Delete
        </button>
        <button
          className="px-5 py-0 h-9 text-white bg-green-500 rounded-2xl border-[none]"
          aria-label="Submit timesheet"
        >
          Submit
        </button>
      </div>

      <div className="flex flex-row ml-auto text-zinc-500">
        <span className="mt-2.5">Total</span>
        <span className="mt-2.5 ml-2 text-black">32.00/32.00</span>
      </div>
    </section>
  );
};

/**
 * Project section component
 * @returns {JSX.Element} The project section
 */
const ProjectSection = () => {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="mb-2 text-xs text-black">Project</h3>
      <div className="flex gap-2.5 items-center p-2.5 rounded bg-zinc-100 min-w-[122px]">
        <i className="ti ti-minus-circle" aria-hidden="true" />
        <span>E_Interview</span>
      </div>
      <div className="flex gap-2.5 items-center p-2.5 rounded bg-zinc-100 min-w-[122px]">
        <i className="ti ti-minus-circle" aria-hidden="true" />
        <span>E_Bench_Engineering</span>
      </div>
    </div>
  );
};

/**
 * Work mode section component
 * @returns {JSX.Element} The work mode section
 */
const WorkModeSection = () => {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="mb-2 text-xs text-black">Work Mode</h3>
      <div className="p-2.5 rounded bg-zinc-100 min-w-[122px]">Online</div>
      <div className="p-2.5 rounded bg-zinc-100 min-w-[122px]">On-site</div>
    </div>
  );
};

/**
 * Activity section component
 * @returns {JSX.Element} The activity section
 */
const ActivitySection = () => {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="mb-2 text-xs text-black">Activity</h3>
      <div className="p-2.5 rounded bg-zinc-100 min-w-[122px]">Alpha</div>
      <div className="p-2.5 rounded bg-zinc-100 min-w-[122px]">Alpha</div>
    </div>
  );
};

/**
 * Time entry section component
 * @returns {JSX.Element} The time entry section
 */
const TimeEntrySection = () => {
  const days = [
    "15 / Mon",
    "16 / Tue",
    "17 / Wed",
    "18 / Thu",
    "19 / Fri",
    "20 / Sat",
    "21 / Sun",
  ];

  return (
    <div className="grow max-md:overflow-x-auto">
      <div className="flex justify-between mb-2.5 text-xs text-zinc-500">
        {days.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>
      <div className="flex flex-col gap-5 pt-2.5 pb-4 mb-0.5">
        <TimeEntryRow />
        <TimeEntryRow />
      </div>
    </div>
  );
};

/**
 * Time entry row component
 * @returns {JSX.Element} A row of time entries
 */
const TimeEntryRow = () => {
  return (
    <div className="flex justify-between">
      <div className="relative w-14 h-9 text-white bg-blue-500 rounded font-bold flex items-center justify-center">
        4.00
      </div>
      <div className="relative w-14 h-9 text-white bg-blue-500 rounded font-bold flex items-center justify-center">
        4.00
      </div>
      <div className="relative w-14 h-9 text-white bg-blue-500 rounded font-bold flex items-center justify-center">
        4.00
      </div>
      <div className="relative w-14 h-9 text-white bg-blue-500 rounded font-bold flex items-center justify-center">
        4.00
      </div>
      <div className="relative w-14 h-9 text-white bg-blue-500 rounded font-bold flex items-center justify-center">
        4.00
      </div>
      <div className="flex relative justify-center items-center w-14 h-9 text-white rounded bg-zinc-300" />
      <div className="flex relative justify-center items-center w-14 h-9 rounded bg-zinc-300 text-zinc-300" />
    </div>
  );
};

export default UpdateTimesheet;
