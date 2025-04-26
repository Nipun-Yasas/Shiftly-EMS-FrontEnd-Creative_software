"use client";
import React, { useState } from "react";

/**
 * Component for the timesheet header with title and report button
 * @returns {JSX.Element} The timesheet header section
 */
const TimesheetHeader = () => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportMessage, setReportMessage] = useState({ text: "", type: "" });

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      // In a real app, you would generate a report via API
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful report generation
      setReportMessage({ text: "Report generated successfully", type: "success" });
      
      // Simulate downloading a file
      const link = document.createElement('a');
      link.href = 'data:text/plain;charset=utf-8,This is a placeholder for a timesheet report';
      link.download = 'timesheet-report.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => setReportMessage({ text: "", type: "" }), 3000);
    } catch (error) {
      console.error("Error generating report:", error);
      setReportMessage({ text: "Failed to generate report", type: "error" });
      setTimeout(() => setReportMessage({ text: "", type: "" }), 3000);
    }
    
    setIsGeneratingReport(false);
  };

  return (
    <div className="flex justify-between items-center bg-white p-5 rounded-2xl mb-5">
      <div className="flex flex-col">
        <div className="flex items-center">
          <h1 className="text-2xl text-rose-600 font-bold">Timesheet</h1>
          <span className="ml-3 px-2 py-0.5 text-[10px] bg-gray-200 rounded-xl">IN PROGRESS</span>
        </div>
        <span className="text-sm text-zinc-500">Time Entries</span>
      </div>
      
      {reportMessage.text && (
        <div 
          className={`p-2 rounded mx-4 ${
            reportMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {reportMessage.text}
        </div>
      )}
      
      <button 
        onClick={handleGenerateReport}
        disabled={isGeneratingReport}
        className="px-4 py-2 text-sm text-blue-500 bg-white rounded-2xl border border-blue-500 border-solid hover:bg-blue-50"
      >
        {isGeneratingReport ? "Generating..." : "My timesheet report"}
      </button>
    </div>
  );
};

export default TimesheetHeader;