// Basic API functions - you can modify these later
const API_BASE_URL = 'http://localhost:3001/api'; // adjust port as needed

export const api = {
  login: async (email, password) => {
    // Placeholder - replace with actual API call
    return { user: { email, role: 'user' } };
  }
};

export default api;