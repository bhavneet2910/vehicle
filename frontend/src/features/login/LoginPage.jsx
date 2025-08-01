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
  const [authMode, setAuthMode] = useState("login"); // "login" or "signup"
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [cpfNumber, setCpfNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (authMode === "login") {
      // Login mode - only CPF and password required
      if (!cpfNumber || !password) {
        setError("CPF Number and Password are required.");
        return;
      }
    } else {
      // Signup mode - all fields required
      if (!email || !password || !name || !designation || !cpfNumber || !phoneNumber) {
        setError("All fields are required.");
        return;
      }
    }

    setIsLoading(true);
    setError("");

    try {
      let userData;
      
      if (authMode === "login") {
        // Login with CPF and password - let system detect role automatically
        userData = await authService.login(cpfNumber, password);
      } else {
        // Signup with all details
        userData = await authService.signup(email, password, loginMode, {
          name,
          designation,
          cpfNumber,
          phoneNumber
        });
      }
      
      login(userData);
      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else if (userData.role === "co") {
        navigate("/co/dashboard");
      } else {
        navigate("/vehicle-selection");
      }
    } catch (err) {
      setError(authMode === "login" ? "Invalid CPF or password." : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setDesignation("");
    setCpfNumber("");
    setPhoneNumber("");
    setError("");
  };

  const handleAuthModeChange = (mode) => {
    setAuthMode(mode);
    clearForm();
  };

  return (
    <div className="container">
      <div className="header fade-in">
        <h1>Government Vehicle Management</h1>
        <p>{authMode === "login" ? "Login to access vehicle booking system" : "Create your account"}</p>
      </div>
      
      <div className="card fade-in" style={{ maxWidth: "400px", margin: "0 auto" }}>
        {/* Auth Mode Toggle */}
        <div style={{ 
          display: "flex", 
          background: "#f8f9fa", 
          borderRadius: "12px", 
          padding: "4px", 
          marginBottom: "20px" 
        }}>
          <button
            onClick={() => handleAuthModeChange("login")}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              background: authMode === "login" ? "#667eea" : "transparent",
              color: authMode === "login" ? "white" : "#333",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            Login
          </button>
          <button
            onClick={() => handleAuthModeChange("signup")}
            style={{
              flex: 1,
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              background: authMode === "signup" ? "#667eea" : "transparent",
              color: authMode === "signup" ? "white" : "#333",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            Signup
          </button>
        </div>

        {/* Login Mode Toggle - Only show for signup */}
        {authMode === "signup" && (
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
              Employee
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
              CO
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
              Admin
            </button>
          </div>
        )}

        <h2 style={{ textAlign: "center", marginBottom: "30px", color: "#333", fontSize: "1.8rem" }}>
          {authMode === "login" ? "Welcome Back" : loginMode === "admin" ? "Admin Registration" : loginMode === "co" ? "CO Registration" : "Employee Registration"}
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
          {/* CPF Number - Required for both login and signup */}
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

          {/* Password - Required for both login and signup */}
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

          {/* Additional fields only for signup */}
          {authMode === "signup" && (
            <>
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
            </>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "10px" }}
            disabled={isLoading}
          >
            {isLoading ? (authMode === "login" ? "Signing In..." : "Creating Account...") : (authMode === "login" ? "Sign In" : "Create Account")}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", color: "#666" }}>
          <small>
            {authMode === "login" 
              ? "Demo: Use any CPF number and password to login" 
              : "Demo: Fill all fields to create your account"
            }
          </small>
        </div>

        {authMode === "signup" && loginMode === "admin" && (
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

        {/* Debug Section - Remove this in production */}
        <div style={{ 
          background: "#fff3cd", 
          padding: "15px", 
          borderRadius: "8px", 
          marginTop: "20px",
          border: "1px solid #ffc107"
        }}>
          <h4 style={{ marginBottom: "10px", color: "#856404" }}>Debug: Stored Users</h4>
          <div style={{ fontSize: "12px", color: "#856404" }}>
            {(() => {
              const users = authService.getAllUsers();
              if (users.length === 0) {
                return "No users stored yet. Sign up to create users.";
              }
              return users.map(user => (
                <div key={user.cpfNumber} style={{ marginBottom: "5px" }}>
                  <strong>CPF:</strong> {user.cpfNumber} | <strong>Role:</strong> {user.role} | <strong>Name:</strong> {user.name}
                </div>
              ));
            })()}
          </div>
          <button 
            onClick={() => {
              authService.clearStorage();
              window.location.reload();
            }}
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              background: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px"
            }}
          >
            Clear All Users
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
