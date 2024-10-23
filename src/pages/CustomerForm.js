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
    customer_sign: null,
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
        const response = await fetch(`https://api.tophaventvs.com:8000/customer/customer-form/${link_token}`);
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
      const response = await fetch(`https://api.tophaventvs.com:8000/customer/${link_token}`, {
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
        <p className="loading-text">Loading...</p>
      ) : error ? (
        <p className="error-message">Error: {error}</p>
      ) : (
        <>
          <h2 className="form-title">Welcome to TVS Top Haven</h2>
          <h3 className="greeting-message">
            Hi {customerData.name}, thank you for choosing us for your {customerData.vehicle_name}!
          </h3>

          {/* Modern Data Display Section */}
          <div className="data-display-container">
            <div className="data-card">
              <h4>Phone Number</h4>
              <p>{customerData.phone_number}</p>
            </div>
            <div className="data-card">
              <h4>Vehicle Variant</h4>
              <p>{customerData.vehicle_variant}</p>
            </div>
            <div className="data-card">
              <h4>Vehicle Color</h4>
              <p>{customerData.vehicle_color}</p>
            </div>
            <div className="data-card">
              <h4>Ex-Showroom Price</h4>
              <p>{customerData.ex_showroom_price}</p>
            </div>
            <div className="data-card">
              <h4>Tax</h4>
              <p>{customerData.tax}</p>
            </div>
            <div className="data-card">
              <h4>Insurance</h4>
              <p>{customerData.insurance}</p>
            </div>
            <div className="data-card">
              <h4>TP Registration</h4>
              <p>{customerData.tp_registration}</p>
            </div>
            <div className="data-card">
              <h4>Manufacturer Accessories</h4>
              <p>{customerData.man_accessories}</p>
            </div>
            <div className="data-card">
              <h4>Optional Accessories</h4>
              <p>{customerData.optional_accessories}</p>
            </div>
            <div className="data-card">
              <h4>Total Price</h4>
              <p>{customerData.total_price}</p>
            </div>
            <div className="data-card">
              <h4>Booking</h4>
              <p>{customerData.booking}</p>
            </div>
            <div className="data-card">
              <h4>Finance Amount</h4>
              <p>{customerData.finance_amount}</p>
            </div>
          </div>

          <h2 className="form-title">Update Customer Information</h2>
          <form onSubmit={handleSubmit} className="form">
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              placeholder="First Name"
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
              className="form-input"
            />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              placeholder="Last Name"
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
              className="form-input"
            />
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              required
              className="form-input"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="form-input"
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              placeholder="Address"
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="form-input"
            />
            <input
              type="text"
              name="pin_code"
              value={formData.pin_code}
              placeholder="Pin Code"
              onChange={(e) => setFormData({ ...formData, pin_code: e.target.value })}
              required
              className="form-input"
            />
            <input
              type="text"
              name="nominee"
              value={formData.nominee}
              placeholder="Nominee Name"
              onChange={(e) => setFormData({ ...formData, nominee: e.target.value })}
              required
              className="form-input"
            />
            <input
              type="text"
              name="relation"
              value={formData.relation}
              placeholder="Relation with Nominee"
              onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
              required
              className="form-input"
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
                    <div className="preview-container">
                      <h3>Front Preview:</h3>
                      <img src={frontPreview} alt="Front Preview" className="preview-image" />
                      <button type="button" onClick={() => setIsCapturingFront(true)} className="retake-button">
                        Retake Front Photo
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setIsCapturingFront(true)} className="capture-button">
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
                    <div className="preview-container">
                      <h3>Back Preview:</h3>
                      <img src={backPreview} alt="Back Preview" className="preview-image" />
                      <button type="button" onClick={() => setIsCapturingBack(true)} className="retake-button">
                        Retake Back Photo
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setIsCapturingBack(true)} className="capture-button">
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
                    <div className="preview-container">
                      <h3>Passport Preview:</h3>
                      <img src={passportPreview} alt="Passport Preview" className="preview-image" />
                      <button type="button" onClick={() => setIsCapturingPassport(true)} className="retake-button">
                        Retake Passport Photo
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setIsCapturingPassport(true)} className="capture-button">
                      Capture Passport Photo
                    </button>
                  )}
                </>
              )}

              {/* Customer Signature */}
              {isCapturingSign ? (
                <DocumentScanner
                  photoType="sign"
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
                    <div className="preview-container">
                      <h3>Signature Preview:</h3>
                      <img src={signPreview} alt="Signature Preview" className="preview-image" />
                      <button type="button" onClick={() => setIsCapturingSign(true)} className="retake-button">
                        Retake Signature
                      </button>
                    </div>
                  ) : (
                    <button type="button" onClick={() => setIsCapturingSign(true)} className="capture-button">
                      Capture Signature
                    </button>
                  )}
                </>
              )}
            </div>

            <button type="submit" className="submit-button">Submit</button>
          </form>
        </>
      )}
    </div>
  );
};

export default CustomerForm;
