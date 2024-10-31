import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css'; // Cropper CSS
import './CustomerImages.css'; // Custom CSS for styles

const CustomerImages = () => {
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageType, setImageType] = useState(null); // Identify which image is being edited
  const [image, setImage] = useState(null);
  const cropperRef = useRef(null);
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);

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
    fetchCustomerData(); // Call the fetch function on component mount
  }, [fetchCustomerData]); // Add fetchCustomerData to the dependency array

  const selectImageType = (type, imageUrl) => {
    setImageType(type);
    setImage(imageUrl);
  };

  const downloadCroppedImage = () => {
    const cropper = cropperRef.current.cropper;
    if (cropper) {
      const croppedImage = cropper.getCroppedCanvas().toDataURL(); // Get cropped image as data URL
      const link = document.createElement('a');
      link.href = croppedImage;
      link.download = `${imageType}.jpg`; // Set the filename for the downloaded image
      link.click();
      setImage(null); // Clear the image after downloading
    } else {
      alert('Please select an image to crop before downloading!');
    }
  };

  const handleFrontImageChange = (event) => {
    setFrontImage(event.target.files[0]);
  };

  const handleBackImageChange = (event) => {
    setBackImage(event.target.files[0]);
  };

  const combineAadhaarImages = async () => {
    if (!frontImage || !backImage) {
      alert('Please upload both Aadhaar images.');
      return;
    }

    const formData = new FormData();
    formData.append('aadhaar_front_photo', frontImage);
    formData.append('aadhaar_back_photo', backImage);

    try {
      const response = await axios.post(`https://api.tophaventvs.com:8000/rto/combineadhaar/${customerId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Handle the response accordingly
      alert('Images combined successfully!');
      console.log(response.data); // Check the combined image data
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
          {/* Display Customer Info */}
          <div className="customer-info">
            <p><strong>Customer ID:</strong> {customerData.customer_id}</p>
            <p><strong>Name:</strong> {customerData.name}</p>
          </div>

          {/* Image Upload Section for Combining Aadhaar */}
          <div className="upload-section">
            <h2>Upload Aadhaar Images</h2>
            <div>
              <input type="file" accept="image/*" onChange={handleFrontImageChange} />
              <label>Upload Aadhaar Front</label>
            </div>
            <div>
              <input type="file" accept="image/*" onChange={handleBackImageChange} />
              <label>Upload Aadhaar Back</label>
            </div>
            <button onClick={combineAadhaarImages}>Combine Aadhaar</button>
          </div>

          {/* Display Images with Names and Edit Buttons */}
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

          {/* Display Cropper Below the Selected Image */}
          {image && (
            <div className="cropper-container">
              <h2>Edit {imageType.replace('_', ' ').toUpperCase()}</h2>
              <Cropper
                src={image}
                ref={cropperRef}
                style={{ height: '400px', width: '100%' }} // Height can be adjusted
                aspectRatio={0} // Free cropping
                guides={true}
                cropBoxResizable={true}
                cropBoxMovable={true}
                background={false}
              />
              <div className="cropper-actions">
                <button className="download-button" onClick={downloadCroppedImage}>
                  Crop and Download
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerImages;
