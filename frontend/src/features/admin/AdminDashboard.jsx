import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("pending");
  const [bookings, setBookings] = useState([]);

  // Load bookings from localStorage on component mount
  useEffect(() => {
    const savedBookings = JSON.parse(localStorage.getItem('vehicleBookings') || '[]');
    setBookings(savedBookings);
  }, []);

  const handleStatusUpdate = (bookingId, newStatus) => {
    const updatedBookings = bookings.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    );
    
    setBookings(updatedBookings);
    localStorage.setItem('vehicleBookings', JSON.stringify(updatedBookings));
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filteredBookings = bookings.filter(booking => {
    if (selectedTab === "all") return true;
    return booking.status === selectedTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "#ffc107";
      case "approved": return "#28a745";
      case "rejected": return "#dc3545";
      default: return "#6c757d";
    }
  };

  const getTabColor = (tabKey) => {
    switch (tabKey) {
      case "pending": return "#ffc107";
      case "approved": return "#28a745";
      case "rejected": return "#dc3545";
      case "all": return "#667eea";
      default: return "#6c757d";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (!user || user.role !== "admin") {
    navigate("/login");
    return null;
  }

  return (
    <div className="container">
      <div className="header fade-in">
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user.name}! Manage vehicle booking requests</p>
      </div>

      <div className="card fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h2>Booking Management</h2>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "30px", borderBottom: "2px solid #e1e5e9" }}>
          {[
            { key: "pending", label: "Pending", count: bookings.filter(b => b.status === "pending").length },
            { key: "approved", label: "Approved", count: bookings.filter(b => b.status === "approved").length },
            { key: "rejected", label: "Rejected", count: bookings.filter(b => b.status === "rejected").length },
            { key: "all", label: "All Requests", count: bookings.length }
          ].map(tab => {
            const isSelected = selectedTab === tab.key;
            const tabColor = getTabColor(tab.key);
            
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key)}
                style={{
                  padding: "12px 20px",
                  border: "none",
                  background: isSelected ? tabColor : "transparent",
                  color: isSelected ? "white" : "#333",
                  borderRadius: "8px 8px 0 0",
                  cursor: "pointer",
                  fontWeight: "600",
                  position: "relative",
                  transition: "all 0.3s ease",
                  borderBottom: isSelected ? `3px solid ${tabColor}` : "3px solid transparent"
                }}
              >
                {tab.label}
                <span style={{
                  background: isSelected ? "rgba(255,255,255,0.3)" : tabColor,
                  color: isSelected ? "white" : "white",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: "12px",
                  marginLeft: "8px",
                  fontWeight: "bold"
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bookings List */}
        <div>
          {filteredBookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
              <h3>No {selectedTab} bookings found</h3>
              {selectedTab === "pending" && (
                <p>When employees submit vehicle booking requests, they will appear here for your review.</p>
              )}
            </div>
          ) : (
            filteredBookings.map(booking => {
              const statusColor = getStatusColor(booking.status);
              
              return (
                <div key={booking.id} className="card" style={{ 
                  marginBottom: "20px",
                  borderLeft: `4px solid ${statusColor}`,
                  background: booking.status === "approved" ? "linear-gradient(135deg, #f8fff9 0%, #ffffff 100%)" :
                             booking.status === "rejected" ? "linear-gradient(135deg, #fff8f8 0%, #ffffff 100%)" :
                             booking.status === "pending" ? "linear-gradient(135deg, #fffef8 0%, #ffffff 100%)" :
                             "white"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                    <div>
                      <h3 style={{ marginBottom: "10px", color: "#333" }}>
                        Booking #{booking.id} - {booking.vehicleName}
                      </h3>
                      <div style={{ color: "#666", marginBottom: "10px" }}>
                        <strong>Requested by:</strong> {booking.userName} ({booking.userEmail})
                      </div>
                      <div style={{ color: "#666", marginBottom: "10px" }}>
                        <strong>Submitted:</strong> {formatDate(booking.submittedAt)}
                      </div>
                    </div>
                    <div style={{
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      background: statusColor + "20",
                      color: statusColor,
                      border: "2px solid " + statusColor,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}>
                      {booking.status}
                    </div>
                  </div>

                  <div className="grid grid-2">
                    <div>
                      <h4 style={{ marginBottom: "10px", color: "#333" }}>Journey Details</h4>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>Departure:</strong> {formatDate(booking.departureDate)} at {formatTime(booking.departureTime)}
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>Return:</strong> {formatDate(booking.returnDate)} at {formatTime(booking.returnTime)}
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>Destination:</strong> {booking.destination}
                      </div>
                      <div style={{ marginBottom: "8px" }}>
                        <strong>Passengers:</strong> {booking.passengers}
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
                        {booking.purpose}
                      </div>
                    </div>
                  </div>

                  {booking.status === "pending" && (
                    <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                      <button
                        onClick={() => handleStatusUpdate(booking.id, "approved")}
                        className="btn btn-primary"
                        style={{ 
                          background: "#28a745",
                          boxShadow: "0 4px 8px rgba(40, 167, 69, 0.3)"
                        }}
                      >
                        ✅ Approve Request
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(booking.id, "rejected")}
                        className="btn btn-secondary"
                        style={{ 
                          background: "#dc3545", 
                          color: "white",
                          boxShadow: "0 4px 8px rgba(220, 53, 69, 0.3)"
                        }}
                      >
                        ❌ Reject Request
                      </button>
                    </div>
                  )}

                  {booking.status === "approved" && (
                    <div style={{ 
                      marginTop: "20px", 
                      padding: "15px", 
                      background: "#d4edda", 
                      borderRadius: "8px",
                      border: "1px solid #c3e6cb",
                      color: "#155724"
                    }}>
                      <strong>✅ Approved</strong> - This booking has been approved and the vehicle is reserved.
                    </div>
                  )}

                  {booking.status === "rejected" && (
                    <div style={{ 
                      marginTop: "20px", 
                      padding: "15px", 
                      background: "#f8d7da", 
                      borderRadius: "8px",
                      border: "1px solid #f5c6cb",
                      color: "#721c24"
                    }}>
                      <strong>❌ Rejected</strong> - This booking request has been rejected.
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 