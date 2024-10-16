import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaIdCard, FaMotorcycle, FaMoneyBillWave } from 'react-icons/fa'; // Updated icon for motorcycle
import '../styles/AccountCustomerDetails.css';

const AccountCustomerDetails = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [financeAmount, setFinanceAmount] = useState(''); // Finance amount state
  const [financeId, setFinanceId] = useState(''); // Finance ID state
  const [showFinanceForm, setShowFinanceForm] = useState(false); // New state for toggling finance form

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
        triggerVerificationAnimation(); // Trigger animation on verification
      })
      .catch((error) => {
        alert(`Verification failed: ${error.message}`);
      });
  };

  const handleFinanceSubmit = () => {
    // Debugging log to ensure values are correct
    console.log(`Finance ID: ${financeId}, Finance Amount: ${financeAmount}`);
  
    // Basic validation for finance amount
    if (!financeId || isNaN(financeAmount) || financeAmount <= 0) {
      alert('Please enter a valid finance ID and amount.');
      return;
    }
  
    // Prepare request body with all customer details
    const requestBody = new URLSearchParams({
      first_name: customer.first_name || '', // Provide empty values if undefined
      last_name: customer.last_name || '',
      phone_number: customer.phone_number || '',
      alternate_phone_number: customer.alternate_phone_number || '',
      dob: customer.dob || '',
      email: customer.email || '',
      address: customer.address || '',
      pin_code: customer.pin_code || '',
      nominee: customer.nominee || '',
      relation: customer.relation || '',
      vehicle_name: customer.vehicle_name || '',
      vehicle_variant: customer.vehicle_variant || '',
      vehicle_color: customer.vehicle_color || '',
      ex_showroom_price: customer.ex_showroom_price || 0, // Default to 0 if not available
      tax: customer.tax || 0,
      insurance: customer.insurance || 0,
      tp_registration: customer.tp_registration || 0,
      man_accessories: customer.man_accessories || 0,
      optional_accessories: customer.optional_accessories || 0,
      total_price: customer.total_price || 0,
      amount_paid: customer.amount_paid || 0,
      finance_amount: financeAmount, // Use the new finance amount
      vehicle_number: customer.vehicle_number || '', // Provide empty values if undefined
    });
  
    // Sending the request
    fetch(`https://13.127.21.70:8000/accounts/customers/${customerId}/${financeId}`, {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((err) => {
            throw new Error(err.detail || `Error: ${response.status} ${response.statusText}`);
          });
        }
        return response.json();
      })
      .then((data) => {
        alert('Finance updated successfully!');
        setCustomer((prev) => ({
          ...prev,
          finance_id: financeId,
          finance_amount: financeAmount,
        }));
        setShowFinanceForm(false); // Hide form after submission
      })
      .catch((error) => {
        console.error('Failed to update finance:', error.message);
        alert(`Failed to update finance: ${error.message}`);
      });
  };
  
  
  
  
  // Verification animation handler
  const triggerVerificationAnimation = () => {
    const button = document.querySelector('.verify-button');
    button.classList.add('verifying');
    setTimeout(() => {
      button.classList.remove('verifying');
    }, 2000); // 2-second animation
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
            <div className="detail-item">
              <span className="label">Alternate Phone:</span>
              <span className="value">{customer.alternate_phone_number}</span>
            </div>
            <div className="detail-item">
              <span className="label">DOB:</span>
              <span className="value">{customer.dob || 'N/A'}</span>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="section vehicle">
            <h3><FaMotorcycle /> Vehicle Information</h3>
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
              <span className="value">₹{customer.ex_showroom_price.toLocaleString()}</span>
            </div>
          </div>

          {/* Financial Details */}
          <div className="section financial">
            <h3><FaMoneyBillWave /> Financial Information</h3>
            <div className="detail-item">
              <span className="label">Tax:</span>
              <span className="value">₹{customer.tax.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="label">Insurance:</span>
              <span className="value">₹{customer.insurance.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="label">TP Registration:</span>
              <span className="value">₹{customer.tp_registration.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="label">Amount Paid:</span>
              <span className="value">₹{customer.amount_paid.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="label">Balance Amount:</span>
              <span className="value">₹{customer.balance_amount.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="label">Total Price:</span>
              <span className="value">₹{customer.total_price.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="label">Finance ID:</span>
              <span className="value">{customer.finance_id}</span>
            </div>
            <div className="detail-item">
              <span className="label">Finance Amount:</span>
              <span className="value">₹{customer.finance_amount.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="label">Registered:</span>
              <span className="value">{customer.registered ? 'Yes' : 'No'}</span>
            </div>
          </div>

          {/* Add Finance Button */}
          {!showFinanceForm && (
            <button onClick={() => setShowFinanceForm(true)}>
              Add Finance
            </button>
          )}

          {/* Finance Form */}
          {showFinanceForm && (
            <div className="finance-form">
              <label htmlFor="financeProvider">Finance ID:</label>
              <input
                type="text"
                id="financeProvider"
                value={financeId}
                onChange={(e) => setFinanceId(e.target.value)}
              />
              <label htmlFor="financeAmount">Finance Amount:</label>
              <input
                type="number"
                id="financeAmount"
                value={financeAmount}
                onChange={(e) => setFinanceAmount(e.target.value)}
              />
              <button onClick={handleFinanceSubmit}>Submit Finance</button>
              <button onClick={() => setShowFinanceForm(false)}>Cancel</button>
            </div>
          )}

          {/* Verification Button */}
          {!customer.accounts_verified && (
            <button className="verify-button" onClick={verifyCustomer}>
              Verify Customer
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountCustomerDetails;
