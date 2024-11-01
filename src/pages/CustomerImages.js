import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import './CustomerImages.css';

const CustomerImages = () => {
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [image, setImage] = useState(null);
  const cropperRef = useRef(null);

  const fetchCustomerData = useCallback(async () => {
    try {
      const response = await axios.get(`https://api.tophaventvs.com:8000/rto/${customerId}`);
      setCustomerData(response.data);
    } catch (err) {
      setError('Could not fetch customer data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  const selectImageType = (type, imageUrl) => {
    setImageType(type);
    setImage(imageUrl);
  };

  const saveToLocalStorage = (imageData, type) => {
    localStorage.setItem(type, imageData); // Save cropped image in local storage
  };

  const downloadCroppedImage = () => {
    const cropper = cropperRef.current.cropper;
    if (cropper) {
      const croppedImage = cropper.getCroppedCanvas().toDataURL('image/jpeg');
  
      // Save cropped image to local storage if it’s Aadhaar front or back
      if (imageType === 'adhaar_front' || imageType === 'adhaar_back') {
        saveToLocalStorage(croppedImage, imageType);
        setImage(null);
        alert(`${imageType.replace('_', ' ')} cropped and saved successfully!`);
      } else if (imageType === 'photo_passport') {
        // Download passport image directly
        const link = document.createElement('a');
        link.href = croppedImage;
        link.download = `${customerData.name.split(' ')[0]}_passport.jpg`; // Uses first name as filename
        link.click();
  
        setImage(null);
        alert('Passport image cropped and downloaded successfully!');
      }
    } else {
      alert('Please select an image to crop before saving!');
    }
  };
  

  const combineAadhaarImages = async () => {
    const frontImageData = localStorage.getItem('adhaar_front');
    const backImageData = localStorage.getItem('adhaar_back');
  
    if (!frontImageData || !backImageData) {
      alert('Please crop and save both Aadhaar images first.');
      return;
    }
  
    // Helper function to convert base64 to Blob
    const base64ToBlob = (base64, mime) => {
      const byteString = atob(base64.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mime });
    };
  
    // Convert base64 data to Blob
    const frontImageBlob = base64ToBlob(frontImageData, 'image/jpeg');
    const backImageBlob = base64ToBlob(backImageData, 'image/jpeg');
  
    const formData = new FormData();
    formData.append('aadhaar_front_photo', frontImageBlob, 'aadhaar_front.jpg');
    formData.append('aadhaar_back_photo', backImageBlob, 'aadhaar_back.jpg');
  
    try {
      const response = await axios.post(
        `https://api.tophaventvs.com:8000/rto/combineadhaar/${customerId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('Aadhaar images combined successfully!');
      console.log(response.data);
      localStorage.removeItem('adhaar_front');
      localStorage.removeItem('adhaar_back');
    } catch (error) {
      console.error('Error combining Aadhaar images:', error);
      alert('There was an error combining the images. Please try again.');
    }
  };
  
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="customer-images">
      {customerData && (
        <div>
          

          <div className="image-grid">
            {['adhaar_front', 'adhaar_back', 'photo_passport'].map((type) => (
              <div key={type} className="image-container">
                <h3 className="image-title">{type.replace('_', ' ').toUpperCase()}</h3>
                <img
                  src={customerData[type]}
                  alt={type}
                  className="small-image"
                  onClick={() => selectImageType(type, customerData[type])}
                />
                <button className="edit-button" onClick={() => selectImageType(type, customerData[type])}>
                  Edit {type.replace('_', ' ')}
                </button>
              </div>
            ))}
          </div>

          {image && (
            <div className="cropper-container">
              <h2>Edit {imageType.replace('_', ' ').toUpperCase()}</h2>
              <Cropper
                src={image}
                ref={cropperRef}
                style={{ height: '400px', width: '100%' }}
                aspectRatio={0}
                guides={true}
                cropBoxResizable={true}
                cropBoxMovable={true}
                background={false}
              />
              <div className="cropper-actions">
                <button className="download-button" onClick={downloadCroppedImage}>
                  Crop and Save
                </button>
              </div>
            </div>
          )}

          <div className="combine-section">
            <button onClick={combineAadhaarImages}>Combine Aadhaar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerImages;
