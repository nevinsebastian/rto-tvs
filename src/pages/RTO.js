import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RTO.css'; // Assuming the CSS file for RTO design

const RTO = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetch('http://13.127.21.70:8000/rto/customer-list', {
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
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Separate customers into pending and done based on rto_verified
  const pendingCustomers = customers.filter(customer => customer.rto_verified === null);
  const doneCustomers = customers.filter(customer => customer.rto_verified === true);

  return (
    <div className="rto-container" style={{ height: '100%' }}>
      <nav className="navbar">
        <h2 className="logo">RTO Dashboard</h2>
        <div className="navbar-right">
          <span className="username">
            Welcome, {user?.first_name} {user?.last_name}
          </span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="rto-section">
        <h3>Pending Verification</h3>
        <div className="rto-customer-list">
          {loading ? (
            <p className="rto-loading">Loading customers...</p>
          ) : error ? (
            <p className="rto-error">{error}</p>
          ) : pendingCustomers.length === 0 ? (
            <p>No pending customers.</p>
          ) : (
            pendingCustomers.map((customer) => (
              <div key={customer.customer_id} className="rto-customer-card">
                <h4>{customer.first_name} {customer.last_name}</h4>
                <p><strong>Vehicle:</strong> {customer.vehicle_name}</p>
                <p><strong>Status:</strong> Not Submitted</p>
              </div>
            ))
          )}
        </div>

        <h3>Verified Customers</h3>
        <div className="rto-customer-list">
          {doneCustomers.length === 0 ? (
            <p>No verified customers.</p>
          ) : (
            doneCustomers.map((customer) => (
              <div key={customer.customer_id} className="rto-customer-card">
                <h4>{customer.first_name} {customer.last_name}</h4>
                <p><strong>Vehicle:</strong> {customer.vehicle_name}</p>
                <p><strong>Status:</strong> Submitted</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RTO;
