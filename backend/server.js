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
  const { role } = req.query;
  let filtered;
  if (role === 'co') {
    filtered = requests.filter(r => r.status === 'pending_co');
  } else if (role === 'admin') {
    filtered = requests.filter(r => r.status === 'forwarded_to_l1');
  } else if (role === 'employee' && req.query.employeeId) {
    filtered = requests.filter(r => r.employeeId === req.query.employeeId);
  } else {
    filtered = requests;
  }
  res.json(filtered);
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