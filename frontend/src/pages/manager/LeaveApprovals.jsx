import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const LeaveApprovals = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await axiosInstance.get('/manager/leaves');
        setLeaves(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch leaves:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setActionLoading(id);
    try {
      await axiosInstance.patch(`/manager/leave/${id}`, { status });
      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === id ? { ...leave, status } : leave
        )
      );
    } catch (err) {
      console.error('Failed to update leave status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <p className="ml-4 text-indigo-700">Loading leave requests...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 mt-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Leave Approvals</h2>
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Employee</th>
            <th className="p-2">Dates</th>
            <th className="p-2">Type</th>
            <th className="p-2">Reason</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave) => (
            <tr key={leave._id} className="border-t">
              <td className="p-2 font-medium">{leave.employeeId?.name || "N/A"}</td>
              <td className="p-2">{new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}</td>
              <td className="p-2">{leave.type}</td>
              <td className="p-2">{leave.reason}</td>
              <td className={`p-2 font-semibold ${leave.status === 'approved' ? 'text-green-600' : leave.status === 'rejected' ? 'text-red-600' : 'text-yellow-500'}`}>
                {leave.status}
              </td>
              <td className="p-2 space-x-2">
                {leave.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(leave._id, 'approved')}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs"
                      disabled={actionLoading === leave._id}
                    >
                      <CheckCircle size={14} className="inline-block mr-1" /> Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(leave._id, 'rejected')}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                      disabled={actionLoading === leave._id}
                    >
                      <XCircle size={14} className="inline-block mr-1" /> Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveApprovals;
