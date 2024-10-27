import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Stock = () => {
  const [user] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [chassisNumber, setChassisNumber] = useState('');
  const [chassisPhoto, setChassisPhoto] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access the camera. Please check permissions.");
    }
  };

  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
  
    const targetWidth = video.videoWidth * 0.5; // Narrow the width to 50% of the video
    const targetHeight = video.videoHeight; // Keep the full height for a vertical rectangle
  
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  
    const context = canvas.getContext('2d');
    context.drawImage(
      video,
      (video.videoWidth - targetWidth) / 2, // Center the cropped area
      0, // Start from the top of the frame
      targetWidth,
      targetHeight,
      0,
      0,
      targetWidth,
      targetHeight
    );
  
    canvas.toBlob((blob) => {
      setChassisPhoto(blob); // Set the Blob object for the photo
      setPreviewImage(URL.createObjectURL(blob));
    });
    setIsCameraActive(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure both fields are filled
    if (!chassisNumber || !chassisPhoto) {
      alert('Please provide both chassis number and photo.');
      return;
    }

    const formData = new FormData();
    formData.append('chassis_number', chassisNumber);
    formData.append('chassis_photo', chassisPhoto); // Ensure this is the Blob

    try {
      const response = await fetch('https://api.tophaventvs.com:8000/chasis/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json(); // Capture error details
        console.error('Error response:', errorData); // Log the error details
        throw new Error('Failed to upload chassis data: ' + errorData.detail);
      }

      const data = await response.json();
      alert(`Chassis uploaded successfully! Chassis Photo URL: ${data.chassis_photo_url}`);
      setChassisNumber('');
      setChassisPhoto(null);
      setPreviewImage(null);
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
            placeholder="Enter chassis number"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Chassis Photo:</label>
          {isCameraActive ? (
            <div style={styles.cameraContainer}>
              <video ref={videoRef} style={styles.video}></video>
              <button type="button" onClick={captureImage} style={styles.captureButton}>
                Capture Image
              </button>
            </div>
          ) : (
            <button type="button" onClick={startCamera} style={styles.cameraButton}>
              Open Camera
            </button>
          )}
          {previewImage && (
            <div style={styles.previewContainer}>
              <img src={previewImage} alt="Captured preview" style={styles.previewImage} />
            </div>
          )}
        </div>
        
        <button type="submit" style={styles.submitButton}>Upload</button>
      </form>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© {new Date().getFullYear()} Hogspot. All rights reserved.</p>
      </footer>

      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    width: '100%',
    boxSizing: 'border-box',
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '600px',
  },
  title: {
    margin: '0',
    fontSize: '24px',
    color: '#333',
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
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#ff4c4c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 12px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  form: {
    marginTop: '20px',
    width: '100%',
    maxWidth: '600px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
  },
  submitButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 15px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
    width: '100%',
  },
  footer: {
    marginTop: '30px',
    textAlign: 'center',
    width: '100%',
  },
  footerText: {
    fontSize: '14px',
    color: '#777',
  },
  cameraContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  video: {
    width: '50%',
    height: '90vh',
    maxWidth: '300px',
    borderRadius: '8px',
    objectFit: 'cover', // This will focus on the central part of the video feed
  },
  captureButton: {
    marginTop: '10px',
    backgroundColor: '#28a745',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
  },
  cameraButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 12px',
    cursor: 'pointer',
  },
  previewContainer: {
    marginTop: '10px',
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    maxWidth: '300px',
    borderRadius: '8px',
  },
};

export default Stock;
