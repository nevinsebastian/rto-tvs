import React, { useState, useEffect } from 'react';
import Webcam from 'react-webcam';

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

  useEffect(() => {
    fetch('/tvsModels.json')
      .then(response => response.json())
      .then(data => {
        setModels(data.models);
      })
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
      modelVariant: '',  // Reset variant and color when model changes
      color: ''
    }));
  };

  const handleVariantChange = (e) => {
    const variant = e.target.value;
    setFormData(prevData => ({
      ...prevData,
      modelVariant: variant,
      color: ''  // Reset color when variant changes
    }));
    setColors(variants[variant] || []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., sending data to a server)
    console.log('Form Data Submitted:', formData);
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

        <button type="submit" style={styles.button}>Submit</button>

        <div style={styles.signatureContainer}>
          <h2 style={styles.signatureHeader}>Capture Customer Signature</h2>
          <Webcam
            audio={false}
            screenshotFormat="image/png"
            width="100%"
            videoConstraints={{ facingMode: "user" }}
          />
          {/* Implement a mechanism to capture and display the signature */}
        </div>
      </form>
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
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#007BFF',
    color: '#fff',
    marginTop: '20px',
    transition: 'background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  signatureContainer: {
    marginTop: '20px',
    textAlign: 'center',
  },
  signatureHeader: {
    marginBottom: '10px',
    color: '#333',
  },
};

export default CustomerInfo;
