import React, { useState } from 'react';
import WebcamCapture from './WebcamCapture';
import './CustomerForm.css';  // Assuming you have a CSS file for styling

const CustomerForm = () => {
  const [aadhaarFront, setAadhaarFront] = useState(null);
  const [aadhaarBack, setAadhaarBack] = useState(null);
  const [passportPhoto, setPassportPhoto] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Handle form text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!aadhaarFront || !aadhaarBack || !passportPhoto) {
      alert('Please capture all required photos.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const formDataToSend = new FormData();
    formDataToSend.append('first_name', formData.first_name);
    formDataToSend.append('last_name', formData.last_name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('aadhaar_front_photo', aadhaarFront);
    formDataToSend.append('aadhaar_back_photo', aadhaarBack);
    formDataToSend.append('passport_photo', passportPhoto);

    try {
      const response = await fetch(`http://192.168.29.198:8000/customer/customer-submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to submit data');
      const data = await response.json();
      alert('Data submitted successfully!');
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="customer-form-container">
      <h2>Customer Form</h2>
      <form onSubmit={handleSubmit} className="customer-form">
        {/* Form text fields */}
        <div className="form-group">
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            placeholder="First Name"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            placeholder="Last Name"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="address"
            value={formData.address}
            placeholder="Address"
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Aadhaar Front Capture */}
        <h4>Capture Aadhaar Front</h4>
        <WebcamCapture type="aadhaar-front" onCapture={(image) => setAadhaarFront(image)} />
        {aadhaarFront && <img src={aadhaarFront} alt="Aadhaar Front Preview" className="preview-image" />}

        {/* Aadhaar Back Capture */}
        <h4>Capture Aadhaar Back</h4>
        <WebcamCapture type="aadhaar-back" onCapture={(image) => setAadhaarBack(image)} />
        {aadhaarBack && <img src={aadhaarBack} alt="Aadhaar Back Preview" className="preview-image" />}

        {/* Passport Photo Capture */}
        <h4>Capture Passport Size Photo</h4>
        <WebcamCapture type="passport" onCapture={(image) => setPassportPhoto(image)} />
        {passportPhoto && <img src={passportPhoto} alt="Passport Photo Preview" className="preview-image" />}

        {/* Submit Button */}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>

        {/* Submission Error */}
        {submitError && <p className="error-message">Error: {submitError}</p>}
      </form>
    </div>
  );
};

export default CustomerForm;
