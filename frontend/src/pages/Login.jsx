import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, UserCog, Briefcase, Github, Calendar, Clock, Users, FileText, CheckCircle } from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '', role: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { setAuthUser } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage('');
  setLoading(true);

  const { email, password, role } = formData;
  if (!role) {
    setLoading(false);
    alert('Please select a role before logging in.');
    return;
  }

  try {
    const res = await axiosInstance.post('/auth/login', {
      email,
      password,
      role,
    });

    const user = res.data;
    setAuthUser(user); 
    switch (user.userType) {
      case 'admin':
        navigate('/admin-dashboard');
        break;
      case 'manager':
        navigate('/manager-dashboard');
        break;
      default:
        navigate('/employee-dashboard');
    }

  } catch (err) {
    console.error('Login failed:', err);
    setErrorMessage(err?.response?.data?.message || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};


  const dummyFeatures = [
    { icon: Calendar, label: "Calendar" },
    { icon: Clock, label: "Clock In" },
    { icon: Users, label: "Team" },
    { icon: Mail, label: "Messages" },
    { icon: Lock, label: "Security" },
    { icon: Github, label: "GitHub" },
    { icon: UserCog, label: "Admin" },
    { icon: FileText, label: "Reports" },
    { icon: CheckCircle, label: "Approval" },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-indigo-900 to-purple-900 text-white">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold mb-4 text-center">Welcome Back</h2>
          <p className="text-sm text-center mb-6">Login to manage your work effectively</p>

          {errorMessage && <p className="text-sm text-red-400 text-center mb-2">{errorMessage}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            {/* Role Selection */}
<div className="flex flex-col gap-2">
  <label className="flex items-center gap-2">
    <input
      type="radio"
      name="role"
      value="employee"
      checked={formData.role === 'employee'}
      onChange={handleChange}
      className="accent-yellow-300"
    />
    <Briefcase className="w-4 h-4" /> Employee
  </label>
  <label className="flex items-center gap-2">
    <input
      type="radio"
      name="role"
      value="manager"
      checked={formData.role === 'manager'}
      onChange={handleChange}
      className="accent-yellow-300"
    />
    <UserCog className="w-4 h-4" /> Manager
  </label>
  <label className="flex items-center gap-2">
    <input
      type="radio"
      name="role"
      value="admin"
      checked={formData.role === 'admin'}
      onChange={handleChange}
      className="accent-yellow-300"
    />
    <Lock className="w-4 h-4" /> Admin
  </label>
</div>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-medium mb-1">Email</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-white text-black">
                <Mail className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block font-medium mb-1">Password</label>
              <div className="flex items-center border rounded-lg px-3 py-2 bg-white text-black">
                <Lock className="w-5 h-5 text-gray-500 mr-2" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full outline-none"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2">
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-500" /> : <Eye className="w-5 h-5 text-gray-500" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right text-sm text-yellow-300 hover:underline">
              <a href="/forgot-password">Forgot Password?</a>
            </div>

            {/* Submit Button */}
            {loading ? (
              <button disabled className="w-full bg-indigo-300 text-white py-2 rounded-lg">
                Logging in...
              </button>
            ) : (
              <button
                type="submit"
                className="w-full bg-yellow-300 text-indigo-900 py-2 rounded-lg hover:bg-yellow-400 transition font-semibold"
              >
                Sign In
              </button>
            )}
          </form>

          <p className="text-sm text-center mt-4">
            Only the Admin can register a new user. If you are a new user, please contact your Admin.
          </p>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-indigo-800 p-10">
        <div className="flex flex-col items-center text-white">
          <p className="text-lg mb-2">Welcome to our platform! Discover the features that empower your team.</p>
          <h3 className="text-2xl font-semibold mb-6">Explore Our Features</h3>
          <div className="grid grid-cols-3 gap-4">
            {dummyFeatures.map((feature, i) => (
              <div
                key={i}
                className="h-28 w-28 transform hover:scale-105 transition-transform duration-300 bg-white text-indigo-900 shadow-md flex flex-col items-center justify-center text-center font-medium rounded-lg border border-indigo-200 hover:border-yellow-300"
              >
                <feature.icon className="w-6 h-6 text-indigo-500 mb-2" />
                {feature.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
