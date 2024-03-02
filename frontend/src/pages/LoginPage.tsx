import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, currentUser, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return null;
  }

  if (currentUser) {
    navigate("/");
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      console.log("logging in");
      const fromPage = location.state?.from ? location.state.from : "/";
      await login(username, password, fromPage);
      // Redirect to another page or show success message
    } catch (error) {
      alert((error as Error).message); // Show error message
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-5">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Login</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-4 form-check">
              <label className="form-check-label">New user? Signup here</label>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
