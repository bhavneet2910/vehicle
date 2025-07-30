const API_BASE_URL = 'http://localhost:3001/api'; // adjust port as needed

const api = {
  login: async ({ email, password, loginMode, name, designation, cpfNumber, phoneNumber }) => {
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

  getRequests: async ({ role, employeeId }) => {
    let url = `${API_BASE_URL}/requests?role=${role}`;
    if (role === 'employee' && employeeId) {
      url += `&employeeId=${employeeId}`;
    }
    const res = await fetch(url);
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