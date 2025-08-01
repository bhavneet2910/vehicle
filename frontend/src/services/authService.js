import api from './api';

// Persistent storage using localStorage for demo purposes
// In a real app, this would be stored in a database
const STORAGE_KEY = 'vehicle_management_users';

const getStoredUsers = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Map(JSON.parse(stored)) : new Map();
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return new Map();
  }
};

const saveStoredUsers = (userMap) => {
  try {
    const arrayFromMap = Array.from(userMap.entries());
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arrayFromMap));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const authService = {
  login: async (cpfNumber, password) => {
    try {
      // Get stored users from localStorage
      const userStorage = getStoredUsers();
      
      // Check if user exists in our storage
      const storedUser = userStorage.get(cpfNumber);
      
      if (!storedUser) {
        // If user doesn't exist, create a demo user (for demo purposes)
        const demoUser = {
          id: 1,
          cpfNumber: cpfNumber,
          role: 'employee', // Default to employee for demo users
          name: 'Demo User',
          designation: 'Demo Designation',
          email: 'demo@example.com',
          phoneNumber: '1234567890',
          loginMode: 'employee'
        };
        userStorage.set(cpfNumber, demoUser);
        saveStoredUsers(userStorage);
        return demoUser;
      }
      
      // Return the stored user with their original role
      return storedUser;
    } catch (error) {
      throw new Error('Login failed');
    }
  },

  signup: async (email, password, loginMode = "employee", userDetails = {}) => {
    try {
      // Get stored users from localStorage
      const userStorage = getStoredUsers();
      
      // Create new user data
      const userData = {
        id: Math.floor(Math.random() * 1000) + 1,
        email: email,
        role: loginMode === 'admin' ? 'admin' : loginMode === 'co' ? 'co' : 'employee',
        name: userDetails.name || '',
        designation: userDetails.designation || '',
        cpfNumber: userDetails.cpfNumber || '',
        phoneNumber: userDetails.phoneNumber || '',
        loginMode: loginMode
      };
      
      // Store the user in our storage using CPF as key
      if (userDetails.cpfNumber) {
        userStorage.set(userDetails.cpfNumber, userData);
        saveStoredUsers(userStorage);
      }
      
      return userData;
    } catch (error) {
      throw new Error('Registration failed');
    }
  },

  // Helper method to get user by CPF (for debugging)
  getUserByCPF: (cpfNumber) => {
    const userStorage = getStoredUsers();
    return userStorage.get(cpfNumber);
  },

  // Helper method to clear storage (for testing)
  clearStorage: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  // Helper method to get all stored users (for debugging)
  getAllUsers: () => {
    const userStorage = getStoredUsers();
    return Array.from(userStorage.values());
  }
};

export default authService;
