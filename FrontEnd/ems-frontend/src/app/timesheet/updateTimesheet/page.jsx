"use client";
import React from "react";
import TimesheetHeader from "./TimesheetHeader";
import UpdateTimesheet from "./UpdateTimesheet";
import TimesheetRecord from "./TimesheetRecord";
import ProjectsList from "./ProjectsList";
import TimesheetLegend from "./TimesheetLegend";

/**
 * Main Timesheet component that orchestrates all sub-components
 * @returns {JSX.Element} The complete Timesheet interface
 */
const Timesheet = () => {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Poppins:wght@400;600&family=Lexend:wght@400&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css"
      />
      {/* Alternative icon import if the above doesn't work */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/@tabler/icons-webfont@latest/tabler-icons.min.css"
      />
      <main className="p-5 mx-auto my-0 bg-zinc-100 max-w-[1128px]">
        <TimesheetHeader />
        <UpdateTimesheet />
        <TimesheetRecord />
        <section className="flex justify-between items-center mb-5" />
        <div className="flex gap-5 max-md:flex-col">
          <div className="w-[67%] max-md:w-full">
            <ProjectsList />
          </div>
          <div className="ml-5 w-[33%] max-md:ml-0 max-md:w-full">
            <TimesheetLegend />
          </div>
        </div>
      </main>
    </>
  );
};

export default Timesheet;
