import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show popup notification
    setCurrentNotification(newNotification);
    setShowNotification(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const dismissCurrentNotification = () => {
    setShowNotification(false);
  };

  const value = {
    notifications,
    showNotification,
    currentNotification,
    addNotification,
    removeNotification,
    clearAllNotifications,
    dismissCurrentNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Notification Popup */}
      {showNotification && currentNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: currentNotification.type === 'success' ? '#d4edda' : 
                     currentNotification.type === 'error' ? '#f8d7da' : '#fff3cd',
          color: currentNotification.type === 'success' ? '#155724' : 
                 currentNotification.type === 'error' ? '#721c24' : '#856404',
          border: `2px solid ${currentNotification.type === 'success' ? '#28a745' : 
                              currentNotification.type === 'error' ? '#dc3545' : '#ffc107'}`,
          borderRadius: '8px',
          padding: '15px',
          maxWidth: '400px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000,
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>
                {currentNotification.icon} {currentNotification.title}
              </h4>
              <p style={{ margin: 0, fontSize: '14px' }}>
                {currentNotification.message}
              </p>
            </div>
            <button
              onClick={dismissCurrentNotification}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                marginLeft: '10px',
                color: 'inherit'
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}; 