import React from 'react';

const RTO = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div>
      <h1>Welcome, {user.first_name} {user.last_name}</h1>
      <p>Role: RTO</p>
    </div>
  );
};

export default RTO;
