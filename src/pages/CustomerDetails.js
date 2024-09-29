import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CustomerDetails = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      const response = await fetch(`http://13.127.21.70:8000/sales/customers/${customerId}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setCustomer(data);
      setFormData(data); // Initialize form data with fetched customer data
    };

    fetchCustomerDetails();
  }, [customerId]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`http://13.127.21.70:8000/sales/customers/${customerId}`, {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const updatedCustomer = await response.json();
      setCustomer(updatedCustomer); // Update the displayed customer data
      setIsEditing(false); // Exit edit mode
    }
  };

  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Customer Details</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          ) : (
            <span>{customer.name}</span>
          )}
        </div>
        <div>
          <label>Phone:</label>
          {isEditing ? (
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleInputChange}
              required
            />
          ) : (
            <span>{customer.phone_number}</span>
          )}
        </div>
        <div>
          <label>Vehicle:</label>
          {isEditing ? (
            <input
              type="text"
              name="vehicle_name"
              value={formData.vehicle_name}
              onChange={handleInputChange}
            />
          ) : (
            <span>{customer.vehicle_name} - {customer.vehicle_variant}</span>
          )}
        </div>
        <div>
          <label>Vehicle Color:</label>
          {isEditing ? (
            <input
              type="text"
              name="vehicle_color"
              value={formData.vehicle_color}
              onChange={handleInputChange}
            />
          ) : (
            <span>{customer.vehicle_color}</span>
          )}
        </div>
        {/* Add more fields as needed */}

        {isEditing ? (
          <button type="submit">Save Changes</button>
        ) : (
          <button type="button" onClick={handleEditClick}>Edit</button>
        )}
      </form>
    </div>
  );
};

export default CustomerDetails;
