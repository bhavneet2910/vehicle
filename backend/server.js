const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let requests = []; // In-memory storage for demo

// Employee submits a request
app.post('/api/requests', (req, res) => {
  const { employeeId, details } = req.body;
  const newRequest = {
    id: requests.length + 1,
    employeeId,
    details,
    status: 'pending_co',
    history: [{ action: 'submitted', by: employeeId, at: new Date() }]
  };
  requests.push(newRequest);
  res.status(201).json(newRequest);
});

// Fetch requests for CO or Admin
app.get('/api/requests', (req, res) => {
  const { role, status, employeeId } = req.query;
  let filtered;
  
  if (role === 'co') {
    if (status) {
      // Filter by specific status for CO
      filtered = requests.filter(r => r.status === status);
    } else {
      // Default: show pending requests
      filtered = requests.filter(r => r.status === 'pending_co');
    }
  } else if (role === 'admin') {
    if (status) {
      // Filter by specific status for Admin
      filtered = requests.filter(r => r.status === status);
    } else {
      // Default: show forwarded requests
      filtered = requests.filter(r => r.status === 'forwarded_to_l1');
    }
  } else if (role === 'employee' && employeeId) {
    filtered = requests.filter(r => r.employeeId === employeeId);
  } else {
    // For general access, filter by status if provided
    if (status) {
      filtered = requests.filter(r => r.status === status);
    } else {
      filtered = requests;
    }
  }
  res.json(filtered);
});

// New endpoint: Get all accepted requests
app.get('/api/requests/accepted', (req, res) => {
  const acceptedRequests = requests.filter(r => 
    r.status === 'accepted_by_l1' || r.status === 'forwarded_to_l1'
  );
  res.json(acceptedRequests);
});

// New endpoint: Get all rejected requests
app.get('/api/requests/rejected', (req, res) => {
  const rejectedRequests = requests.filter(r => 
    r.status === 'rejected_by_co' || r.status === 'rejected_by_l1'
  );
  res.json(rejectedRequests);
});

// New endpoint: Get all completed requests (accepted + rejected)
app.get('/api/requests/completed', (req, res) => {
  const completedRequests = requests.filter(r => 
    r.status === 'accepted_by_l1' || 
    r.status === 'rejected_by_co' || 
    r.status === 'rejected_by_l1'
  );
  res.json(completedRequests);
});

// Update request status (CO or Admin)
app.patch('/api/requests/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, actedBy } = req.body;
  const request = requests.find(r => r.id == id);
  if (!request) return res.status(404).json({ error: 'Not found' });

  // Only allow valid transitions
  if (
    (request.status === 'pending_co' && (status === 'rejected_by_co' || status === 'forwarded_to_l1')) ||
    (request.status === 'forwarded_to_l1' && (status === 'accepted_by_l1' || status === 'rejected_by_l1'))
  ) {
    request.status = status;
    request.history.push({ action: status, by: actedBy, at: new Date() });
    return res.json(request);
  }
  res.status(400).json({ error: 'Invalid status transition' });
});

app.listen(3001, () => console.log('API running on http://localhost:3001'));