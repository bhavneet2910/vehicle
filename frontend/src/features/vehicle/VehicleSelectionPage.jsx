import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const VehicleSelectionPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
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

  const handleVehicleSelect = (vehicle) => {
    if (vehicle.status === "available") {
      setSelectedVehicle(vehicle);
      setShowBookingForm(true);
    }
  };

  const handleBookingSubmit = (e) => {
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

    // Get existing bookings from localStorage
    const existingBookings = JSON.parse(localStorage.getItem('vehicleBookings') || '[]');
    
    // Add new booking
    const updatedBookings = [...existingBookings, newBooking];
    
    // Save to localStorage
    localStorage.setItem('vehicleBookings', JSON.stringify(updatedBookings));

    alert("Vehicle booking submitted successfully! An administrator will review your request.");
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
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container">
      <div className="header fade-in">
        <h1>Vehicle Booking System</h1>
        <p>Welcome, {user.name}! Select a vehicle for your journey</p>
      </div>

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
                value={bookingData.passengers}
                onChange={(e) => setBookingData({...bookingData, passengers: parseInt(e.target.value)})}
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