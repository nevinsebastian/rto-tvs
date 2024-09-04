import React from 'react';
import { useLocation } from 'react-router-dom';

const CustomerInfo = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get('name');

  return (
    <div style={styles.container}>
      <h1>Customer Data Collection Page</h1>
      {name ? (
        <p>Welcome, {decodeURIComponent(name)}! Please fill in your details below.</p>
      ) : (
        <p>Customer name is not available.</p>
      )}
      {/* Add your customer data collection form here */}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    background: '#f0f0f0',
    minHeight: '100vh',
  },
};

export default CustomerInfo;
