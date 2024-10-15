import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaIdCard, FaCar, FaMoneyBillWave } from 'react-icons/fa';
import '../styles/AccountCustomerDetails.css';

const AccountCustomerDetails = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch(`https://13.127.21.70:8000/accounts/customers/${customerId}`, {
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
        setCustomer(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [customerId, token, navigate]);

  const handleBack = () => {
    navigate('/accounts');
  };

  const verifyCustomer = () => {
    fetch(`https://13.127.21.70:8000/accounts/verify/${customerId}`, {
      method: 'POST',
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
        alert(data.message);
        setCustomer((prev) => ({ ...prev, accounts_verified: true }));
      })
      .catch((error) => {
        alert(`Verification failed: ${error.message}`);
      });
  };

  const getStatusIcon = (status) => {
    return status ? <FaCheckCircle className="status-icon success" /> : <FaTimesCircle className="status-icon error" />;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="customer-details">
      <button onClick={handleBack}>Back to Accounts</button>
      {customer && (
        <div className="customer-info">
          <h2>{customer.name}</h2>

          {/* Personal Details */}
          <div className="section personal">
            <h3><FaIdCard /> Personal Information</h3>
            <div className="detail-item">
              <span className="label">First Name:</span>
              <span className="value">{customer.first_name}</span>
            </div>
            <div className="detail-item">
              <span className="label">Last Name:</span>
              <span className="value">{customer.last_name}</span>
            </div>
            <div className="detail-item">
              <span className="label">Address:</span>
              <span className="value">{customer.address}</span>
            </div>
            <div className="detail-item">
              <span className="label">Phone:</span>
              <span className="value">{customer.phone_number}</span>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="section vehicle">
            <h3><FaCar /> Vehicle Information</h3>
            <div className="detail-item">
              <span className="label">Vehicle:</span>
              <span className="value">{customer.vehicle_name} {customer.vehicle_variant}</span>
            </div>
            <div className="detail-item">
              <span className="label">Color:</span>
              <span className="value">{customer.vehicle_color}</span>
            </div>
            <div className="detail-item">
              <span className="label">Ex-Showroom Price:</span>
              <span className="value">₹{customer.ex_showroom_price ? customer.ex_showroom_price.toLocaleString() : 'N/A'}</span>
            </div>
          </div>

          {/* Monetary Details */}
          <div className="section financial">
            <h3><FaMoneyBillWave /> Financial Information</h3>
            <div className="detail-item">
              <span className="label">Tax:</span>
              <span className="value">₹{customer.tax ? customer.tax.toLocaleString() : 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Insurance:</span>
              <span className="value">₹{customer.insurance ? customer.insurance.toLocaleString() : 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">TP Registration:</span>
              <span className="value">₹{customer.tp_registration ? customer.tp_registration.toLocaleString() : 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Manufacturer Accessories:</span>
              <span className="value">₹{customer.man_accessories ? customer.man_accessories.toLocaleString() : 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Optional Accessories:</span>
              <span className="value">₹{customer.optional_accessories ? customer.optional_accessories.toLocaleString() : 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Total Price:</span>
              <span className="value">₹{customer.total_price ? customer.total_price.toLocaleString() : 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Amount Paid:</span>
              <span className="value">₹{customer.amount_paid ? customer.amount_paid.toLocaleString() : 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Balance Amount:</span>
              <span className="value">₹{customer.balance_amount ? customer.balance_amount.toLocaleString() : 'N/A'}</span>
            </div>
          </div>

          {/* Verify Button */}
          {!customer.accounts_verified && (
            <button onClick={verifyCustomer} className="verify-button">
              Verify Customer
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountCustomerDetails;
