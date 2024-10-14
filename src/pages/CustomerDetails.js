import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUser, FaCar, FaIdCard, FaCheckCircle, FaExclamationCircle, FaSyncAlt, FaEdit, FaSave, FaTimes, FaCheck } from 'react-icons/fa';
import '../styles/CustomerDetailsModern.css';

const CustomerDetails = () => {
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchCustomerById = async () => {
      try {
        const response = await fetch(`https://13.127.21.70:8000/sales/customers/${customerId}`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setCustomerData(data);
        setFormData(data);
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    };

    fetchCustomerById();
  }, [customerId]);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch(`https://13.127.21.70:8000/sales/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setCustomerData(updatedData);
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating customer details:', error);
    }
  };

  const handleCancelClick = () => {
    setFormData(customerData);
    setEditMode(false);
  };

  const handleVerifyClick = async () => {
    try {
      const response = await fetch(`https://13.127.21.70:8000/sales/verify/${customerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message); // Show success message
      } else {
        const error = await response.json();
        console.error('Verification error:', error);
        alert('Failed to verify customer sales.');
      }
    } catch (error) {
      console.error('Error verifying customer sales:', error);
    }
  };

  if (!customerData) {
    return <div className="loading">Loading customer details...</div>;
  }

  const renderField = (label, field, type = 'text') => {
    const isImageField = field.startsWith('photo_') || field === 'customer_sign'; // Include signature field as image



    return (
      <div className="field-container">
        <strong>{label}:</strong>
        {editMode ? (
          isImageField ? (
            <input
              type="text"
              value={formData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              placeholder="Enter image URL"
            />
          ) : (
            <input
              type={type}
              value={formData[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
            />
          )
        ) : isImageField ? (
          <img src={customerData[field]} alt={label} className="document-image" />
        ) : (
          <span>{customerData[field] || 'Not provided'}</span>
        )}
      </div>
    );
  };

  const renderStatusAlert = () => {
    if (customerData.status === 'submitted') {
      return customerData.sales_verified ? (
        <div className="status-alert verified">
          <FaCheckCircle /> Verified
        </div>
      ) : (
        <div className="status-alert verification-pending">
          <FaExclamationCircle /> Verification Pending
        </div>
      );
    } else if (customerData.status === 'Pending') {
      return (
        <div className="status-alert pending">
          <FaSyncAlt /> Waiting for customer's data
        </div>
      );
    } else if (customerData.status === 'Verified') {
      return (
        <div className="status-alert verified">
          <FaCheckCircle /> Customer Verified
        </div>
      );
    } else {
      return (
        <div className="status-alert not-verified">
          <FaTimes /> Status: {customerData.status}
        </div>
      );
    }
  };

  return (
    <div className="customer-details-modern">
      {renderStatusAlert()}

      <div className="customer-section">
        <div className="section-title"><FaUser /> Personal Information</div>
        <div className="details-grid">
          {renderField('Name', 'name')}
          {renderField('Phone Number', 'phone_number')}
          {renderField('Address', 'address')}
        </div>
      </div>

      <div className="customer-section">
        <div className="section-title"><FaCar /> Vehicle Information</div>
        <div className="details-grid">
          {renderField('Vehicle Name', 'vehicle_name')}
          {renderField('Variant', 'vehicle_variant')}
          {renderField('Ex-showroom Price', 'ex_showroom_price', 'number')}
          {renderField('Tax', 'tax', 'number')}
          {renderField('On-road Price', 'onroad_price', 'number')}
        </div>
      </div>

      <div className="customer-section">
        <div className="section-title"><FaIdCard /> Verification Status</div>
        <div className="details-grid">
          {renderField('Sales Verified', 'sales_verified', 'checkbox')}
          {renderField('Accounts Verified', 'accounts_verified', 'checkbox')}
        </div>
      </div>

      <div className="customer-section">
        <div className="section-title"><FaIdCard /> Documents</div>
        <div className="details-grid">
          {renderField('Aadhaar Front', 'photo_adhaar_front')}
          {renderField('Aadhaar Back', 'photo_adhaar_back')}
          {renderField('Passport Photo', 'photo_passport')}
          {renderField('Customer Signature', 'customer_sign')} {/* Added signature display */}
        </div>
      </div>

      {!editMode && (
        <>
          <button className="edit-button" onClick={handleEditClick}>
            <FaEdit /> Edit Details
          </button>
          <button className="verify-button" onClick={handleVerifyClick}>
            <FaCheck /> Verify Sales
          </button>
        </> 
      )}

      {editMode && (
        <div className="action-buttons">
          <button className="save-button" onClick={handleSaveClick}><FaSave /> Save</button>
          <button className="cancel-button" onClick={handleCancelClick}><FaTimes /> Cancel</button>
        </div>
      )}
    </div>
  );
};

export default CustomerDetails;
