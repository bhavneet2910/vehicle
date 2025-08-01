import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../services/api";

const RequestHistory = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // "all", "accepted", "rejected", "completed"

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    setLoading(true);
    try {
      let data;
      switch (filter) {
        case "accepted":
          data = await api.getAcceptedRequests();
          break;
        case "rejected":
          data = await api.getRejectedRequests();
          break;
        case "completed":
          data = await api.getCompletedRequests();
          break;
        default:
          // For CO users, filter by their CPS ID
          if (user.role === 'co') {
            data = await api.getRequests({ role: user.role, coCpsId: user.cpfNumber });
          } else {
            data = await api.getRequests({ role: user.role });
          }
      }
      setRequests(data);
    } catch (err) {
      setError('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted_by_l1':
        return { background: '#d4edda', color: '#155724', border: '#28a745' };
      case 'rejected_by_co':
      case 'rejected_by_l1':
        return { background: '#f8d7da', color: '#721c24', border: '#dc3545' };
      case 'forwarded_to_l1':
        return { background: '#fff3cd', color: '#856404', border: '#ffc107' };
      case 'pending_co':
        return { background: '#d1ecf1', color: '#0c5460', border: '#17a2b8' };
      default:
        return { background: '#e2e3e5', color: '#383d41', border: '#6c757d' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'accepted_by_l1':
        return '✅ Accepted by L1';
      case 'rejected_by_co':
        return '❌ Rejected by CO';
      case 'rejected_by_l1':
        return '❌ Rejected by L1';
      case 'forwarded_to_l1':
        return '📤 Forwarded to L1';
      case 'pending_co':
        return '⏳ Pending CO Review';
      default:
        return status;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user || (user.role !== "admin" && user.role !== "co")) {
    navigate("/login");
    return null;
  }

  if (loading) return <div>Loading requests...</div>;
  if (error) return <div>Error: {error.toString()}</div>;

  return (
    <div className="container">
      <div className="header fade-in">
        <h1>Request History</h1>
        <p>
          View all vehicle booking requests and their status
          {user.role === 'co' && ` for your CPS ID: ${user.cpfNumber}`}
        </p>
      </div>
      
      <div className="card fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2>All Requests</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setFilter("all")}
              className="btn"
              style={{
                background: filter === "all" ? "#667eea" : "#f8f9fa",
                color: filter === "all" ? "white" : "#333",
                border: "1px solid #ddd"
              }}
            >
              All Requests
            </button>
            <button
              onClick={() => setFilter("accepted")}
              className="btn"
              style={{
                background: filter === "accepted" ? "#28a745" : "#f8f9fa",
                color: filter === "accepted" ? "white" : "#333",
                border: "1px solid #ddd"
              }}
            >
              ✅ Accepted
            </button>
            <button
              onClick={() => setFilter("rejected")}
              className="btn"
              style={{
                background: filter === "rejected" ? "#dc3545" : "#f8f9fa",
                color: filter === "rejected" ? "white" : "#333",
                border: "1px solid #ddd"
              }}
            >
              ❌ Rejected
            </button>
            <button
              onClick={() => setFilter("completed")}
              className="btn"
              style={{
                background: filter === "completed" ? "#17a2b8" : "#f8f9fa",
                color: filter === "completed" ? "white" : "#333",
                border: "1px solid #ddd"
              }}
            >
              📋 Completed
            </button>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <div style={{ 
            background: "#e3f2fd", 
            padding: "15px", 
            borderRadius: "8px", 
            border: "1px solid #2196f3",
            marginBottom: "20px"
          }}>
            <h4 style={{ marginBottom: "10px", color: "#1976d2" }}>Filter Summary:</h4>
            <p style={{ margin: 0, color: "#1976d2" }}>
              {filter === "all" && "Showing all requests"}
              {filter === "accepted" && "Showing only accepted requests"}
              {filter === "rejected" && "Showing only rejected requests"}
              {filter === "completed" && "Showing all completed requests (accepted + rejected)"}
            </p>
          </div>
        </div>

        <div>
          {requests.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              <h3>No requests found</h3>
              <p>No requests match the current filter criteria.</p>
            </div>
          ) : (
            <div>
              <div style={{ 
                background: "#f8f9fa", 
                padding: "15px", 
                borderRadius: "8px", 
                marginBottom: "20px",
                textAlign: "center"
              }}>
                <strong>Total Requests: {requests.length}</strong>
              </div>
              
              {requests.map(req => {
                const statusStyle = getStatusColor(req.status);
                return (
                  <div key={req.id} className="card" style={{ 
                    marginBottom: "20px", 
                    borderLeft: `4px solid ${statusStyle.border}`,
                    background: statusStyle.background + "10"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                      <div>
                        <h3 style={{ marginBottom: "10px", color: "#333" }}>
                          Request #{req.id} - {req.details.vehicleName}
                        </h3>
                        <div style={{ color: "#666", marginBottom: "10px" }}>
                          <strong>Requested by:</strong> {req.details.userName} ({req.details.userEmail})
                        </div>
                        <div style={{ color: "#666", marginBottom: "10px" }}>
                          <strong>Employee ID:</strong> {req.employeeId}
                        </div>
                        <div style={{ color: "#666", marginBottom: "10px" }}>
                          <strong>CO CPS ID:</strong> {req.details.coCpsId}
                        </div>
                        <div style={{ color: "#666", marginBottom: "10px" }}>
                          <strong>Submitted:</strong> {new Date(req.details.submittedAt).toLocaleDateString()}
                        </div>
                        {req.history && req.history.length > 0 && (
                          <div style={{ color: "#666", marginBottom: "10px" }}>
                            <strong>Last Action:</strong> {req.history[req.history.length - 1].action} by {req.history[req.history.length - 1].by} on {new Date(req.history[req.history.length - 1].at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <div style={{
                        padding: "8px 16px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        background: statusStyle.background,
                        color: statusStyle.color,
                        border: `2px solid ${statusStyle.border}`,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                      }}>
                        {getStatusLabel(req.status)}
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestHistory; 