import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginMode, setLoginMode] = useState("employee"); // "employee", "admin", or "co"
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [cpfNumber, setCpfNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !name || !designation || !cpfNumber || !phoneNumber) {
      setError("All fields are required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const userData = await authService.login(email, password, loginMode, {
        name,
        designation,
        cpfNumber,
        phoneNumber
      });
      login(userData);
      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userData.role === "co") {
        navigate("/co/dashboard");
      } else {
        navigate("/vehicle-selection");
      }
    } catch (err) {
      setError("Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header fade-in">
        <h1>Government Vehicle Management</h1>
        <p>Login to access vehicle booking system</p>
      </div>
      
      <div className="card fade-in" style={{ maxWidth: "400px", margin: "0 auto" }}>
        {/* Login Mode Toggle */}
        <div style={{ 
          display: "flex", 
          background: "#f8f9fa", 
          borderRadius: "12px", 
          padding: "4px", 
          marginBottom: "30px" 
        }}>
          <button
            onClick={() => setLoginMode("employee")}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              background: loginMode === "employee" ? "#667eea" : "transparent",
              color: loginMode === "employee" ? "white" : "#333",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            Employee Login
          </button>
          <button
            onClick={() => setLoginMode("co")}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              background: loginMode === "co" ? "#667eea" : "transparent",
              color: loginMode === "co" ? "white" : "#333",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            CO Login
          </button>
          <button
            onClick={() => setLoginMode("admin")}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              background: loginMode === "admin" ? "#667eea" : "transparent",
              color: loginMode === "admin" ? "white" : "#333",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            Admin Login
          </button>
        </div>

        <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333", fontSize: "1.8rem" }}>
          {loginMode === "admin" ? "Admin Access" : loginMode === "co" ? "CO Access" : "Welcome Back"}
        </h2>

        {error && (
          <div style={{ 
            background: "#f8d7da", 
            color: "#721c24", 
            padding: "12px", 
            borderRadius: "8px", 
            marginBottom: "20px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Designation</label>
            <input
              type="text"
              className="form-input"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Enter your designation"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">CPF Number</label>
            <input
              type="text"
              className="form-input"
              value={cpfNumber}
              onChange={(e) => setCpfNumber(e.target.value)}
              placeholder="Enter your CPF number"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "10px" }}
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
          <small>
            {loginMode === "admin" 
              ? "Demo: Use any email with 'admin' in it to login as admin" 
              : "Demo: Use any email/password to login as employee"
            }
          </small>
        </div>

        {loginMode === "admin" && (
          <div style={{ 
            background: "#e3f2fd", 
            padding: "15px", 
            borderRadius: "8px", 
            marginTop: "20px",
            border: "1px solid #2196f3"
          }}>
            <h4 style={{ marginBottom: "10px", color: "#1976d2" }}>Admin Features:</h4>
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#1976d2" }}>
              <li>View all vehicle booking requests</li>
              <li>Approve or reject booking requests</li>
              <li>Manage vehicle availability</li>
              <li>Track booking history</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
