"use client";
import React from "react";

/**
 * Component for displaying the timesheet color legend
 * @returns {JSX.Element} The timesheet legend section
 */
const TimesheetLegend = () => {
  const legendItems = [
    { color: "bg-blue-500", text: "Workday", value: "8.00" },
    { color: "bg-green-400", text: "Holiday", value: "8.00" },
    { color: "bg-orange-300", text: "Leave day", value: "8.00" },
    { color: "bg-red-500", text: "Overtime/undertime", value: "8.00" },
  ];
  
  return (
    <section className="flex flex-col p-5 bg-white rounded-2xl h-full">
      <h2 className="text-base text-black mb-4">Legend</h2>
      
      <div className="flex flex-col gap-3">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className={`w-12 h-8 ${item.color} rounded flex items-center justify-center text-white font-medium mr-3`}>
              {item.value}
            </div>
            <span className="text-sm text-gray-700">{item.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TimesheetLegend;