
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const ManagerRoute = ({ children }) => {
  const { authUser } = useAuthStore();
  return authUser?.userType === "manager" ? children : <Navigate to="/home" replace />;
};

export default ManagerRoute;
