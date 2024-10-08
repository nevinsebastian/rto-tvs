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
    dob: '',
    email: '',
    address: '',
    pin_code: '',
    nominee: '',
    relation: '',
    aadhaar_front_photo: null,
    aadhaar_back_photo: null,
    passport_photo: null,
    customer_sign: null, // Added for customer signature
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCapturingFront, setIsCapturingFront] = useState(false);
  const [isCapturingBack, setIsCapturingBack] = useState(false);
  const [isCapturingPassport, setIsCapturingPassport] = useState(false);
  const [isCapturingSign, setIsCapturingSign] = useState(false);
  const [frontPreview, setFrontPreview] = useState(null); 
  const [backPreview, setBackPreview] = useState(null);
  const [passportPreview, setPassportPreview] = useState(null);
  const [signPreview, setSignPreview] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(`https://13.127.21.70:8000/customer/customer-form/${link_token}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setCustomerData(data);
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

    try {
      const response = await fetch(`https://13.127.21.70:8000/customer/${link_token}`, {
        method: 'POST',
        body: formDataToSend,
      });
      

      if (!response.ok) {
        const errorText = await response.text(); 
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
    setIsCapturingPassport(false);
    setIsCapturingSign(false);
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
            <p><strong>Vehicle Name:</strong> {customerData.vehicle_name}</p>
            <p><strong>Vehicle Variant:</strong> {customerData.vehicle_variant}</p>
            <p><strong>Vehicle Color:</strong> {customerData.vehicle_color}</p>
            <p><strong>Ex-Showroom Price:</strong> {customerData.ex_showroom_price}</p>
            <p><strong>Tax:</strong> {customerData.tax}</p>
            <p><strong>Insurance:</strong> {customerData.insurance}</p>
            <p><strong>TP Registration:</strong> {customerData.tp_registration}</p>
            <p><strong>Manufacturer Accessories:</strong> {customerData.man_accessories}</p>
            <p><strong>Optional Accessories:</strong> {customerData.optional_accessories}</p>
            <p><strong>Total Price:</strong> {customerData.total_price}</p>
            <p><strong>Booking:</strong> {customerData.booking}</p>
            <p><strong>Finance Amount:</strong> {customerData.finance_amount}</p>
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
              type="date"
              name="dob"
              value={formData.dob}
              placeholder="Date of Birth"
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
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
            <input
              type="text"
              name="address"
              value={formData.address}
              placeholder="Address"
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
            <input
              type="text"
              name="pin_code"
              value={formData.pin_code}
              placeholder="Pin Code"
              onChange={(e) => setFormData({ ...formData, pin_code: e.target.value })}
              required
            />
            <input
              type="text"
              name="nominee"
              value={formData.nominee}
              placeholder="Nominee Name"
              onChange={(e) => setFormData({ ...formData, nominee: e.target.value })}
              required
            />
            <input
              type="text"
              name="relation"
              value={formData.relation}
              placeholder="Relation with Nominee"
              onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
              required
            />

            <div className="file-inputs">
              {/* Aadhaar Front Photo */}
              {isCapturingFront ? (
                <DocumentScanner
                  photoType="aadhaar_front"
                  onCapture={(blob) => {
                    const previewUrl = URL.createObjectURL(blob);
                    setFrontPreview(previewUrl); 
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
                  photoType="aadhaar_back"
                  onCapture={(blob) => {
                    const previewUrl = URL.createObjectURL(blob);
                    setBackPreview(previewUrl); 
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

              {/* Passport Photo */}
              {isCapturingPassport ? (
                <DocumentScanner
                  photoType="passport"
                  onCapture={(blob) => {
                    const previewUrl = URL.createObjectURL(blob);
                    setPassportPreview(previewUrl); 
                    setFormData((prev) => ({ ...prev, passport_photo: blob }));
                    closeCamera();
                  }}
                  onClose={closeCamera}
                />
              ) : (
                <>
                  {passportPreview ? (
                    <div>
                      <h3>Passport Preview:</h3>
                      <img src={passportPreview} alt="Passport Preview" />
                      <button type="button" onClick={() => setIsCapturingPassport(true)}>
                        Retake Passport Photo
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setIsCapturingPassport(true)}>
                      Capture Passport Photo
                    </button>
                  )}
                </>
              )}

              {/* Customer Signature */}
              {isCapturingSign ? (
                <DocumentScanner
                  photoType="signature"
                  onCapture={(blob) => {
                    const previewUrl = URL.createObjectURL(blob);
                    setSignPreview(previewUrl); 
                    setFormData((prev) => ({ ...prev, customer_sign: blob }));
                    closeCamera();
                  }}
                  onClose={closeCamera}
                />
              ) : (
                <>
                  {signPreview ? (
                    <div>
                      <h3>Signature Preview:</h3>
                      <img src={signPreview} alt="Signature Preview" />
                      <button type="button" onClick={() => setIsCapturingSign(true)}>
                        Retake Signature
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setIsCapturingSign(true)}>
                      Capture Signature
                    </button>
                  )}
                </>
              )}
            </div>

            <button type="submit">Submit Customer Information</button>
            {error && <p className="error-message">{error}</p>}
          </form>
        </>
      )}
    </div>
  );
};

export default CustomerForm;
