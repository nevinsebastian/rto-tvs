
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
  const [isCapturingFront, setIsCapturingFront] = useState(false);
  const [isCapturingBack, setIsCapturingBack] = useState(false);
  const [frontPreview, setFrontPreview] = useState(null); // State for front preview
  const [backPreview, setBackPreview] = useState(null);   // State for back preview

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
    
    // Loop through formData and add each field
    for (const key in formData) {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    }

    // Log formData keys and values for debugging
    for (let pair of formDataToSend.entries()) {
      console.log(pair[0]+ ', ' + pair[1]);
    }

    try {
      const response = await fetch(`https://192.168.29.198:8000/customer/customer/${link_token}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get error text for debugging
        console.error("Server response error: ", errorText);
        throw new Error('Failed to submit data');
      }

      alert('Data submitted successfully!');
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.message);
    }
  };

  const closeCamera = () => {
    setIsCapturingFront(false);
    setIsCapturingBack(false);
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
              {isCapturingFront ? (
                <DocumentScanner
                  onCapture={(blob) => {
                    const previewUrl = URL.createObjectURL(blob);
                    setFrontPreview(previewUrl); // Set preview for the front
                    setFormData((prev) => ({ ...prev, aadhaar_front_photo: blob }));
                    closeCamera();
                  }}
                  onClose={closeCamera}
                />
              ) : (
                <>
                  {frontPreview ? (
                    <div>
                      <h3>Front Preview:</h3>
                      <img src={frontPreview} alt="Front Preview" />
                      <button type="button" onClick={() => setIsCapturingFront(true)}>
                        Retake Front Photo
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setIsCapturingFront(true)}>
                      Capture Aadhaar Front
                    </button>
                  )}
                </>
              )}

              {/* Aadhaar Back Photo */}
              {isCapturingBack ? (
                <DocumentScanner
                  onCapture={(blob) => {
                    const previewUrl = URL.createObjectURL(blob);
                    setBackPreview(previewUrl); // Set preview for the back
                    setFormData((prev) => ({ ...prev, aadhaar_back_photo: blob }));
                    closeCamera();
                  }}
                  onClose={closeCamera}
                />
              ) : (
                <>
                  {backPreview ? (
                    <div>
                      <h3>Back Preview:</h3>
                      <img src={backPreview} alt="Back Preview" />
                      <button type="button" onClick={() => setIsCapturingBack(true)}>
                        Retake Back Photo
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setIsCapturingBack(true)}>
                      Capture Aadhaar Back
                    </button>
                  )}
                </>
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
