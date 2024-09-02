import React from 'react';
import { Link } from 'react-router-dom';

const SalesExecutiveHome = () => {
  return (
    <div style={styles.container}>
      <div style={styles.boxesContainer}>
        <Link to="/new-customer" style={styles.box}>
          <h2>New Customer</h2>
        </Link>
        <Link to="/dashboard" style={styles.box}>
          <h2>Dashboard</h2>
        </Link>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#f0f0f0',
    minHeight: '100vh'
  },
  boxesContainer: {
    display: 'flex',
    gap: '20px'
  },
  box: {
    width: '300px',
    height: '200px',
    borderRadius: '15px',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    textDecoration: 'none'
  }
};

export default SalesExecutiveHome;
