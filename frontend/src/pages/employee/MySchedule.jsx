import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { Loader2 } from "lucide-react";
import { format, parseISO } from 'date-fns';

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const MySchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [reportDates, setReportDates] = useState(new Set());


  const getWeekDates = () => {
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1) + currentWeekOffset * 7);
    return weekdays.map((_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  };

  const weekDates = getWeekDates();

  // Convert UTC time to IST and format
  const formatTimeToIST = (utcTimeString) => {
    if (!utcTimeString) return "";

    try {
      const date = new Date(utcTimeString);
      date.setHours(date.getHours());
      date.setMinutes(date.getMinutes());

      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours || 12; // Convert 0 to 12
      const minutesStr = minutes < 10 ? '0' + minutes : minutes;

      return `${hours}:${minutesStr} ${ampm}`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid time";
    }
  };

  useEffect(() => {
    const fetchScheduleAndReports = async () => {
      const start = weekDates[0].toISOString().slice(0, 10);
      const end = weekDates[4].toISOString().slice(0, 10);

      try {
        const [schedRes, reportsRes] = await Promise.all([
          axiosInstance.get("/employee/my-schedule", { params: { start, end } }),
          axiosInstance.get("/reports"),
        ]);

        setSchedule(schedRes.data.data || []);
        const reportSet = new Set(reportsRes.data.map(r => r.date.slice(0, 10)));
        setReportDates(reportSet);
      } catch (err) {
        console.error("Failed to fetch schedule or reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchScheduleAndReports();
  }, [currentWeekOffset]);


  const getScheduleForDay = (dateStr) => {
    return schedule.find((item) => item.date.slice(0, 10) === dateStr);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin text-indigo-600" size={36} />
        <p className="ml-4 text-lg font-medium text-indigo-700">Loading your schedule...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6 bg-white rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">My Weekly Schedule</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentWeekOffset((prev) => Math.max(prev - 1, 0))}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
          >
            Prev
          </button>
          <span className="text-sm text-gray-600">
            Week of {weekDates[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          <button
            onClick={() => setCurrentWeekOffset((prev) => (prev < 15 ? prev + 1 : prev))}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
          >
            Next
          </button>
        </div>
      </div>

      <table className="w-full table-fixed border border-gray-200 rounded-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="w-1/4 px-4 py-2 text-left text-gray-700">Day</th>
            <th className="w-1/2 px-4 py-2 text-left text-gray-700">Schedule (IST)</th>
            <th className="w-1/4 px-4 py-2 text-left text-gray-700">Notes</th>
            <th className="w-1/6 px-4 py-2 text-center text-gray-700">Report</th>
          </tr>
        </thead>

        <tbody>
          {weekDates.map((date, index) => {
            const dateStr = date.toISOString().slice(0, 10);
            const sched = getScheduleForDay(dateStr);

            const isPastDay = date < new Date(new Date().setHours(0, 0, 0, 0)); // compare with today (ignoring time)

            const rowClass = isPastDay ? "bg-gray-50 text-gray-500" : "";

            return (
              <tr key={index} className={`border-t ${rowClass}`}>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium">{weekdays[index]}</div>
                  <div className="text-xs">
                    {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {sched
                    ? `${formatTimeToIST(sched.startTime)} - ${formatTimeToIST(sched.endTime)}`
                    : "Not scheduled"}
                </td>
                <td className="px-4 py-3 text-sm">{sched?.notes || "-"}</td>
                <td className="px-4 py-3 text-center text-green-600 font-bold">
                  {reportDates.has(dateStr) ? "✅" : "—"}
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MySchedule;