import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import LoginPage from "./features/login/LoginPage";
import VehicleSelectionPage from "./features/vehicle/VehicleSelectionPage";
import AdminDashboard from "./features/admin/AdminDashboard";

function App() {
  const [user, setUser] = React.useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/vehicle-selection" element={<VehicleSelectionPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;