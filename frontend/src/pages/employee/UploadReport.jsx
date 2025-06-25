import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios';
import { FileText, UploadCloud, Calendar, FileDown } from 'lucide-react';

const UploadReport = () => {
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [file, setFile] = useState(null);
    const [reports, setReports] = useState([]);
    const [message, setMessage] = useState('');
    const [validDates, setValidDates] = useState([]);

    const fetchReports = async () => {
        try {
            const res = await axiosInstance.get('/reports');
            setReports(res.data);
        } catch (err) {
            console.error('Error fetching reports:', err);
        }
    };

    useEffect(() => {
        fetchReports();
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
  try {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
      .toISOString()
      .slice(0, 10); // 1st of the month
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      .toISOString()
      .slice(0, 10); // last day of the month

    const res = await axiosInstance.get(`/employee/my-schedule?start=${start}&end=${end}`);
    const dates = res.data.data.map((entry) =>
      new Date(entry.date).toISOString().slice(0, 10)
    );
    setValidDates(dates);
  } catch (err) {
    console.error('Error fetching schedule:', err);
  }
};



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validDates.includes(date)) {
            return setMessage("You can only upload reports for scheduled work days.");
        }

        if (!date || !file) {
            return setMessage('Date and PDF file are required');
        }

        const formData = new FormData();
        formData.append('date', date);
        formData.append('notes', notes);
        formData.append('report', file);

        try {
            const res = await axiosInstance.post('/reports/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setMessage(res.data.message);
            setDate('');
            setNotes('');
            setFile(null);
            fetchReports(); // refresh report list
        } catch (err) {
            console.error('Upload failed:', err);
            setMessage('Failed to upload report');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <UploadCloud /> Upload Work Report
            </h2>

            {message && <div className="mb-4 text-sm text-blue-600">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col">
                    <label className="text-sm font-medium">Date</label>
                    <input
                        type="date"
                        className="border p-2 rounded"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        min={validDates.length > 0 ? validDates[0] : undefined}
                        max={validDates.length > 0 ? validDates[validDates.length - 1] : undefined}
                        list="scheduled-dates"
                    />
                    <datalist id="scheduled-dates">
                        {validDates.map((d) => (
                            <option key={d} value={d} />
                        ))}
                    </datalist>

                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium">Notes (optional)</label>
                    <textarea
                        rows={3}
                        className="border p-2 rounded"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium">Upload PDF</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        className="border p-2 rounded"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                    Submit Report
                </button>
            </form>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <FileText /> Submitted Reports
                </h3>
                {reports.length === 0 ? (
                    <p className="text-gray-500 text-sm">No reports uploaded yet.</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {reports.map((report) => (
                            <li key={report._id} className="py-2 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium">
                                        {new Date(report.date).toLocaleDateString()} — {report.notes || 'No notes'}
                                    </p>
                                </div>
                                <a
                                    href={`/${report.filePath}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-indigo-600 hover:underline text-sm flex items-center gap-1"
                                >
                                    <FileDown size={16} /> Download
                                </a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default UploadReport;
