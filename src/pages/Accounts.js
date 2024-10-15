// src/pages/Accounts.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Accounts.css'; // Assuming you have this CSS file for styling

const Accounts = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending'); // Default to 'pending'

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const fetchCustomers = (status) => {
    setLoading(true);
    const url =
      status === 'verified'
        ? 'https://13.127.21.70:8000/accounts/customers/verified'
        : 'https://13.127.21.70:8000/accounts/customers/pending';

    fetch(url, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        setCustomers(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchCustomers(filter);
    }
  }, [token, navigate, filter]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleFilterChange = (status) => {
    setFilter(status);
    fetchCustomers(status);
  };

  const handleCardClick = (customerId) => {
    navigate(`/account-customer-details/${customerId}`);
  };

  return (
    <div className="accounts-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-left">
          <h2>{`Hi, ${user?.first_name} ${user?.last_name}`}</h2>
        </div>
        <div className="navbar-right">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="content">
        <div className="dashboard-header">
          <h1>Accounts Dashboard</h1>
          <p>Role: Accounts</p>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button
            className={filter === 'verified' ? 'active' : ''}
            onClick={() => handleFilterChange('verified')}
          >
            Verified Accounts
          </button>
          <button
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => handleFilterChange('pending')}
          >
            Pending Accounts
          </button>
        </div>

        {/* Loading/Error States */}
        {loading && <p className="loading-text">Loading...</p>}
        {error && <p className="error-text">Error: {error}</p>}

        {/* Customer Cards */}
        <div className="customer-cards">
          {!loading && customers.length > 0 ? (
            customers.map((customer) => (
              <div
                key={customer.customer_id}
                className="customer-card"
                onClick={() => handleCardClick(customer.customer_id)}
              >
                <h3>{customer.name}</h3>
                <p>Phone: {customer.phone_number}</p>
                <p>Status: {filter === 'verified' ? 'Verified' : 'Pending'}</p>
                <p>Vehicle: {customer.vehicle_name}</p>
              </div>
            ))
          ) : (
            <p className="no-customers-text">No customers found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accounts;
