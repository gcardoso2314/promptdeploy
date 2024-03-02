import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return null;
  }

  if (!currentUser) {
    navigate("/login", { state: { from: location } });
  }

  return children;
};

export default PrivateRoute;
