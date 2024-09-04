import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CustomerInfo = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get('name');

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
    // Fetch the JSON data from the public directory
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
      <h1>Customer Data Collection Page</h1>
      {name && <p>Welcome, {decodeURIComponent(name)}! Please fill in your details below.</p>}
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <label>
          Date of Birth:
          <input
            type="text"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <label>
          Permanent Address:
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <label>
          PIN Code:
          <input
            type="text"
            name="pin"
            value={formData.pin}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <label>
          Mobile Number 1:
          <input
            type="text"
            name="mobile1"
            value={formData.mobile1}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <label>
          Mobile Number 2:
          <input
            type="text"
            name="mobile2"
            value={formData.mobile2}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <label>
          Model Name:
          <select
            name="modelName"
            value={formData.modelName}
            onChange={handleModelChange}
            required
            style={styles.input}
          >
            <option value="">Select Model</option>
            {Object.keys(models).map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </label>
        <label>
          Model Variant:
          <select
            name="modelVariant"
            value={formData.modelVariant}
            onChange={handleVariantChange}
            required
            style={styles.input}
          >
            <option value="">Select Variant</option>
            {Object.keys(variants).map(variant => (
              <option key={variant} value={variant}>{variant}</option>
            ))}
          </select>
        </label>
        <label>
          Color:
          <select
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select Color</option>
            {colors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>
        </label>
        <label>
          Nominee Name:
          <input
            type="text"
            name="nomineeName"
            value={formData.nomineeName}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <label>
          Relation with Nominee:
          <input
            type="text"
            name="nomineeRelation"
            value={formData.nomineeRelation}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <label>
          Nominee Age:
          <input
            type="text"
            name="nomineeAge"
            value={formData.nomineeAge}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <button type="submit" style={styles.button}>Submit</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    background: '#f0f0f0',
    minHeight: '100vh',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '600px',
    margin: '0 auto',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#007BFF',
    color: '#fff',
    marginTop: '10px',
  },
};

export default CustomerInfo;
