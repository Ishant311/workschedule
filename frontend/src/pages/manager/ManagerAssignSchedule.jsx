import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { Loader2 } from "lucide-react";

const ManagerAssignSchedule = () => {
  const [employees, setEmployees] = useState([]);
  const [employeeLeaves, setEmployeeLeaves] = useState({});
  const [form, setForm] = useState({
    employeeId: "",
    date: "",
    startTime: "",
    endTime: "",
    notes: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setMessage("");
  };

  const validateForm = () => {
    const { employeeId, date, startTime, endTime } = form;
    if (!employeeId || !date || !startTime || !endTime) {
      setError("All fields except notes are required.");
      return false;
    }
    if (startTime >= endTime) {
      setError("Start time must be before end time.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      await axiosInstance.post("/manager/assign-schedule", form);
      setMessage("✅ Schedule assigned successfully!");
      setForm({
        employeeId: "",
        date: "",
        startTime: "",
        endTime: "",
        notes: "",
      });
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };


  const getWeekRange = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diffToMonday);
    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    return {
      start: monday.toISOString().slice(0, 10),
      end: friday.toISOString().slice(0, 10)
    };
  };


  const isOnLeave = (empId, selectedDate) => {
    const leaves = employeeLeaves[empId] || [];
    const selected = new Date(selectedDate);
    return leaves.some(
      (leave) => selected >= leave.start && selected <= leave.end
    );
  };

  useEffect(() => {
    const fetchWeeklyLeaves = async () => {
      if (!form.date) return;
      const { start, end } = getWeekRange(form.date);

      try {
        const res = await axiosInstance.get(`/manager/leaves-weekly?start=${start}&end=${end}`);
        const leaveMap = {};

        res.data.data.forEach((leave) => {
          if (!leaveMap[leave.employee]) leaveMap[leave.employee] = [];
          leaveMap[leave.employee].push({
            start: new Date(leave.startDate),
            end: new Date(leave.endDate)
          });
        });

        setEmployeeLeaves(leaveMap);
      } catch (err) {
        console.error("Failed to fetch weekly leaves:", err);
      }
    };

    fetchWeeklyLeaves();
  }, [form.date]);
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get("/manager/team");
        setEmployees(res.data.data || []);
      } catch (err) {
        setError("Failed to load team. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin text-indigo-600" size={36} />
        <p className="ml-4 text-lg font-medium text-indigo-700">Loading employees...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-12">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Assign Schedule</h1>

      {error && <div className="text-red-600 font-medium mb-4">{error}</div>}
      {message && <div className="text-green-600 font-medium mb-4">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Select Employee</label>
          <select
            name="employeeId"
            value={form.employeeId}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-3 text-gray-700"
            required
          >
            <option value="">-- Choose --</option>
            {employees.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.email})
                {form.date && isOnLeave(emp._id, form.date) ? " — 🚫 On Leave" : ""}
              </option>
            ))}

          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">End Time</label>
            <input
              type="time"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-3"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">Notes / Task (Optional)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            className="w-full border border-gray-300 rounded-md p-3"
            placeholder="Describe the task or shift notes..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 px-4 text-white rounded-md font-semibold transition ${submitting
            ? "bg-indigo-300 cursor-not-allowed"
            : "bg-indigo-600 hover:bg-indigo-700"
            }`}
        >
          {submitting ? "Assigning..." : "Assign Schedule"}
        </button>
      </form>
    </div>
  );
};

export default ManagerAssignSchedule;
