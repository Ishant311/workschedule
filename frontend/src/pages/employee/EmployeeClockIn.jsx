import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";
import { Loader2, Clock, LogOut } from "lucide-react";

const EmployeeClockIn = ({ employeeId }) => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch status if already clocked in
    const fetchStatus = async () => {
      try {
        const res = await axiosInstance.get(`/employee/attendance/status`, {
          params: { employeeId },
        });
        if (res.data.clockedIn) {
          setIsClockedIn(true);
          setClockInTime(res.data.clockInTime);
        }
      } catch (err) {
        console.error("Error fetching clock-in status", err);
      }
    };
    fetchStatus();
  }, [employeeId]);

  const handleClockIn = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/employee/clock-in", { employeeId });
      setClockInTime(res.data.time);
      setIsClockedIn(true);
      setMessage("You have successfully clocked in!");
    } catch (err) {
      console.error("Clock in error", err);
      setMessage("Failed to clock in. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      await axiosInstance.post("/employee/clock-out", { employeeId });
      setIsClockedIn(false);
      setClockInTime(null);
      setMessage("You have successfully clocked out!");
    } catch (err) {
      console.error("Clock out error", err);
      setMessage("Failed to clock out. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Clock In / Clock Out</h2>

      {loading ? (
        <Loader2 className="animate-spin mx-auto text-indigo-600" size={36} />
      ) : (
        <div>
          {isClockedIn ? (
            <>
              <div className="mb-4 text-green-600">
                Clocked in at: {new Date(clockInTime).toLocaleTimeString()}
              </div>
              <button
                onClick={handleClockOut}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center mx-auto"
              >
                <LogOut className="mr-2" /> Clock Out
              </button>
            </>
          ) : (
            <button
              onClick={handleClockIn}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center mx-auto"
            >
              <Clock className="mr-2" /> Clock In
            </button>
          )}
        </div>
      )}

      {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default EmployeeClockIn;
