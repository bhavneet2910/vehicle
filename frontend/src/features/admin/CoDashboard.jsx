import React, { useEffect, useState } from 'react';
import api from '../../services/api';

function CoDashboard({ coUserId }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.getRequests({ role: 'co' })
      .then(setRequests)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (id, status) => {
    try {
      await api.updateRequestStatus({ id, status, actedBy: coUserId || 'coUserId' });
      setRequests(reqs => reqs.filter(r => r.id !== id));
    } catch (err) {
      setError('Failed to update request');
    }
  };

  if (loading) return <div>Loading requests...</div>;
  if (error) return <div>Error: {error.toString()}</div>;

  return (
    <div>
      <h2>CO Dashboard</h2>
      {requests.length === 0 ? (
        <p>No pending requests for review.</p>
      ) : (
        requests.map(req => (
          <div key={req.id} style={{ border: '1px solid #ccc', margin: '1em 0', padding: '1em' }}>
            <p><strong>Request ID:</strong> {req.id}</p>
            <p><strong>Employee ID:</strong> {req.employeeId}</p>
            <p><strong>Vehicle:</strong> {req.details.vehicleName}</p>
            <p><strong>Destination:</strong> {req.details.destination}</p>
            <p><strong>Purpose:</strong> {req.details.purpose}</p>
            <p><strong>Departure:</strong> {req.details.departureDate} at {req.details.departureTime}</p>
            <p><strong>Return:</strong> {req.details.returnDate} at {req.details.returnTime}</p>
            <p><strong>Passengers:</strong> {req.details.passengers}</p>
            <button onClick={() => handleAction(req.id, 'rejected_by_co')}>Reject</button>
            <button onClick={() => handleAction(req.id, 'forwarded_to_l1')}>Forward to L1</button>
          </div>
        ))
      )}
    </div>
  );
}

export default CoDashboard; 