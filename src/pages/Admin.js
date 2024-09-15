import React from 'react';

const Admin = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <h1>Welcome, {user.first_name} {user.last_name}</h1>
      <p>Role: Admin</p>
    </div>
  );
};

export default Admin;
