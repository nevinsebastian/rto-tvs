import React, { useState } from 'react';
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
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
          <input
            type="text"
            name="modelName"
            value={formData.modelName}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <label>
          Model Variant:
          <input
            type="text"
            name="modelVariant"
            value={formData.modelVariant}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </label>
        <label>
          Color:
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            required
            style={styles.input}
          />
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
