import React from 'react';
import { useParams } from 'react-router-dom';

const CustomerInfo = () => {
  const { name } = useParams();

  return (
    <div style={styles.container}>
      <h1>Customer Data Collection Page</h1>
      <p>Welcome, {decodeURIComponent(name)}! Please fill in your details below.</p>
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