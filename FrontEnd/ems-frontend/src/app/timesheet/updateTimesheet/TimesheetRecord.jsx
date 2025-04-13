"use client";
import React, { useState } from "react";

/**
 * Component for displaying timesheet records
 * @returns {JSX.Element} The timesheet records section
 */
const TimesheetRecord = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section className="p-5 mb-5 bg-white rounded-2xl">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl text-black">Timesheet Record</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="timesheet-records"
          className="cursor-pointer"
        >
          <i
            className={`ti ti-chevron-${isExpanded ? "up" : "down"}`}
            aria-hidden="true"
          />
        </button>
      </div>

      {isExpanded && (
        <div id="timesheet-records" className="flex flex-col w-full">
          <TableHeader />
          <TableRow
            date="15 Jan"
            project="E_Interview"
            workMode="Online"
            activity="Development"
            hours="8.00"
          />
          <TableRow
            date="15 Jan"
            project="Bench_Engineering"
            workMode="On-site"
            activity="Development"
            hours="8.00"
          />
        </div>
      )}
    </section>
  );
};

/**
 * Table header component
 * @returns {JSX.Element} The table header
 */
const TableHeader = () => {
  return (
    <div className="px-6 py-2.5 bg-zinc-300 flex max-md:flex-col max-md:gap-2">
      <div className="w-[17%] max-md:w-full">
        <div>Date</div>
      </div>
      <div className="ml-5 w-[17%] max-md:ml-0 max-md:w-full">
        <div>Project Task</div>
      </div>
      <div className="ml-5 w-[17%] max-md:ml-0 max-md:w-full">
        <div>Work mode</div>
      </div>
      <div className="ml-5 w-[17%] max-md:ml-0 max-md:w-full">
        <div>Activity</div>
      </div>
      <div className="ml-5 w-[17%] max-md:ml-0 max-md:w-full">
        <div>Hours</div>
      </div>
      <div className="ml-5 w-[17%] max-md:ml-0 max-md:w-full">
        <div className="pl-5 w-[150px]">Status</div>
      </div>
    </div>
  );
};

/**
 * Table row component
 * @param {Object} props - Component props
 * @param {string} props.date - Date of the timesheet entry
 * @param {string} props.project - Project name
 * @param {string} props.workMode - Work mode (Online/On-site)
 * @param {string} props.activity - Activity type
 * @param {string} props.hours - Hours worked
 * @returns {JSX.Element} A table row
 */
const TableRow = ({ date, project, workMode, activity, hours }) => {
  return (
    <div className="px-6 py-2.5 w-full flex max-md:flex-col max-md:gap-2">
      <div className="w-[17%] max-md:w-full">
        <div>{date}</div>
      </div>
      <div className="ml-5 w-[17%] max-md:ml-0 max-md:w-full">
        <div>
          <span className="bg-[rgb(241,241,241)]">{project}</span>
        </div>
      </div>
      <div className="ml-5 w-[17%] max-md:ml-0 max-md:w-full">
        <div>{workMode}</div>
      </div>
      <div className="ml-5 w-[17%] max-md:ml-0 max-md:w-full">
        <div>{activity}</div>
      </div>
      <div className="ml-5 w-[17%] max-md:ml-0 max-md:w-full">
        <div>{hours}</div>
      </div>
      <div className="ml-5 w-[17%] max-md:ml-0 max-md:w-full">
        <button
          className="px-5 py-0 my-auto mr-auto text-white bg-green-500 rounded-2xl border-none h-[25px] w-[100px]"
          aria-label="Submit timesheet entry"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default TimesheetRecord;
