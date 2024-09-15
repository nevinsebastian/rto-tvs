import React from 'react';

const Manager = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <h1>Welcome, {user.first_name} {user.last_name}</h1>
      <p>Role: Manager</p>
    </div>
  );
};

export default Manager;
