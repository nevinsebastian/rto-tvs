import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SalesExecutive.css'; // Import the CSS for styling

const SalesExecutive = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    // Prevent back navigation
    const handleBackButton = (e) => {
      e.preventDefault();
      window.history.pushState(null, null, window.location.pathname);
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');  // Ensure that you navigate to '/login'
  };

  return (
    <div className="sales-executive-container">
      <div className="nav-bar">
        <span className="user-info">{user.first_name} {user.last_name}</span>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      {/* Insights Section */}
      <div className="insights-container">
        <div className="insight-box">
          <h2>Total Links Generated</h2>
          <p>{Math.floor(Math.random() * 1000)}</p>
        </div>
        <div className="insight-box">
          <h2>Waiting for Data</h2>
          <p>{Math.floor(Math.random() * 100)}</p>
        </div>
        <div className="insight-box">
          <h2>Pending Verification</h2>
          <p>{Math.floor(Math.random() * 100)}</p>
        </div>
        <div className="insight-box">
          <h2>Verified</h2>
          <p>{Math.floor(Math.random() * 100)}</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="main-content">
        <div className="login-form">
          <h1>Welcome, {user.first_name} {user.last_name}</h1>
          <p>Role: Sales Executive</p>
        </div>
        <div className="login-image">
          <img src="your-image.svg" alt="Login Visual" />
        </div>
      </div>
    </div>
  );
};

export default SalesExecutive;
