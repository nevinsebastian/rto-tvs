import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Stock = () => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [chassisNumber, setChassisNumber] = useState('');
  const [chassisPhoto, setChassisPhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if user is not found
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login'); // Redirect to login on logout
  };

  const handleFileChange = (event) => {
    setChassisPhoto(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!chassisNumber || !chassisPhoto) {
      alert('Please provide both chassis number and photo.');
      return;
    }

    const formData = new FormData();
    formData.append('chassis_number', chassisNumber);
    formData.append('chassis_photo', chassisPhoto);

    try {
      const response = await fetch('https://13.127.21.70:8000/chasis/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload chassis data');
      }

      const data = await response.json();
      console.log('Upload successful:', data);
      alert(`Chassis uploaded successfully! Chassis Photo URL: ${data.chassis_photo_url}`);
      
      // Reset the form after submission
      setChassisNumber('');
      setChassisPhoto(null);
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error uploading the chassis data. Please try again.');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Upload Chassis Data</h1>
        {user && (
          <div style={styles.userSection}>
            <span style={styles.userName}>Welcome, {user.first_name} {user.last_name}</span>
            <button style={styles.logoutButton} onClick={handleLogout}>Logout</button>
          </div>
        )}
      </header>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Chassis Number:</label>
          <input
            type="text"
            value={chassisNumber}
            onChange={(e) => setChassisNumber(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Chassis Photo:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            style={styles.input}
          />
        </div>
        
        <button type="submit" style={styles.submitButton}>Upload</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    width: '100%',
    boxSizing: 'border-box',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '5px',
  },
  title: {
    margin: '0',
  },
  userSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  userName: {
    marginRight: '10px',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#ff4c4c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '5px 10px',
    cursor: 'pointer',
  },
  form: {
    marginTop: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  submitButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 15px',
    cursor: 'pointer',
  },
};

// Media queries for responsiveness
const mediaQueries = `
  @media (max-width: 768px) {
    .header {
      flex-direction: column;
    }
    .userSection {
      justify-content: space-between;
      width: 100%;
    }
  }
`;

export default Stock;
