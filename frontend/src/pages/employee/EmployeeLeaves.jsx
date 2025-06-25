import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios';
import { Loader2 } from 'lucide-react';

const leaveTypes = ["Sick Leave", "Casual Leave", "Earned Leave"];

const EmployeeLeaves = () => {
  const [form, setForm] = useState({ startDate: "", endDate: "", type: "Sick Leave", reason: "" });
  const [submitting, setSubmitting] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axiosInstance.get("/leave/my-leaves");
        setLeaves(res.data.data || []);
      } catch (err) {
        console.error("Failed to load leaves:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { startDate, endDate, reason } = form;
    if (!startDate || !endDate || !reason) {
      setError("All fields are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosInstance.post("/leave/apply", form);
      setMessage("✅ Leave applied successfully!");
      setLeaves((prev) => [...prev, res.data.leave]);
      setForm({ startDate: "", endDate: "", type: "Sick Leave", reason: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to apply for leave.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Leave Application</h2>

      <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2 mb-10">
        <div>
          <label className="text-sm font-medium text-gray-700">Start Date</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required className="mt-1 w-full border px-3 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">End Date</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required className="mt-1 w-full border px-3 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Leave Type</label>
          <select name="type" value={form.type} onChange={handleChange} className="mt-1 w-full border px-3 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            {leaveTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-gray-700">Reason</label>
          <textarea name="reason" value={form.reason} onChange={handleChange} rows={3} className="mt-1 w-full border px-3 py-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
        </div>

        {error && <div className="sm:col-span-2 text-sm text-red-600">{error}</div>}
        {message && <div className="sm:col-span-2 text-sm text-green-600">{message}</div>}

        <button
          type="submit"
          disabled={submitting}
          className="sm:col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-60"
        >
          {submitting ? "Submitting..." : "Apply Leave"}
        </button>
      </form>

      <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Leave History</h3>

      {loading ? (
        <div className="flex items-center text-gray-600">
          <Loader2 className="animate-spin mr-2 text-indigo-500" />
          Loading leaves...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2">Start</th>
                <th className="p-2">End</th>
                <th className="p-2">Type</th>
                <th className="p-2">Status</th>
                <th className="p-2">Reason</th>
              </tr>
            </thead>
            <tbody>
              {leaves.length > 0 ? (
                leaves.map((leave, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="p-2">{new Date(leave.startDate).toLocaleDateString()}</td>
                    <td className="p-2">{new Date(leave.endDate).toLocaleDateString()}</td>
                    <td className="p-2">{leave.type}</td>
                    <td className={`p-2 font-medium ${leave.status === "approved" ? "text-green-600" : leave.status === "rejected" ? "text-red-600" : "text-yellow-600"}`}>
                      {leave.status}
                    </td>
                    <td className="p-2">{leave.reason}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">No leaves applied yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaves;
