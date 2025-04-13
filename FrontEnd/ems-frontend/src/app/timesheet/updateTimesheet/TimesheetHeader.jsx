import React from "react";

/**
 * Header component for the Timesheet page
 * @returns {JSX.Element} The header section with title and status
 */
const TimesheetHeader = () => {
  return (
    <header className="flex justify-between items-center self-center py-4 mb-5 bg-white rounded-xl border border-none max-sm:flex-col max-sm:gap-2.5 max-sm:items-start">
      <div className="flex flex-col">
        <h1 className="pl-2.5 text-4xl font-semibold text-rose-600 leading-[60px] max-sm:text-3xl">
          Timesheet
        </h1>
        <nav
          aria-label="Breadcrumb"
          className="pl-2.5 text-base text-black text-opacity-30"
        >
          <span>Timesheet&nbsp; &gt;</span>
        </nav>
      </div>
      <div
        className="px-2.5 py-1 mr-auto ml-5 text-xs uppercase border border-solid border-black border-opacity-50 rounded-[30px]"
        aria-label="Status"
      >
        In Progress
      </div>
      <button
        className="px-5 py-1.5 mr-5 text-sm text-blue-500 border-2 border-blue-500 border-solid cursor-pointer rounded-[30px]"
        aria-label="View my timesheet report"
      >
        My timesheet's report
      </button>
    </header>
  );
};

export default TimesheetHeader;
