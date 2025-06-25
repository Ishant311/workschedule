import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../lib/axios';
import {
  Calendar, Clock, Users, Mail, FileText, LogOut, Shield, UserCog, Briefcase,
  HotelIcon
} from 'lucide-react';

const Home = () => {
  const { authUser, setAuthUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/auth/logout');
      setAuthUser(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (!authUser) return <p className="text-center mt-20 text-lg">Loading user data...</p>;

  const role = authUser.userType;

  const dashboards = {
    employee: {
      title: `Welcome, ${authUser.name} 👋`,
      subtitle: "Here’s what’s happening today.",
      features: [
        { icon: Calendar, label: 'My Schedule', route: '/schedule' },
        { icon: HotelIcon, label: 'Your Leaves', route: '/leaves' },
        { icon: Mail, label: 'Notification', route: '/messages' },
        { icon: FileText, label: 'Upload report', route: '/report' },
      ],
    },
    manager: {
      title: `Manager Panel - ${authUser.name}`,
      subtitle: "Manage your team and tasks.",
      features: [
        { icon: Users, label: 'Team Overview', route: '/manager/team' },
        { icon: Calendar, label: 'Assign Schedule', route: '/manager/assign-schedule' },
        { icon: FileText, label: 'Task Reports', route: '/manager/reports' },
        { icon: Mail, label: 'Leave Approval', route: '/manager/leave-approval' },
      ],
    },
    admin: {
      title: `Admin Dashboard – ${authUser.name}`,
      subtitle: "Full access to the platform.",
      features: [
        { icon: Shield, label: 'User Management', route: '/admin/users' },
      ],
    }
  };

  const current = dashboards[role] || dashboards.employee;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{current.title}</h1>
            <p className="text-sm text-gray-500">{current.subtitle}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {current.features.map((item, i) => (
            <div
              key={i}
              onClick={() => navigate(item.route)}
              className="bg-indigo-50 p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer hover:bg-indigo-100"
            >
              <item.icon className="text-indigo-500 w-8 h-8 mb-2" />
              <h3 className="text-lg font-semibold text-indigo-900">{item.label}</h3>
              <p className="text-sm text-gray-600 mt-1">Click to view</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

