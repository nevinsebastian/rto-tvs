import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaIdCard, FaMotorcycle, FaMoneyBillWave } from 'react-icons/fa';
import '../styles/AccountCustomerDetails.css';

const financeOptions = {
  1: 'IDFC',
  2: 'HDFC',
  3: 'TVS Credit',
  4: 'Sreeramcheng',
  5: 'Tata Cap',
  6: 'HDB',
  7: 'Indus',
  8: 'Kotak',
  9: 'Sreeram Alp',
  10: 'Bajaj Alp'
};

const AccountCustomerDetails = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [financeAmount, setFinanceAmount] = useState('');
  const [financeId, setFinanceId] = useState('');
  const [showFinanceForm, setShowFinanceForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editableFields, setEditableFields] = useState({});

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    fetch(`https://api.tophaventvs.com:8000/accounts/customers/${customerId}`, {
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
        setEditableFields(data); // Initialize editable fields with fetched data
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
    fetch(`https://api.tophaventvs.com:8000/accounts/verify/${customerId}`, {
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

  const handleFinanceSubmit = () => {
    const requestBody = new URLSearchParams({
      first_name: editableFields.first_name || '',
      last_name: editableFields.last_name || '',
      phone_number: editableFields.phone_number || '',
      alternate_phone_number: editableFields.alternate_phone_number || '',
      dob: editableFields.dob || '',
      email: editableFields.email || '',
      address: editableFields.address || '',
      pin_code: editableFields.pin_code || '',
      nominee: editableFields.nominee || '',
      relation: editableFields.relation || '',
      vehicle_name: editableFields.vehicle_name || '',
      vehicle_variant: editableFields.vehicle_variant || '',
      vehicle_color: editableFields.vehicle_color || '',
      ex_showroom_price: editableFields.ex_showroom_price || 0,
      tax: editableFields.tax || 0,
      insurance: editableFields.insurance || 0,
      tp_registration: editableFields.tp_registration || 0,
      man_accessories: editableFields.man_accessories || 0,
      optional_accessories: editableFields.optional_accessories || 0,
      total_price: editableFields.total_price || 0,
      amount_paid: editableFields.amount_paid || 0,
      finance_amount: financeAmount,
      vehicle_number: editableFields.vehicle_number || '',
    });

    fetch(`https://api.tophaventvs.com:8000/accounts/customers/${customerId}/${financeId}`, {
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
        setShowFinanceForm(false);
      })
      .catch((error) => {
        alert(`Failed to update finance: ${error.message}`);
      });
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditableFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateCustomer = () => {
    const requestBody = new URLSearchParams(editableFields);

    fetch(`https://api.tophaventvs.com:8000/accounts/customers/${customerId}/${customer.finance_id}`, {
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
        alert('Customer updated successfully!');
        setCustomer(data);
        setShowEditForm(false);
      })
      .catch((error) => {
        alert(`Failed to update customer: ${error.message}`);
      });
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
            {['first_name', 'last_name', 'address', 'phone_number', 'alternate_phone_number', 'dob'].map((field) => (
              <div key={field} className="detail-item">
                <span className="label">{field.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}:</span>
                <input
                  type="text"
                  name={field}
                  value={editableFields[field] || ''}
                  onChange={handleFieldChange}
                  disabled={!showEditForm} // Disable fields if not in edit mode
                />
              </div>
            ))}
          </div>

          {/* Vehicle Details */}
          <div className="section vehicle">
            <h3><FaMotorcycle /> Vehicle Information</h3>
            {['vehicle_name', 'vehicle_variant', 'vehicle_color', 'ex_showroom_price'].map((field) => (
              <div key={field} className="detail-item">
                <span className="label">{field.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}:</span>
                <input
                  type="text"
                  name={field}
                  value={editableFields[field] || ''}
                  onChange={handleFieldChange}
                  disabled={!showEditForm}
                />
              </div>
            ))}
          </div>

          {/* Financial Details */}
          <div className="section financial">
            <h3><FaMoneyBillWave /> Financial Information</h3>
            {['tax', 'insurance', 'tp_registration', 'amount_paid', 'balance_amount', 'total_price', 'finance_id', 'finance_amount'].map((field) => (
              <div key={field} className="detail-item">
                <span className="label">{field.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())}:</span>
                <input
                  type="text"
                  name={field}
                  value={editableFields[field] || ''}
                  onChange={handleFieldChange}
                  disabled={!showEditForm}
                />
              </div>
            ))}
            <div className="detail-item">
              <span className="label">Registered:</span>
              <span className="value">{customer.registered ? 'Yes' : 'No'}</span>
            </div>
          </div>

          {/* Buttons */}
          <button onClick={() => setShowEditForm((prev) => !prev)}>
            {showEditForm ? 'Save Changes' : 'Edit Customer'}
          </button>
          {showEditForm && (
            <button onClick={handleUpdateCustomer}>
              Save
            </button>
          )}

          {/* Finance Form */}
          {!showFinanceForm && (
            <button onClick={() => setShowFinanceForm(true)}>Add Finance</button>
          )}
          {showFinanceForm && (
            <div className="finance-form">
              <h3>Add Finance</h3>
              <input
                type="text"
                placeholder="Finance Amount"
                value={financeAmount}
                onChange={(e) => setFinanceAmount(e.target.value)}
              />
              <select
                value={financeId}
                onChange={(e) => setFinanceId(e.target.value)}
              >
                <option value="">Select Finance</option>
                {Object.entries(financeOptions).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </select>
              <button onClick={handleFinanceSubmit}>Submit Finance</button>
              <button onClick={() => setShowFinanceForm(false)}>Cancel</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AccountCustomerDetails;
