import React from 'react';

const SalesExecutive = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <h1>Welcome, {user.first_name} {user.last_name}</h1>
      <p>Role: Sales Executive</p>
    </div>
  );
};

export default SalesExecutive;
