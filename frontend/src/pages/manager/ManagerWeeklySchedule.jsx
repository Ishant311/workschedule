import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { Loader2, PlusCircle, Search } from "lucide-react";

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const ManagerWeeklySchedule = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [weeklySchedules, setWeeklySchedules] = useState([]);
    const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
    const [repeatWeeks, setRepeatWeeks] = useState(1);
    const [weeklyLeaves, setWeeklyLeaves] = useState([]);
    const [form, setForm] = useState({
        employeeId: "",
        date: "",
        startTime: "",
        endTime: "",
        notes: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [replacementOpen, setReplacementOpen] = useState(false);
    const [replacementDate, setReplacementDate] = useState("");
    const [replacementDay, setReplacementDay] = useState("");
    const [originalEmployee, setOriginalEmployee] = useState(null);
    const [availableForReplacement, setAvailableForReplacement] = useState([]);

    const handleReplaceSchedule = (employee, date) => {
        const dateStr = date.toISOString().slice(0, 10);
        const available = employees.filter((e) => {
            const isOnLeave = weeklyLeaves.find(
                (leave) => leave.employeeId === e._id && leave?.date?.slice(0, 10) === dateStr
            );
            const isScheduled = weeklySchedules.find(
                (sched) => sched.employeeId === e._id && sched.date.slice(0, 10) === dateStr
            );
            return !isOnLeave && !isScheduled && e._id !== employee._id;
        });

        const dayIndex = date.getDay() === 0 ? 6 : date.getDay() - 1;
        setReplacementDay(weekdays[dayIndex]);
        setReplacementDate(dateStr);
        setOriginalEmployee(employee);
        setAvailableForReplacement(available);
        setReplacementOpen(true);
    };



    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axiosInstance.get("/manager/team");
                setEmployees(res.data.data || []);
                setFilteredEmployees(res.data.data || []);
            } catch (err) {
                setError("Failed to load team");
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    useEffect(() => {
        const fetchSchedules = async () => {
            const today = new Date();
            const monday = new Date(today);
            monday.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1) + currentWeekOffset * 7);
            const start = new Date(monday);
            const end = new Date(monday);
            end.setDate(start.getDate() + 4);

            try {
                const res = await axiosInstance.get("/manager/weekly-schedules", {
                    params: {
                        start: start.toISOString().slice(0, 10),
                        end: end.toISOString().slice(0, 10),
                    },
                });
                setWeeklySchedules(res.data.data || []);
            } catch (err) {
                console.error("Error loading weekly schedules:", err);
            }
        };

        fetchSchedules();
    }, [currentWeekOffset]);

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

    const getScheduleDetails = (employeeId, dateStr) => {
        return weeklySchedules.find(
            (sched) => sched.employeeId.toString() === employeeId && sched?.date?.slice(0, 10) === dateStr
        );
    };

    const openModal = (employee, dayIndex) => {
        const date = new Date(weekDates[dayIndex]);
        const formattedDate = date.toISOString().slice(0, 10);

        setForm({
            employeeId: employee._id,
            date: formattedDate,
            startTime: "",
            endTime: "",
            notes: "",
        });
        setSelectedDay(weekdays[dayIndex]);
        setSelectedEmployee(employee);
        setModalOpen(true);
        setError("");
        setMessage("");
    };

    const closeModal = () => {
        setModalOpen(false);
        setError("");
        setMessage("");
        setSubmitting(false);
        setRepeatWeeks(1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { employeeId, date, startTime, endTime } = form;
        if (!employeeId || !date || !startTime || !endTime) {
            setError("All fields except notes are required.");
            return;
        }
        if (startTime >= endTime) {
            setError("Start time must be before end time.");
            return;
        }
        setSubmitting(true);
        try {
            const scheduleDates = [];
            const baseDate = new Date(date);
            for (let i = 0; i < repeatWeeks; i++) {
                const d = new Date(baseDate);
                d.setDate(d.getDate() + i * 7);
                scheduleDates.push(d.toISOString().slice(0, 10));
            }

            for (const d of scheduleDates) {
                await axiosInstance.post("/manager/assign-schedule", { ...form, date: d });
            }

            setMessage("✅ Schedule assigned successfully!");
            setTimeout(() => closeModal(), 1500);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to assign schedule.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = employees.filter(
            (emp) => emp.name.toLowerCase().includes(query) || (emp.position || "").toLowerCase().includes(query)
        );
        setFilteredEmployees(filtered);
    };

    useEffect(() => {
        const fetchLeaves = async () => {
            const today = new Date();
            const monday = new Date(today);
            monday.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay() - 1) + currentWeekOffset * 7);
            const start = new Date(monday);
            const end = new Date(monday);
            end.setDate(start.getDate() + 4);

            try {
                const res = await axiosInstance.get("/manager/leaves-weekly", {
                    params: {
                        start: start.toISOString().slice(0, 10),
                        end: end.toISOString().slice(0, 10),
                    },
                });
                setWeeklyLeaves(res.data.data || []);
            } catch (err) {
                console.error("Error loading weekly leaves:", err);
            }
        };

        fetchLeaves();
    }, [currentWeekOffset]);

    const isOnLeave = (employeeId, dateStr) => {
        return weeklyLeaves.find(
            (leave) =>
                leave.employeeId === employeeId &&
                leave.startDate.slice(0, 10) === dateStr
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[70vh]">
                <Loader2 className="animate-spin text-indigo-600" size={36} />
                <p className="ml-4 text-lg font-medium text-indigo-700">Loading employees...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 mt-6 bg-white rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Weekly Schedule Planner</h2>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Search employee..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                    />
                    <button
                        onClick={() => setCurrentWeekOffset((prev) => Math.max(prev - 1, 0))}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-gray-500">
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

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left font-medium text-gray-700">Employee</th>
                            {weekdays.map((day, index) => {
                                const dayDate = weekDates[index];
                                const isPast = dayDate < new Date(new Date().setHours(0, 0, 0, 0)); // ignore time

                                return (
                                    <th
                                        key={day}
                                        className={`px-4 py-3 text-center font-medium ${isPast ? 'text-gray-400 bg-gray-100' : 'text-gray-700 bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-semibold">{day}</span>
                                            <span className="text-xs mt-1">
                                                {dayDate.toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEmployees.map((emp) => (
                            <tr key={emp._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <span className="text-indigo-600 font-medium">
                                                {emp.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                                            <div className="text-sm text-gray-500">{emp.position || "Team member"}</div>
                                        </div>
                                    </div>
                                </td>
                                {weekDates.map((date, index) => {
                                    const dateStr = date.toISOString().slice(0, 10);
                                    const sched = getScheduleDetails(emp._id, dateStr);

                                    const startTime = sched
                                        ? new Date(sched.startTime).toLocaleTimeString('en-IN', {
                                            hour: 'numeric',
                                            hour12: true,
                                            timeZone: 'Asia/Kolkata',
                                        })
                                        : '';

                                    const endTime = sched
                                        ? new Date(sched.endTime).toLocaleTimeString('en-IN', {
                                            hour: 'numeric',
                                            hour12: true,
                                            timeZone: 'Asia/Kolkata',
                                        })
                                        : '';

                                    const onLeave = isOnLeave(emp._id, dateStr);
                                    const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                                    const baseClass = `px-4 py-4 text-center ${isPast ? 'bg-gray-100 text-gray-400' : ''}`;

                                    if (onLeave) {
                                        return (
                                            <td key={index} className={baseClass}>
                                                <div className="text-xs text-yellow-600">On Leave</div>
                                                {!isPast && !onLeave.replaced &&  (
                                                    <button
                                                        onClick={() => handleReplaceSchedule(emp, date)}
                                                        className="mt-1 text-blue-600 underline text-xs hover:text-blue-800"
                                                    >
                                                        Replace
                                                    </button>
                                                )}
                                                {
                                                    onLeave.replaced && (
                                                        <div className="mt-1 text-green-600 text-xs font-semibold hover:text-green-800">
                                                            Replaced
                                                        </div>
                                                    )
                                                }
                                            </td>
                                        );
                                    }

                                    return (
                                        <td key={index} className={baseClass}>
                                            {sched ? (
                                                <div className="text-xs font-bold text-red-500">
                                                    <div>Scheduled</div>
                                                    {startTime} - {endTime}
                                                </div>
                                            ) : (
                                                !isPast && (
                                                    <button
                                                        onClick={() => openModal(emp, index)}
                                                        className="w-10 h-10 mx-auto flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 transition-colors text-gray-400 hover:text-indigo-600"
                                                    >
                                                        <PlusCircle size={18} />
                                                    </button>
                                                )
                                            )}
                                        </td>
                                    );
                                })}


                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                        onClick={closeModal}
                    />

                    <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl z-10 overflow-hidden transition-all transform">
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-5">
                            <h3 className="text-lg font-semibold text-white">Schedule Assignment</h3>
                            <p className="text-indigo-100 text-sm mt-1">
                                {selectedEmployee?.name} • {selectedDay}, {new Date(form.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                        </div>

                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Start Time</label>
                                        <div className="relative">
                                            <input
                                                name="startTime"
                                                type="time"
                                                value={form.startTime}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            />
                                            <span className="absolute right-3 top-2.5 text-gray-400">
                                                {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                </svg> */}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">End Time</label>
                                        <div className="relative">
                                            <input
                                                name="endTime"
                                                type="time"
                                                value={form.endTime}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            />
                                            {/* <span className="absolute right-3 top-2.5 text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                </svg>
                                            </span> */}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Notes (optional)</label>
                                    <textarea
                                        name="notes"
                                        value={form.notes}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        placeholder="Any special instructions..."
                                    />
                                </div>
                                {/* <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Repeat this schedule for</label>
                                    <select
                                        value={repeatWeeks}
                                        onChange={(e) => setRepeatWeeks(parseInt(e.target.value))}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSI+PC9wb2x5bGluZT48L3N2Zz4=')] bg-no-repeat bg-[right_0.75rem_center] bg-[length:1.25rem]"
                                    >
                                        {[1, 2, 3, 4].map((n) => (
                                            <option key={n} value={n}>{n} week{n > 1 ? "s" : ""}</option>
                                        ))}
                                    </select>
                                </div> */}

                                {/* Status Messages */}
                                {error && (
                                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span>{error}</span>
                                    </div>
                                )}

                                {message && (
                                    <div className="p-3 bg-green-50 border border-green-100 text-green-600 rounded-lg text-sm flex items-start">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span>{message}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {submitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Assigning...
                                        </>
                                    ) : (
                                        "Assign Schedule"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {replacementOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                        onClick={() => setReplacementOpen(false)}
                    />

                    <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl z-10 overflow-hidden transition-all transform">
                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-5">
                            <h3 className="text-lg font-semibold text-white">Replace Schedule</h3>
                            <p className="text-yellow-100 text-sm mt-1">
                                {originalEmployee?.name} • {replacementDay}
                            </p>
                        </div>

                        <div className="p-6 space-y-5">
                            {availableForReplacement.length === 0 ? (
                                <div className="text-sm text-gray-600">No available employees for replacement.</div>
                            ) : (
                                availableForReplacement.map((emp) => (
                                    <div
                                        key={emp._id}
                                        className="flex justify-between items-center border p-3 rounded-lg hover:bg-gray-50 transition-all"
                                    >
                                        <div>
                                            <div className="text-sm font-medium text-gray-800">{emp.name}</div>
                                            <div className="text-xs text-gray-500">{emp.position || "Team Member"}</div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                console.log(originalEmployee)
                                                const dateStr = replacementDate;
                                                const originalSchedule = getScheduleDetails(originalEmployee._id, dateStr);
                                                setForm({
                                                    employeeId: emp._id,
                                                    date: dateStr,
                                                    startTime: originalSchedule?.startTime || "",
                                                    endTime: originalSchedule?.endTime || "",
                                                    notes: `Replacement for ${originalEmployee.name}`,
                                                });
                                                setSelectedDay(replacementDay);
                                                setSelectedEmployee(emp);
                                                setModalOpen(true);
                                                setReplacementOpen(false);
                                            }}
                                            className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                                        >
                                            Replace
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManagerWeeklySchedule;
