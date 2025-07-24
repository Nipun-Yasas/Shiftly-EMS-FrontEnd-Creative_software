"use client";

// This component has been replaced by ReusableTimesheetForm
// Please use ReusableTimesheetForm for both creating and editing timesheet entries

import TimesheetForm from "./TimesheetForm";

export default function DailyTimeEntry({ 
  setSelectedDate, 
  setDailyEntry, 
}) {
  
  // This is a legacy wrapper - use ReusableTimesheetForm directly instead
  const handleSuccess = (data, mode) => {
    if (setSelectedDate && setDailyEntry) {
      setSelectedDate(data.date);
      setDailyEntry({
        workMode: data.mode,
        activity: data.activity,
        hours: data.hours
      });
    }
  };

  return (
    <TimesheetForm
      mode="create"
      onSuccess={handleSuccess}
      showTitle={false}
      showSummary={true}
      showActions={false}
    />
  );
}
