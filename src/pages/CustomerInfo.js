import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { Modal, Button } from 'react-bootstrap'; // Ensure react-bootstrap is installed

const CustomerInfo = () => {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    address: '',
    pin: '',
    mobile1: '',
    mobile2: '',
    email: '',
    modelName: '',
    modelVariant: '',
    color: '',
    nomineeName: '',
    nomineeRelation: '',
    nomineeAge: ''
  });

  const [models, setModels] = useState({});
  const [variants, setVariants] = useState({});
  const [colors, setColors] = useState([]);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureImage, setSignatureImage] = useState(null);
  const [isSignatureCaptured, setIsSignatureCaptured] = useState(false);

  const webcamRef = useRef(null);

  useEffect(() => {
    fetch('/tvsModels.json')
      .then(response => response.json())
      .then(data => setModels(data.models))
      .catch(error => console.error('Error fetching TVS models:', error));
  }, []);

  useEffect(() => {
    if (models[formData.modelName]) {
      setVariants(models[formData.modelName].variants);
      setColors(models[formData.modelName].variants[formData.modelVariant] || []);
    } else {
      setVariants({});
      setColors([]);
    }
  }, [formData.modelName, formData.modelVariant, models]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleModelChange = (e) => {
    const modelName = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      modelName,
      modelVariant: '',
      color: ''
    }));
  };

  const handleVariantChange = (e) => {
    const variant = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      modelVariant: variant,
      color: ''
    }));
    setColors(variants[variant] || []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
  };

  const handleCaptureSignature = () => {
    setShowSignatureModal(true);
    setIsSignatureCaptured(false); // Reset the state when opening the modal
  };

  const handleCloseModal = () => {
    setShowSignatureModal(false);
  };

  const handleCaptureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSignatureImage(imageSrc);
    setIsSignatureCaptured(true); // Set the state to true once the signature is captured
  };

  const handleRecapture = () => {
    setSignatureImage(null);
    setIsSignatureCaptured(false); // Reset the state to allow re-capturing
    setShowSignatureModal(true); // Open the modal again
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Customer Data Collection</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        {renderInput('Name', 'name', 'text', formData.name, handleChange)}
        {renderInput('Date of Birth', 'dob', 'date', formData.dob, handleChange)}
        {renderInput('Permanent Address', 'address', 'text', formData.address, handleChange)}
        {renderInput('PIN Code', 'pin', 'text', formData.pin, handleChange)}
        {renderInput('Mobile Number 1', 'mobile1', 'text', formData.mobile1, handleChange)}
        {renderInput('Mobile Number 2', 'mobile2', 'text', formData.mobile2, handleChange)}
        {renderInput('Email', 'email', 'email', formData.email, handleChange)}
        
        <label style={styles.label}>Model Name:</label>
        <select
          name="modelName"
          value={formData.modelName}
          onChange={handleModelChange}
          required
          style={styles.select}
        >
          <option value="">Select Model</option>
          {Object.keys(models).map(model => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>

        <label style={styles.label}>Model Variant:</label>
        <select
          name="modelVariant"
          value={formData.modelVariant}
          onChange={handleVariantChange}
          required
          style={styles.select}
        >
          <option value="">Select Variant</option>
          {Object.keys(variants).map(variant => (
            <option key={variant} value={variant}>{variant}</option>
          ))}
        </select>

        <label style={styles.label}>Color:</label>
        <select
          name="color"
          value={formData.color}
          onChange={handleChange}
          required
          style={styles.select}
        >
          <option value="">Select Color</option>
          {colors.map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
        
        {renderInput('Nominee Name', 'nomineeName', 'text', formData.nomineeName, handleChange)}
        {renderInput('Relation with Nominee', 'nomineeRelation', 'text', formData.nomineeRelation, handleChange)}
        {renderInput('Nominee Age', 'nomineeAge', 'number', formData.nomineeAge, handleChange)}

        <button
          type="button"
          onClick={handleCaptureSignature}
          style={isSignatureCaptured ? styles.buttonDisabled : styles.button}
          disabled={isSignatureCaptured} // Disable the button if the signature is captured
        >
          Scan Signature
        </button>
        
        {signatureImage && (
          <div style={styles.signaturePreview}>
            <h2>Captured Signature:</h2>
            <img src={signatureImage} alt="Signature" style={styles.signatureImage} />
            <button
              type="button"
              onClick={handleRecapture}
              style={styles.button}
            >
              Recapture
            </button>
          </div>
        )}

        <button type="submit" style={styles.button}>Submit</button>
      </form>
      
      <Modal show={showSignatureModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Capture Signature</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          {!isSignatureCaptured && (
            <>
              <Button
                variant="primary"
                onClick={handleCaptureImage}
                style={styles.captureButton}
              >
                Capture
              </Button>
              <div style={styles.cameraContainer}>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/png"
                  width="100%"
                  videoConstraints={{ facingMode: 'environment' }} // Set to rear camera
                />
              </div>
            </>
          )}
          {signatureImage && (
            <div style={styles.signaturePreview}>
              <h2>Captured Signature:</h2>
              <img src={signatureImage} alt="Signature" style={styles.signatureImage} />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={styles.modalFooter}>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const renderInput = (label, name, type, value, onChange) => (
  <label style={styles.label}>
    {label}:
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      style={styles.input}
    />
  </label>
);

const styles = {
  container: {
    padding: '20px',
    background: '#ffffff',
    minHeight: '100vh',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    margin: '20px auto',
    maxWidth: '800px',
  },
  header: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '16px',
    marginBottom: '5px',
    color: '#333',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    boxShadow: 'inset 0px 1px 3px rgba(0, 0, 0, 0.1)',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    marginBottom: '15px',


    borderRadius: '5px',
    border: '1px solid #ddd',
    boxShadow: 'inset 0px 1px 3px rgba(0, 0, 0, 0.1)',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonDisabled: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#6c757d',
    border: 'none',
    borderRadius: '5px',
    cursor: 'not-allowed',
    transition: 'background-color 0.3s ease',
  },
  cameraContainer: {
    position: 'relative',
    width: '100%',
    height: '400px',
    marginTop: '10px',
  },
  signatureBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    border: '2px dashed #000',
    width: '80%',
    height: '80%',
  },
  modalBody: {
    position: 'relative',
    padding: '20px',
  },
  captureButton: {
    position: 'absolute',
    top: '10px',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: '1',
  },
  signaturePreview: {
    marginTop: '20px',
    textAlign: 'center',
  },
  signatureImage: {
    maxWidth: '100%',
    height: 'auto',
    maxHeight: '200px',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 15px',
    backgroundColor: '#f8f9fa',
    borderTop: '1px solid #dee2e6',
  },
};

export default CustomerInfo;   