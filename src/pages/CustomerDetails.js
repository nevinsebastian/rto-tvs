import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CustomerDetails = () => {
  const { customerId } = useParams(); // Get the customer ID from the URL
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    const fetchCustomerById = async () => {
      try {
        const response = await fetch(`http://13.127.21.70:8000/sales/customers/${customerId}`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setCustomerData(data);
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    };

    fetchCustomerById();
  }, [customerId]);

  if (!customerData) {
    return <div>Loading customer details...</div>;
  }

  return (
    <div className="customer-details">
      <h2>Customer Details</h2>
      <p><strong>ID:</strong> {customerData.customer_id}</p>
      <p><strong>Name:</strong> {customerData.name}</p>
      <p><strong>Phone:</strong> {customerData.phone_number}</p>
      <p><strong>Vehicle:</strong> {customerData.vehicle_name} - {customerData.vehicle_variant}</p>
      <p><strong>Ex-showroom Price:</strong> {customerData.ex_showroom_price}</p>
      <p><strong>Tax:</strong> {customerData.tax}</p>
      <p><strong>Status:</strong> {customerData.status}</p>
      {/* Add more details as required */}
    </div>
  );
};

export default CustomerDetails;
