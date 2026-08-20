import { Navigate } from "react-router-dom";
import { useAppSelector } from "../hooks/redux";

const ProtectedRoute = ({ children }: { children: any }) => {
  const user = useAppSelector((state) => state.main.user);
  return !user ? <Navigate to="/signin" replace /> : children;
};

export default ProtectedRoute;
