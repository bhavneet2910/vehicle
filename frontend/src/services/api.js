const API_BASE_URL = 'http://localhost:3001/api'; // adjust port as needed

const api = {
  login: async ({ cpfNumber, password, loginMode }) => {
    // For demo purposes, simulate successful login
    // In real app, this would make an actual API call
    return {
      user: {
        cpfNumber,
        role: loginMode === 'admin' ? 'admin' : loginMode === 'co' ? 'co' : 'employee',
        name: 'Demo User',
        designation: 'Demo Designation',
        email: 'demo@example.com',
        phoneNumber: '1234567890',
        loginMode
      }
    };
  },

  signup: async ({ email, password, loginMode, name, designation, cpfNumber, phoneNumber }) => {
    // For demo purposes, simulate successful signup
    // In real app, this would make an actual API call to register the user
    return {
      user: {
        email,
        role: loginMode === 'admin' ? 'admin' : loginMode === 'co' ? 'co' : 'employee',
        name,
        designation,
        cpfNumber,
        phoneNumber,
        loginMode
      }
    };
  },

  submitRequest: async ({ employeeId, details }) => {
    const res = await fetch(`${API_BASE_URL}/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, details })
    });
    return res.json();
  },

  getRequests: async ({ role, employeeId, status, coCpsId }) => {
    let url = `${API_BASE_URL}/requests?role=${role}`;
    if (role === 'employee' && employeeId) {
      url += `&employeeId=${employeeId}`;
    }
    if (role === 'co' && coCpsId) {
      url += `&coCpsId=${coCpsId}`;
    }
    if (status) {
      url += `&status=${status}`;
    }
    const res = await fetch(url);
    return res.json();
  },

  // New method: Get all accepted requests
  getAcceptedRequests: async () => {
    const res = await fetch(`${API_BASE_URL}/requests/accepted`);
    return res.json();
  },

  // New method: Get all rejected requests
  getRejectedRequests: async () => {
    const res = await fetch(`${API_BASE_URL}/requests/rejected`);
    return res.json();
  },

  // New method: Get all completed requests (accepted + rejected)
  getCompletedRequests: async () => {
    const res = await fetch(`${API_BASE_URL}/requests/completed`);
    return res.json();
  },

  updateRequestStatus: async ({ id, status, actedBy }) => {
    const res = await fetch(`${API_BASE_URL}/requests/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, actedBy })
    });
    return res.json();
  }
};

export default api;