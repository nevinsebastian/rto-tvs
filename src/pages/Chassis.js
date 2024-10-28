import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { Cropper } from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const Chassis = () => {
  const [chassisNumber, setChassisNumber] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [croppedImage, setCroppedImage] = useState(null);
  const cropperRef = useRef(null);

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
        headers: { accept: 'application/json' },
      });

      if (response.status === 200) {
        setImageUrl(response.data.image_url);
        setError('');
      }
    } catch (err) {
      if (err.response) {
        setError('Error: ' + (err.response.data.detail || 'Something went wrong!'));
      } else {
        setError('Error: Network Error');
      }
      setImageUrl('');
    }
  };

  const handleSaveCroppedImage = useCallback(() => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        const croppedUrl = URL.createObjectURL(blob);
        setCroppedImage(croppedUrl);

        // Create a download link
        const link = document.createElement('a');
        link.href = croppedUrl;
        link.download = `cropped-chassis-${chassisNumber}.jpg`;
        link.click();

        // Clean up
        URL.revokeObjectURL(croppedUrl);
      }, 'image/jpeg');
    }
  }, [chassisNumber]);

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
          <Cropper
            src={imageUrl}
            style={{ height: 400, width: '100%' }}
            initialAspectRatio={0.5}
            aspectRatio={NaN} // Allows free cropping
            guides={true}
            ref={cropperRef}
            cropBoxMovable={true}
            cropBoxResizable={true}
            viewMode={1}
            dragMode="move"
          />
          <button onClick={handleSaveCroppedImage} style={styles.saveButton}>
            Save Cropped Image
          </button>
        </div>
      )}
      {croppedImage && (
        <div style={styles.previewContainer}>
          <h2>Cropped Image Preview:</h2>
          <img src={croppedImage} alt="Cropped Preview" style={styles.croppedImage} />
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
  saveButton: {
    padding: '10px 20px',
    marginTop: '10px',
    cursor: 'pointer',
  },
  previewContainer: {
    marginTop: '20px',
    textAlign: 'center',
  },
  croppedImage: {
    maxWidth: '100%',
    height: 'auto',
  },
};

export default Chassis;
