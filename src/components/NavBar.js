// components/NavBar.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css'; // Import the CSS for NavBar

const NavBar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="nav-bar">
      <span className="user-info">{user.first_name} {user.last_name}</span>
      <button onClick={handleLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default NavBar;
