import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import { useAuthStore } from "./store/authStore.js";
import { useEffect } from "react";
import ManagerRoute from "./components/ManagerRoute.jsx";
import ManagerTeam from "./pages/manager/ManagerTeam.jsx";
import { Loader2 } from "lucide-react";
import LoadingScreen from "./components/LoadingScreen.jsx";
import MySchedule from "./pages/employee/MySchedule.jsx";
import ManagerWeeklySchedule from "./pages/manager/ManagerWeeklySchedule.jsx";
import EmployeeClockIn from "./pages/employee/EmployeeClockIn.jsx";
import EmployeeLeaves from "./pages/employee/EmployeeLeaves.jsx";
import LeaveApprovals from "./pages/manager/LeaveApprovals.jsx";
import Users from "./pages/admin/Users.jsx";
import Unauthorized from "./components/Unauthorised.jsx";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.jsx";
import UploadReport from "./pages/employee/UploadReport.jsx";
import ManagerReports from "./pages/manager/ManagerReports.jsx";

function App() {
  const { fetchAuthUser, authUser, LoadingAuthUser } = useAuthStore();

  useEffect(() => {
    fetchAuthUser();
  }, []);
  if (LoadingAuthUser) {
    return (
      <>
        <Navbar />
        <LoadingScreen />
      </>
    );
  }
  return (
    <>
      <div className="pt-20">
        <Navbar />
        <Routes>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route
            path="/admin/users"
            element={
              <ProtectedAdminRoute>
                <Users />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/manager/reports"
            element={
              <ManagerRoute>
                <ManagerReports />
              </ManagerRoute>
            }
          />

          <Route path="/report" element={<UploadReport />} />
          <Route
            path="/manager/team"
            element={
              <ManagerRoute>
                <ManagerTeam />
              </ManagerRoute>
            }
          />
          <Route
            path="/manager/assign-schedule"
            element={
              <ManagerRoute>
                <ManagerWeeklySchedule />
              </ManagerRoute>
            }
          />
          <Route
            path="/manager/leave-approval"
            element={
              <ManagerRoute>
                <LeaveApprovals />
              </ManagerRoute>
            }
          />
          <Route
            path="/"
            element={
              authUser ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/leaves" element={<EmployeeLeaves />} />
          <Route path="/clock-in" element={<EmployeeClockIn />} />
          <Route path="/schedule" element={<MySchedule />} />


          {/* Login route — redirect if already logged in */}
          <Route
            path="/login"
            element={
              authUser ? <Navigate to="/home" replace /> : <Login />
            }
          />

          {/* Protected Home */}
          <Route
            path="/home"
            element={
              authUser ? <Home /> : <Navigate to="/login" replace />
            }
          />

          {/* Open public routes */}
          <Route path="/pricing" element={<div>Pricing Page</div>} />
          <Route path="/demo" element={<div>Book a Demo Page</div>} />

        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
