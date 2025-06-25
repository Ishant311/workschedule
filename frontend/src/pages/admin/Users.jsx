import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../lib/axios';
import { User, Mail, ShieldAlert, PlusCircle } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    userType: 'employee',
  });
  const [submitError, setSubmitError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/admin/users', form);
      setIsModalOpen(false);
      setForm({ name: '', email: '', password: '', userType: 'employee' });
      fetchUsers(); // Refresh the user list
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'User creation failed');
    }
  };

  if (loading) return <div className="text-center mt-20 text-lg">Loading users...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Users</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          <PlusCircle className="w-4 h-4" />
          Create User
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-6 py-3 text-sm font-medium text-gray-700">Name</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700">Email</th>
              <th className="px-6 py-3 text-sm font-medium text-gray-700">Role</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  {user.name}
                </td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  {user.email}
                </td>
                <td className="px-6 py-4 flex items-center gap-2 capitalize">
                  <ShieldAlert className="w-4 h-4 text-gray-500" />
                  {user.userType}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create New User</h3>
            {submitError && <p className="text-red-500 mb-2">{submitError}</p>}
            <form onSubmit={handleCreateUser} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full border p-2 rounded"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full border p-2 rounded"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full border p-2 rounded"
                value={form.password}
                onChange={handleChange}
                required
              />
              <select
                name="userType"
                className="w-full border p-2 rounded"
                value={form.userType}
                onChange={handleChange}
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
