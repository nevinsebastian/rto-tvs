import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaUser, FaPhone, FaCar, FaIdCard, FaCheckCircle, FaTimesCircle, FaSyncAlt, FaExclamationCircle } from 'react-icons/fa'; // Added Exclamation Circle Icon
import '../styles/CustomerDetailsModern.css'; // New modern CSS styles

const CustomerDetails = () => {
  const { customerId } = useParams();
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
    return <div className="loading">Loading customer details...</div>;
  }

  const displayField = (field) => {
    return field !== null && field !== undefined ? field : 'Not provided';
  };

  const renderStatusAlert = () => {
    if (customerData.status === 'submitted') {
      if (customerData.sales_verified) {
        return (
          <div className="status-alert verified">
            <FaCheckCircle /> Verified
          </div>
        );
      } else {
        return (
          <div className="status-alert verification-pending">
            <FaExclamationCircle /> Verification Pending
          </div>
        );
      }
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
          <FaTimesCircle /> Status: {customerData.status}
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
          <div><strong>Name:</strong> {displayField(customerData.name)}</div>
          <div><strong>Phone Number:</strong> {displayField(customerData.phone_number)}</div>
        </div>
      </div>

      <div className="customer-section">
        <div className="section-title"><FaCar /> Vehicle Information</div>
        <div className="details-grid">
          <div><strong>Vehicle Name:</strong> {displayField(customerData.vehicle_name)}</div>
          <div><strong>Variant:</strong> {displayField(customerData.vehicle_variant)}</div>
          <div><strong>Ex-showroom Price:</strong> ₹{displayField(customerData.ex_showroom_price)} </div>
          <div><strong>Tax:</strong> ₹{displayField(customerData.tax)} </div>
          <div><strong>On-road Price:</strong> {displayField(customerData.onroad_price)}</div>
        </div>
      </div>

      <div className="customer-section">
        <div className="section-title"><FaIdCard /> Verification Status</div>
        <div className="details-grid">
          <div><strong>Sales Verified:</strong> {customerData.sales_verified ? <FaCheckCircle className="verified" /> : <FaTimesCircle className="not-verified" />}</div>
          <div><strong>Accounts Verified:</strong> {customerData.accounts_verified ? <FaCheckCircle className="verified" /> : <FaTimesCircle className="not-verified" />}</div>
        </div>
      </div>

      <div className="customer-section">
        <div className="section-title"><FaIdCard /> Documents</div>
        <div className="details-grid">
          <div>
            <strong>Aadhaar Front:</strong>
            {customerData.photo_adhaar_front ? (
              <img src={customerData.photo_adhaar_front} alt="Aadhaar Front" className="document-image" />
            ) : (
              displayField(customerData.photo_adhaar_front)
            )}
          </div>
          <div>
            <strong>Aadhaar Back:</strong>
            {customerData.photo_adhaar_back ? (
              <img src={customerData.photo_adhaar_back} alt="Aadhaar Back" className="document-image" />
            ) : (
              displayField(customerData.photo_adhaar_back)
            )}
          </div>
          <div>
            <strong>Passport Photo:</strong>
            {customerData.photo_passport ? (
              <img src={customerData.photo_passport} alt="Passport Photo" className="document-image" />
            ) : (
              displayField(customerData.photo_passport)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
