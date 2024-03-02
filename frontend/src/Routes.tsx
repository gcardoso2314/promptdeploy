import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PromptEditPage from "./pages/PromptEditPage";
import PrivateRoute from "./components/PrivateRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/prompt/:promptId"
        element={
          <PrivateRoute>
            <PromptEditPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
