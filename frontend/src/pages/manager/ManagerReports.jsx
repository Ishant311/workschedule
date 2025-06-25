import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import { FileDown, FileText } from 'lucide-react';

const ManagerReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosInstance.get('/manager/reports');
        console.log('Fetched reports:', res.data);
        setReports(res.data);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading reports...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <FileText /> Team Reports
      </h2>
      {reports.length === 0 ? (
        <p className="text-gray-500">No reports uploaded yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {reports.map((report) => (
            <li key={report._id} className="py-3 flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {new Date(report.date).toLocaleDateString()} — {report.user.name}
                </p>
                <p className="text-xs text-gray-600">{report.notes || 'No notes'}</p>
              </div>
              <a
                href={`http://localhost:5000/${report.filePath}`}
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
  );
};

export default ManagerReports;
