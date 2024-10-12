// src/components/NavBar.jsx
import React from 'react';

const NavBar = ({ user, onLogout }) => {
  return (
    <div className="nav-bar">
      <span className="user-info">{user.first_name} {user.last_name}</span>
      <button onClick={onLogout} className="logout-button">Logout</button>
    </div>
  );
};

export default NavBar;
