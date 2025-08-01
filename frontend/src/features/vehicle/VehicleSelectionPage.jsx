import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import api from "../../services/api";

const VehicleSelectionPage = () => {
  const { user, logout } = useContext(AuthContext);
  const { addNotification } = useNotification();
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasShownLoginNotification, setHasShownLoginNotification] = useState(false);
  const [bookingData, setBookingData] = useState({
    departureDate: "",
    departureTime: "",
    returnDate: "",
    returnTime: "",
    destination: "",
    purpose: "",
    passengers: 1
  });

  // Sample vehicle data
  const vehicles = [
    {
      id: 1,
      name: "Toyota Innova",
      type: "SUV",
      capacity: 7,
      fuelType: "Diesel",
      status: "available",
      image: "🚗"
    },
    {
      id: 2,
      name: "Maruti Swift",
      type: "Hatchback",
      capacity: 5,
      fuelType: "Petrol",
      status: "available",
      image: "🚙"
    },
    {
      id: 3,
      name: "Mahindra Bolero",
      type: "SUV",
      capacity: 8,
      fuelType: "Diesel",
      status: "booked",
      image: "🚐"
    },
    {
      id: 4,
      name: "Honda City",
      type: "Sedan",
      capacity: 5,
      fuelType: "Petrol",
      status: "available",
      image: "🚘"
    }
  ];

  // Load user's requests when component mounts
  useEffect(() => {
    if (user && user.id) {
      loadUserRequests();
    }
  }, [user]);

  // Show login notifications
  useEffect(() => {
    if (userRequests.length > 0 && !hasShownLoginNotification) {
      showLoginNotifications();
      setHasShownLoginNotification(true);
    }
  }, [userRequests, hasShownLoginNotification]);

  const showLoginNotifications = () => {
    userRequests.forEach(request => {
      if (request.status === 'accepted_by_l1') {
        addNotification({
          type: 'success',
          icon: '✅',
          title: 'Request Accepted!',
          message: `Your vehicle booking for ${request.details.vehicleName} has been approved!`
        });
      } else if (request.status === 'rejected_by_co' || request.status === 'rejected_by_l1') {
        addNotification({
          type: 'error',
          icon: '❌',
          title: 'Request Rejected',
          message: `Your vehicle booking for ${request.details.vehicleName} has been rejected.`
        });
      } else if (request.status === 'forwarded_to_l1') {
        addNotification({
          type: 'info',
          icon: '📤',
          title: 'Request Forwarded',
          message: `Your vehicle booking for ${request.details.vehicleName} has been forwarded to Admin for final approval.`
        });
      }
    });
  };

  const loadUserRequests = async () => {
    try {
      setLoading(true);
      const requests = await api.getRequests({ 
        role: 'employee', 
        employeeId: user.id 
      });
      setUserRequests(requests);
    } catch (error) {
      console.error('Failed to load user requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted_by_l1':
        return { background: '#d4edda', color: '#155724', border: '#28a745', icon: '✅' };
      case 'rejected_by_co':
      case 'rejected_by_l1':
        return { background: '#f8d7da', color: '#721c24', border: '#dc3545', icon: '❌' };
      case 'forwarded_to_l1':
        return { background: '#fff3cd', color: '#856404', border: '#ffc107', icon: '📤' };
      case 'pending_co':
        return { background: '#d1ecf1', color: '#0c5460', border: '#17a2b8', icon: '⏳' };
      default:
        return { background: '#e2e3e5', color: '#383d41', border: '#6c757d', icon: '❓' };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'accepted_by_l1':
        return 'Request Accepted!';
      case 'rejected_by_co':
        return 'Request Rejected by CO';
      case 'rejected_by_l1':
        return 'Request Rejected by Admin';
      case 'forwarded_to_l1':
        return 'Request Forwarded to Admin';
      case 'pending_co':
        return 'Request Pending CO Review';
      default:
        return status;
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case 'accepted_by_l1':
        return 'Your vehicle booking request has been approved! You can proceed with your journey.';
      case 'rejected_by_co':
        return 'Your vehicle booking request has been rejected by the CO. Please contact your supervisor for more details.';
      case 'rejected_by_l1':
        return 'Your vehicle booking request has been rejected by the Admin. Please contact the administration for more details.';
      case 'forwarded_to_l1':
        return 'Your request has been forwarded to the Admin for final approval. You will be notified once a decision is made.';
      case 'pending_co':
        return 'Your request is currently under review by the CO. You will be notified once a decision is made.';
      default:
        return 'Your request status is being processed.';
    }
  };

  const handleVehicleSelect = (vehicle) => {
    if (vehicle.status === "available") {
      setSelectedVehicle(vehicle);
      setShowBookingForm(true);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Create booking object
    const newBooking = {
      id: Date.now(), // Simple ID generation
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      vehicleName: selectedVehicle.name,
      vehicleId: selectedVehicle.id,
      departureDate: bookingData.departureDate,
      departureTime: bookingData.departureTime,
      returnDate: bookingData.returnDate,
      returnTime: bookingData.returnTime,
      destination: bookingData.destination,
      purpose: bookingData.purpose,
      passengers: bookingData.passengers,
      status: "pending",
      submittedAt: new Date().toISOString()
    };

    try {
      // Send booking to backend
      const response = await fetch('http://localhost:3001/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: user.id,
          details: newBooking
        })
      });

      if (!response.ok) throw new Error('Failed to submit booking');
      
      const data = await response.json();
      
      // Show success notification
      addNotification({
        type: 'success',
        icon: '📝',
        title: 'Booking Submitted!',
        message: 'Your vehicle booking request has been submitted successfully and is under review.'
      });
      
      setShowBookingForm(false);
      setSelectedVehicle(null);
      setBookingData({
        departureDate: "",
        departureTime: "",
        returnDate: "",
        returnTime: "",
        destination: "",
        purpose: "",
        passengers: 1
      });
      
      // Reload user requests to show the new request
      await loadUserRequests();
    } catch (err) {
      addNotification({
        type: 'error',
        icon: '❌',
        title: 'Booking Failed',
        message: 'Failed to submit booking. Please try again.'
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="container">
      <div className="header fade-in">
        <h1>Vehicle Booking System</h1>
        <p>Welcome, {user.name}! Select a vehicle for your journey</p>
      </div>

      {/* Notification Section for Request Status */}
      {userRequests.length > 0 && (
        <div className="card fade-in" style={{ marginBottom: "20px" }}>
          <h2 style={{ marginBottom: "20px", color: "#333" }}>
            📋 Your Request Status
          </h2>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
              Loading your requests...
            </div>
          ) : (
            <div>
              {userRequests.map((request) => {
                const statusStyle = getStatusColor(request.status);
                return (
                  <div 
                    key={request.id} 
                    className="card" 
                    style={{ 
                      marginBottom: "15px", 
                      borderLeft: `4px solid ${statusStyle.border}`,
                      background: statusStyle.background + "10"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ marginBottom: "10px", color: "#333" }}>
                          {statusStyle.icon} {getStatusLabel(request.status)}
                        </h3>
                        <p style={{ color: "#666", marginBottom: "10px" }}>
                          {getStatusMessage(request.status)}
                        </p>
                        <div style={{ fontSize: "14px", color: "#666" }}>
                          <strong>Vehicle:</strong> {request.details.vehicleName} | 
                          <strong> Destination:</strong> {request.details.destination} | 
                          <strong> Date:</strong> {request.details.departureDate}
                        </div>
                        {request.history && request.history.length > 0 && (
                          <div style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>
                            <strong>Last Updated:</strong> {new Date(request.history[request.history.length - 1].at).toLocaleDateString()}
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
                        {request.status.replace(/_/g, ' ')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="card fade-in">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2>Available Vehicles</h2>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>

        <div className="grid grid-3">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`vehicle-card ${selectedVehicle?.id === vehicle.id ? 'selected' : ''}`}
              onClick={() => handleVehicleSelect(vehicle)}
            >
              <div style={{ fontSize: "3rem", textAlign: "center", marginBottom: "15px" }}>
                {vehicle.image}
              </div>
              <h3 style={{ marginBottom: "10px", color: "#333" }}>{vehicle.name}</h3>
              <div style={{ marginBottom: "8px" }}>
                <strong>Type:</strong> {vehicle.type}
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>Capacity:</strong> {vehicle.capacity} persons
              </div>
              <div style={{ marginBottom: "8px" }}>
                <strong>Fuel:</strong> {vehicle.fuelType}
              </div>
              <div className={`status status-${vehicle.status}`}>
                {vehicle.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showBookingForm && selectedVehicle && (
        <div className="card slide-in">
          <h2>Book Vehicle: {selectedVehicle.name}</h2>
          <form onSubmit={handleBookingSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Departure Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={bookingData.departureDate}
                  onChange={(e) => setBookingData({...bookingData, departureDate: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Departure Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={bookingData.departureTime}
                  onChange={(e) => setBookingData({...bookingData, departureTime: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Return Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={bookingData.returnDate}
                  onChange={(e) => setBookingData({...bookingData, returnDate: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Return Time</label>
                <input
                  type="time"
                  className="form-input"
                  value={bookingData.returnTime}
                  onChange={(e) => setBookingData({...bookingData, returnTime: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Destination</label>
              <input
                type="text"
                className="form-input"
                value={bookingData.destination}
                onChange={(e) => setBookingData({...bookingData, destination: e.target.value})}
                placeholder="Enter destination"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Purpose of Journey</label>
              <textarea
                className="form-input"
                value={bookingData.purpose}
                onChange={(e) => setBookingData({...bookingData, purpose: e.target.value})}
                placeholder="Describe the purpose of your journey"
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Number of Passengers</label>
              <input
                type="number"
                className="form-input"
                value={bookingData.passengers === "" ? "" : bookingData.passengers}
                onChange={(e) => {
                  const value = e.target.value;
                  setBookingData({
                    ...bookingData,
                    passengers: value === "" ? "" : parseInt(value)
                  });
                }}
                min="1"
                max={selectedVehicle.capacity}
                required
              />
            </div>

            <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
              <button type="submit" className="btn btn-primary">
                Submit Booking
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => {
                  setShowBookingForm(false);
                  setSelectedVehicle(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default VehicleSelectionPage; 