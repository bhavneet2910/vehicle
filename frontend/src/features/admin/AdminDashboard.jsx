import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3001/api/requests?role=admin')
      .then(res => res.json())
      .then(setRequests)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id, status) => {
    try {
      await fetch(`http://localhost:3001/api/requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, actedBy: user?.id || 'adminUserId' })
      });
      setRequests(reqs => reqs.filter(r => r.id !== id));
    } catch (err) {
      setError('Failed to update request');
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  if (loading) return <div>Loading requests...</div>;
  if (error) return <div>Error: {error.toString()}</div>;

  return (
    <div className="container">
      <div className="header fade-in">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.name}! Manage vehicle booking requests</p>
      </div>
      <div className="card fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2>Requests Pending L1 Review</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <button 
              onClick={() => navigate("/admin/request-history")} 
              className="btn btn-primary"
              style={{ background: "#17a2b8", boxShadow: "0 4px 8px rgba(23, 162, 184, 0.3)" }}
            >
              📋 View All Requests
            </button>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
        <div>
          {requests.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              <h3>No requests pending L1 review</h3>
              <p>When CO forwards requests, they will appear here for your review.</p>
            </div>
          ) : (
            requests.map(req => (
              <div key={req.id} className="card" style={{ marginBottom: "20px", borderLeft: "4px solid #ffc107" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div>
                    <h3 style={{ marginBottom: "10px", color: "#333" }}>
                      Request #{req.id} - {req.details.vehicleName}
                    </h3>
                    <div style={{ color: "#666", marginBottom: "10px" }}>
                      <strong>Requested by:</strong> {req.details.userName} ({req.details.userEmail})
                    </div>
                    <div style={{ color: "#666", marginBottom: "10px" }}>
                      <strong>Submitted:</strong> {new Date(req.details.submittedAt).toLocaleDateString()}
                    </div>
                    <div style={{ color: "#666", marginBottom: "10px" }}>
                      <strong>CO CPS ID:</strong> {req.details.coCpsId}
                    </div>
                  </div>
                  <div style={{
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    background: "#ffc10720",
                    color: "#ffc107",
                    border: "2px solid #ffc107",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}>
                    {req.status}
                  </div>
                </div>
                <div className="grid grid-2">
                  <div>
                    <h4 style={{ marginBottom: "10px", color: "#333" }}>Journey Details</h4>
                    <div style={{ marginBottom: "8px" }}>
                      <strong>Departure:</strong> {req.details.departureDate} at {req.details.departureTime}
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <strong>Return:</strong> {req.details.returnDate} at {req.details.returnTime}
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <strong>Destination:</strong> {req.details.destination}
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                      <strong>Passengers:</strong> {req.details.passengers}
                    </div>
                  </div>
                  <div>
                    <h4 style={{ marginBottom: "10px", color: "#333" }}>Purpose</h4>
                    <div style={{
                      background: "#f8f9fa",
                      padding: "15px",
                      borderRadius: "8px",
                      border: "1px solid #e1e5e9"
                    }}>
                      {req.details.purpose}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                  <button
                    onClick={() => handleAction(req.id, "accepted_by_l1")}
                    className="btn btn-primary"
                    style={{ background: "#28a745", boxShadow: "0 4px 8px rgba(40, 167, 69, 0.3)" }}
                  >
                    ✅ Accept Request
                  </button>
                  <button
                    onClick={() => handleAction(req.id, "rejected_by_l1")}
                    className="btn btn-secondary"
                    style={{ background: "#dc3545", color: "white", boxShadow: "0 4px 8px rgba(220, 53, 69, 0.3)" }}
                  >
                    ❌ Reject Request
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 