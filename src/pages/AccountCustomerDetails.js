// src/pages/AccountCustomerDetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/AccountCustomerDetails.css';

const AccountCustomerDetails = () => {
  const { customerId } = useParams(); // Get customer ID from URL
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
    navigate('/accounts'); // Navigate back to the accounts dashboard
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
        alert(data.message); // Show success message
        setCustomer((prev) => ({ ...prev, accounts_verified: true })); // Update local state
      })
      .catch((error) => {
        alert(`Verification failed: ${error.message}`); // Show error message
      });
  };

  // Loading/Error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="customer-details">
      <button onClick={handleBack}>Back to Accounts</button>
      {customer && (
        <div className="customer-info">
          <h2>{customer.name}</h2>
          <p>First Name: {customer.first_name}</p>
          <p>Last Name: {customer.last_name}</p>
          <p>Address: {customer.address}</p>
          <p>Pin Code: {customer.pin_code}</p>
          <p>Phone: {customer.phone_number}</p>
          <p>Alternate Phone: {customer.alternate_phone_number}</p>
          <p>DOB: {customer.dob}</p>
          <p>Nominee: {customer.nominee} ({customer.relation})</p>
          <p>Status: {customer.status}</p>
          <p>Vehicle: {customer.vehicle_name} {customer.vehicle_variant}</p>
          <p>Ex-Showroom Price: ₹{customer.ex_showroom_price.toLocaleString()}</p>
          <p>Tax: ₹{customer.tax.toLocaleString()}</p>
          <p>Sales Verified: {customer.sales_verified ? 'Yes' : 'No'}</p>
          <p>Accounts Verified: {customer.accounts_verified ? 'Yes' : 'No'}</p>
          <p>RTO Verified: {customer.rto_verified ? 'Yes' : 'No'}</p>
          <img src={customer.photo_adhaar_front} alt="Aadhaar Front" />
          <img src={customer.photo_adhaar_back} alt="Aadhaar Back" />
          <img src={customer.photo_passport} alt="Passport" />
          
          {/* Button to verify customer */}
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
