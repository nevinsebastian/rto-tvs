import React from 'react';
import Navbar from '../components/Navbar';

const NewCustomer = () => {
  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <h1>New Customer</h1>
        {/* Your new customer form */}
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '60px', // Adjust based on navbar height
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#f0f0f0',
    minHeight: '100vh',
  },
  content: {
    padding: '20px',
  }
};

export default NewCustomer;
