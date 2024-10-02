import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';  // Importing plus icon
import '../styles/AdminDashboard.css';

const Admin = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAddEmployee = () => {
    // Logic to add employee can be implemented here
    console.log('Add new employee');
    // Navigate to add employee form page or show a modal
  };

  return (
    <div className="admin-dashboard">
      <nav className="navbar">
        <h2 className="logo">Admin Dashboard</h2>
        <div className="navbar-right">
          <span className="username">
            Welcome, {user?.first_name} {user?.last_name}
          </span>
          <FiPlus className="add-icon" onClick={handleAddEmployee} /> {/* Plus icon */}
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      {/* You can add the employee creation form here when needed */}
    </div>
  );
};

export default Admin;
