import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RTO.css'; // Updated styles

const RTO = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

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

  const handleCustomerClick = (customerId) => {
    navigate(`/rto/${customerId}`); // Navigate to RTODetails screen with the customer ID
  };

  const pendingCustomers = customers.filter((customer) => customer.rto_verified === null);
  const doneCustomers = customers.filter((customer) => customer.rto_verified === true);

  return (
    <div className="rto-container">
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
        {/* Toggle Buttons */}
        <div className="toggle-buttons">
          <button
            className={`toggle-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Verification
          </button>
          <button
            className={`toggle-button ${activeTab === 'verified' ? 'active' : ''}`}
            onClick={() => setActiveTab('verified')}
          >
            Verified Customers
          </button>
        </div>

        {/* Customer List based on Active Tab */}
        <div className="rto-customer-list">
          {loading ? (
            <p className="rto-loading">Loading customers...</p>
          ) : error ? (
            <p className="rto-error">{error}</p>
          ) : activeTab === 'pending' ? (
            pendingCustomers.length === 0 ? (
              <p>No pending customers.</p>
            ) : (
              pendingCustomers.map((customer) => (
                <div 
                  key={customer.customer_id} 
                  className="rto-customer-card"
                  onClick={() => handleCustomerClick(customer.customer_id)}  // Navigate on click
                >
                  <h4>{customer.first_name} {customer.last_name}</h4>
                  <p><strong>Vehicle:</strong> {customer.vehicle_name}</p>
                  <p className="status">Status: Not completed</p>
                </div>
              ))
            )
          ) : doneCustomers.length === 0 ? (
            <p>No verified customers.</p>
          ) : (
            doneCustomers.map((customer) => (
              <div 
                key={customer.customer_id} 
                className="rto-customer-card"
                onClick={() => handleCustomerClick(customer.customer_id)}  // Navigate on click
              >
                <h4>{customer.first_name} {customer.last_name}</h4>
                <p><strong>Vehicle:</strong> {customer.vehicle_name}</p>
                <p className="status">Status: Submitted</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RTO;
