// src/pages/RTODetails.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RTODetails = () => {
  const { customerId } = useParams();
  const [customerDetails, setCustomerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetch(`http://13.127.21.70:8000/rto/-list/${customerId}`, {
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
          setCustomerDetails(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [customerId, token, navigate]);

  if (loading) return <p>Loading customer details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="customer-details">
      <h2>{customerDetails.first_name} {customerDetails.last_name}</h2>
      <p><strong>Address:</strong> {customerDetails.address}</p>
      <p><strong>Vehicle:</strong> {customerDetails.vehicle_name} ({customerDetails.vehicle_variant})</p>
      <p><strong>Status:</strong> {customerDetails.status}</p>
      <p><strong>Phone Number:</strong> {customerDetails.phone_number}</p>
      {/* Add more fields as necessary */}
    </div>
  );
};

export default RTODetails;
