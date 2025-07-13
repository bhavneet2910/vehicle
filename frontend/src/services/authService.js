import api from './api';

const authService = {
  login: async (email, password, loginMode = "employee") => {
    try {
      // For now, simulate a successful login
      // In a real app, this would make an API call
      const response = await api.login(email, password);
      
      // Determine role based on login mode and email
      let role = "employee";
      if (loginMode === "admin" || email.includes('admin')) {
        role = "admin";
      }
      
      // Simulate API response
      const userData = {
        id: 1,
        email: email,
        role: role,
        name: email.split('@')[0],
        loginMode: loginMode
      };
      
      return userData;
    } catch (error) {
      throw new Error('Login failed');
    }
  }
};

export default authService;
