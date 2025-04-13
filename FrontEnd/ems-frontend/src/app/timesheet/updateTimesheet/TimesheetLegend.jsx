import React from "react";

/**
 * Component for displaying the timesheet legend
 * @returns {JSX.Element} The legend section explaining color coding
 */
const TimesheetLegend = () => {
  const legendItems = [
    { color: "bg-blue-500", label: "Workday", value: "8.00" },
    { color: "bg-green-500", label: "Holiday", value: "8.00" },
    { color: "bg-pink-300", label: "Leave day", value: "8.00" },
    { color: "bg-rose-500", label: "Overtime/undertime", value: "8.00" },
  ];

  return (
    <section className="p-5 bg-white rounded-2xl">
      <h2 className="mb-5 text-xl text-black">Legend</h2>
      <div className="flex flex-col gap-3">
        {legendItems.map((item, index) => (
          <div key={index} className="flex gap-3 items-center">
            <div
              className={`relative w-14 h-9 text-white ${item.color} rounded font-bold flex items-center justify-center`}
              aria-hidden="true"
            >
              {item.value}
            </div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TimesheetLegend;
