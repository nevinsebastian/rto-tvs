import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css'; // Importing the CSS file for styles

const Admin = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user data
    localStorage.removeItem('token'); // Clear token if needed
    navigate('/login'); // Redirect to login page using navigate
  };

  return (
    <div className="admin-dashboard">
      <nav className="navbar">
        <h2 className="logo">Admin Dashboard</h2>
        <div className="navbar-right">
          <span className="username">
            Welcome, {user?.first_name} {user?.last_name}
          </span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="content">
        <h1>Dashboard Overview</h1>
        <p>This is your admin dashboard, where you can manage system settings and user accounts.</p>
      </div>
    </div>
  );
};

export default Admin;
