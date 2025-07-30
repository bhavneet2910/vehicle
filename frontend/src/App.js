import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

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
          <AppRoutes />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;