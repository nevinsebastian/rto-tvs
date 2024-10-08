// src/pages/Accounts.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Accounts.css'; // Assuming you have this CSS file for styling

const Accounts = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('verified'); // default filter is 'verified'

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetch('https://13.127.21.70:8000/accounts/customers', {
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
          setFilteredCustomers(data.filter((customer) => customer.accounts_verified));
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleFilterChange = (status) => {
    setFilter(status);
    if (status === 'verified') {
      setFilteredCustomers(customers.filter((customer) => customer.accounts_verified));
    } else {
      setFilteredCustomers(customers.filter((customer) => !customer.accounts_verified));
    }
  };

  const handleCardClick = (customerId) => {
    // Navigate to the account customer details page
    navigate(`/account-customer-details/${customerId}`);
  };

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-left">
          <h2>Welcome, {user?.first_name} {user?.last_name}</h2>
        </div>
        <div className="navbar-right">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="content">
        <h1>Accounts Dashboard</h1>
        <p>Role: Accounts</p>

        {/* Filter buttons */}
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

        {/* Loading/Error states */}
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        {/* Customer cards */}
        <div className="customer-cards">
          {!loading && filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div
                key={customer.customer_id}
                className="customer-card"
                onClick={() => handleCardClick(customer.customer_id)}
              >
                <h3>{customer.name}</h3>
                <p>Phone: {customer.phone_number}</p>
                <p>Status: {customer.accounts_verified ? 'Verified' : 'Pending'}</p>
                <p>Vehicle: {customer.vehicle_name}</p>
              </div>
            ))
          ) : (
            <p>No customers found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Accounts;
