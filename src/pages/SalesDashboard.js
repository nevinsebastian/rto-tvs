import React from 'react';
import Navbar from '../components/Navbar';

const SalesDashboard = () => {
  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <h1>Sales Dashboard</h1>
        {/* Your dashboard content */}
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

export default SalesDashboard;
