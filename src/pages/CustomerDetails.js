import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  FaUser,
  FaCar,
  FaIdCard,
  FaCheckCircle,
  FaExclamationCircle,
  FaSyncAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaTimesCircle,
} from 'react-icons/fa';
import '../styles/CustomerDetailsModern.css';

const CustomerDetails = () => {
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    delivery_photo: null,
    number_plate_front: null,
    number_plate_back: null,
  });

  useEffect(() => {
    const fetchCustomerById = async () => {
      try {
        const response = await fetch(`https://api.tophaventvs.com:8000/sales/customers/${customerId}`, {
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

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleFileChange = (field, file) => {
    setFormData({
      ...formData,
      [field]: file,
    });
  };

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleSaveClick = async () => {
    const formDataToSubmit = new FormData();
    if (formData.number_plate_front) {
      formDataToSubmit.append('number_plate_front', formData.number_plate_front);
    }
    if (formData.number_plate_back) {
      formDataToSubmit.append('number_plate_back', formData.number_plate_back);
    }
    if (formData.delivery_photo) {
      formDataToSubmit.append('delivery_photo', formData.delivery_photo);
    }

    try {
      const response = await fetch(`https://api.tophaventvs.com:8000/sales/customers/delivery-update/${customerId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSubmit,
      });

      if (response.ok) {
        const updatedData = await response.json();
        setCustomerData(updatedData);
        setEditMode(false);
      } else {
        const errorData = await response.json();
        console.error('Failed to update delivery details:', errorData);
      }
    } catch (error) {
      console.error('Error updating delivery details:', error);
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
  };

  const handleVerifyClick = async () => {
    try {
      const response = await fetch(`https://api.tophaventvs.com:8000/sales/verify/${customerId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
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
    const isImageField = field.startsWith('photo_') || field === 'customer_sign';

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

  const renderDeliveryPhotoUpload = () => {
    if (customerData && customerData.registered) {
      return (
        <div className="field-container">
          <strong>Delivery Photo:</strong>
          {editMode ? (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange('delivery_photo', e.target.files[0])}
            />
          ) : (
            <img src={customerData.delivery_photo} alt="Delivery" className="document-image" />
          )}
        </div>
      );
    }
    return null;
  };

  const renderStatusAlert = () => {
    const { status, sales_verified } = customerData;
    if (status === 'Submitted') {
      return sales_verified ? (
        <div className="status-alert verified">
          <FaCheckCircle /> Verified
        </div>
      ) : (
        <div className="status-alert verification-pending">
          <FaExclamationCircle /> Verification Pending
        </div>
      );
    } else if (status === 'Pending') {
      return (
        <div className="status-alert pending">
          <FaSyncAlt /> Waiting for customer's data
        </div>
      );
    } else if (status === 'Verified') {
      return (
        <div className="status-alert verified">
          <FaCheckCircle /> Customer Verified
        </div>
      );
    } else {
      return (
        <div className="status-alert not-verified">
          <FaTimes /> Status: {status}
        </div>
      );
    }
  };

  const renderVerificationStatus = (label, field) => {
    return (
      <div className="verification-status">
        <strong>{label}:</strong>
        {customerData[field] ? (
          <FaCheckCircle style={{ color: 'green' }} />
        ) : (
          <FaTimesCircle style={{ color: 'red' }} />
        )}
      </div>
    );
  };

  // Adding the link rendering
  const renderCustomerLink = () => {
    if (customerData.link) {
      return (
        <div className="field-container">
          <strong>Customer Form Link:</strong>
          <a href={customerData.link} target="_blank" rel="noopener noreferrer">
            {customerData.link}
          </a>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="customer-details-modern">
      {renderStatusAlert()}

      <div className="customer-section">
        <div className="section-title"><FaUser /> Personal Information</div>
        <div className="details-grid">
          {renderField('First Name', 'first_name')}
          {renderField('Last Name', 'last_name')}
          {renderField('Phone Number', 'phone_number')}
          {renderField('Alternate Phone', 'alternate_phone_number')}
          {renderField('Address', 'address')}
          {renderField('Pin Code', 'pin_code')}
          {renderField('Date of Birth', 'dob', 'date')}
          {renderField('Nominee', 'nominee')}
          {renderField('Relation with Nominee', 'relation')}
          {renderField('Branch ID', 'branch_id')}
        </div>
      </div>

      {/* Render customer form link */}
      {renderCustomerLink()}

      <div className="customer-section">
        <div className="section-title"><FaCar /> Vehicle Information</div>
        <div className="details-grid">
          {renderField('Vehicle Name', 'vehicle_name')}
          {renderField('Vehicle Variant', 'vehicle_variant')}
          {renderField('Vehicle Color', 'vehicle_color')}
          {renderField('Ex-showroom Price', 'ex_showroom_price')}
          {renderField('Tax', 'tax')}
          {renderField('Amount Paid', 'amount_paid')}
          {renderField('Balance Amount', 'balance_amount')}
        </div>
      </div>

      {renderDeliveryPhotoUpload()}

      <div className="customer-section">
        <div className="section-title"><FaIdCard /> Verification Status</div>
        {renderVerificationStatus('Sales Verified', 'sales_verified')}
        {renderVerificationStatus('Accounts Verified', 'accounts_verified')}
        {renderVerificationStatus('RTO Verified', 'rto_verified')}
      </div>

      {editMode ? (
        <div className="action-buttons">
          <button onClick={handleSaveClick}><FaSave /> Save</button>
          <button onClick={handleCancelClick}><FaTimes /> Cancel</button>
        </div>
      ) : (
        <button onClick={handleEditClick}><FaEdit /> Edit</button>
      )}

      {!customerData.sales_verified && (
        <button className="verify-button" onClick={handleVerifyClick}>
          <FaCheckCircle /> Swipe to Verify
        </button>
      )}
    </div>
  );
};

export default CustomerDetails;
