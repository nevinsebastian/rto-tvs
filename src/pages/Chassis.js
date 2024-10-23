import React, { useState } from 'react';
import axios from 'axios';

const Chassis = () => {
  const [chassisNumber, setChassisNumber] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleChassisChange = (event) => {
    setChassisNumber(event.target.value);
  };

  const handleFetchImage = async () => {
    if (!chassisNumber) {
      setError('Please enter a chassis number.');
      return;
    }

    try {
      const response = await axios.get(`https://api.tophaventvs.com:8000/chasisimage/${chassisNumber}`, {
        headers: {
          accept: 'application/json',
        },
      });

      // Assuming the response structure provided in your request
      if (response.status === 200) {
        setImageUrl(response.data.image_url);
        setError(''); // Clear any previous error
      }
    } catch (err) {
      if (err.response) {
        setError('Error: ' + (err.response.data.detail || 'Something went wrong!'));
      } else {
        setError('Error: Network Error');
      }
      setImageUrl(''); // Clear the image URL on error
    }
  };

  return (
    <div style={styles.container}>
      <h1>Chassis Image Fetcher</h1>
      <input
        type="text"
        placeholder="Enter Chassis Number"
        value={chassisNumber}
        onChange={handleChassisChange}
        style={styles.input}
      />
      <button onClick={handleFetchImage} style={styles.button}>Fetch Image</button>
      {error && <p style={styles.error}>{error}</p>}
      {imageUrl && (
        <div style={styles.imageContainer}>
          <h2>Chassis Image:</h2>
          <img src={imageUrl} alt={`Chassis ${chassisNumber}`} style={styles.image} />
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px',
  },
  input: {
    padding: '10px',
    margin: '10px 0',
    width: '200px',
  },
  button: {
    padding: '10px 15px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
  },
  imageContainer: {
    marginTop: '20px',
    textAlign: 'center',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
  },
};

export default Chassis;
