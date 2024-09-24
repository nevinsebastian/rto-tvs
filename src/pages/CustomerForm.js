import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/CustomerForm.css'; // Ensure the CSS file is present
import DocumentScanner from './DocumentScanner'; // Import the DocumentScanner component

const CustomerForm = () => {
  const { link_token } = useParams();
  const [customerData, setCustomerData] = useState({});
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    aadhaar_front_photo: null,
    aadhaar_back_photo: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentField, setCurrentField] = useState('');

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(`https://192.168.29.198:8000/customer/customer-form/${link_token}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setCustomerData(data);
        setFormData((prev) => ({
          ...prev,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          address: data.address || '',
        }));
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchCustomerData();
  }, [link_token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch(`https://192.168.29.198:8000/customer/customer/${link_token}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to submit data');

      alert('Data submitted successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const closeCamera = () => {
    setCurrentField(''); // Close the camera view
  };

  return (
    <div className="customer-form-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">Error: {error}</p>
      ) : (
        <>
          <h2>Customer Data</h2>
          <div className="customer-data">
            <p><strong>Name:</strong> {customerData.name}</p>
            <p><strong>Phone Number:</strong> {customerData.phone_number}</p>
            {/* Additional customer details */}
          </div>

          <h2>Update Customer Information</h2>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              placeholder="First Name"
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              placeholder="Last Name"
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div className="file-inputs">
              {/* Aadhaar Front Photo */}
              {currentField === 'aadhaar_front_photo' ? (
                <DocumentScanner
                  onCapture={(blob) => {
                    setFormData((prev) => ({ ...prev, aadhaar_front_photo: blob }));
                    closeCamera(); // Close camera after capturing image
                  }}
                  onClose={closeCamera}
                />
              ) : (
                <button type="button" onClick={() => setCurrentField('aadhaar_front_photo')}>
                  Capture Aadhaar Front
                </button>
              )}

              {/* Aadhaar Back Photo */}
              {currentField === 'aadhaar_back_photo' ? (
                <DocumentScanner
                  onCapture={(blob) => {
                    setFormData((prev) => ({ ...prev, aadhaar_back_photo: blob }));
                    closeCamera(); // Close camera after capturing image
                  }}
                  onClose={closeCamera}
                />
              ) : (
                <button type="button" onClick={() => setCurrentField('aadhaar_back_photo')}>
                  Capture Aadhaar Back
                </button>
              )}
            </div>

            <button type="submit">Submit</button>
          </form>
        </>
      )}
    </div>
  );
};

export default CustomerForm;