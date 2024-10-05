import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/RTODetails.css'; // Create this CSS file for custom styling

const RTODetails = () => {
  const { customerId } = useParams(); // Extract customer ID from URL
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetch(`http://13.127.21.70:8000/rto/${customerId}`, {
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
    }
  }, [customerId, token, navigate]);

  if (loading) {
    return <p>Loading customer details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="rto-details-container">
      <h2>Customer Details</h2>
      {customer && (
        <div className="customer-details">
          <p><strong>Name:</strong> {customer.first_name} {customer.last_name}</p>
          <p><strong>Address:</strong> {customer.address}</p>
          <p><strong>Phone:</strong> {customer.phone_number}</p>
          <p><strong>Nominee:</strong> {customer.nominee} ({customer.relation})</p>
          <p><strong>Vehicle:</strong> {customer.vehicle_name} - {customer.vehicle_variant}</p>
          <p><strong>Ex-showroom Price:</strong> ₹{customer.ex_showroom_price}</p>
          <p><strong>Tax:</strong> ₹{customer.tax}</p>
          <p><strong>Status:</strong> {customer.status}</p>
          <p><strong>RTO Verified:</strong> {customer.rto_verified ? 'Yes' : 'No'}</p>
          <p><strong>Sales Verified:</strong> {customer.sales_verified ? 'Yes' : 'No'}</p>
          <p><strong>Accounts Verified:</strong> {customer.accounts_verified ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default RTODetails;
