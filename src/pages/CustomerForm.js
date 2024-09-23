import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/CustomerForm.css'; // Ensure the CSS file is present

const CustomerForm = () => {
  const { link_token } = useParams();
  const [customerData, setCustomerData] = useState({});
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    aadhaar_front_photo: null,
    aadhaar_back_photo: null,
    passport_photo: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(`https://192.168.29.198:8000/customer/customer-form/${link_token}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        setCustomerData(data);
        setFormData(prev => ({
          ...prev,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          address: data.address || '',
        }));
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchCustomerData();
  }, [link_token]);

  // Function to open the camera and show the bounding box
  const openCamera = (field) => {
    setCurrentField(field);
    setIsCameraOpen(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      })
      .catch((err) => console.error('Error accessing camera', err));
  };

  // Capture image and crop based on the bounding box
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas size to match video feed
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the video frame on the canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Define cropping area based on the bounding box
    const cropX = (canvas.width - 300) / 2;
    const cropY = (canvas.height - 200) / 2;
    const cropWidth = 300;
    const cropHeight = 200;

    // Get the image data for the bounding box
    const imageData = context.getImageData(cropX, cropY, cropWidth, cropHeight);

    // Create a new canvas for the cropped image
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;
    const croppedContext = croppedCanvas.getContext('2d');
    croppedContext.putImageData(imageData, 0, 0);

    // Convert the cropped canvas to a Blob (JPEG format)
    croppedCanvas.toBlob((blob) => {
      setFormData(prev => ({
        ...prev,
        [currentField]: blob
      }));
      setIsCameraOpen(false); // Close the camera after capturing
    }, 'image/jpeg');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch(`https://192.168.29.198:8000/customer/customer/${link_token}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to submit data');

      alert('Data submitted successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="customer-form-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">Error: {error}</p>
      ) : (
        <>
          <h2>Customer Data</h2>
          <div className="customer-data">
            <p><strong>Name:</strong> {customerData.name}</p>
            <p><strong>Phone Number:</strong> {customerData.phone_number}</p>
            {/* Additional customer details */}
          </div>

          <h2>Update Customer Information</h2>
          <form onSubmit={handleSubmit} className="form">
            {/* Input fields for first name, last name, etc. */}
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              placeholder="First Name"
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              required
            />
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              placeholder="Last Name"
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Email"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div className="file-inputs">
              {/* Aadhaar Front Photo */}
              {isCameraOpen && currentField === 'aadhaar_front_photo' ? (
                <div className="camera-container">
                  <video ref={videoRef} className="camera-view" />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  <div className="bounding-box">
                    <p>Place Aadhaar Front inside this box</p>
                  </div>
                  <button type="button" onClick={captureImage}>Capture Aadhaar Front</button>
                </div>
              ) : (
                <button type="button" onClick={() => openCamera('aadhaar_front_photo')}>Capture Aadhaar Front</button>
              )}

              {/* Aadhaar Back Photo */}
              {isCameraOpen && currentField === 'aadhaar_back_photo' ? (
                <div className="camera-container">
                  <video ref={videoRef} className="camera-view" />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  <div className="bounding-box">
                    <p>Place Aadhaar Back inside this box</p>
                  </div>
                  <button type="button" onClick={captureImage}>Capture Aadhaar Back</button>
                </div>
              ) : (
                <button type="button" onClick={() => openCamera('aadhaar_back_photo')}>Capture Aadhaar Back</button>
              )}
            </div>

            <button type="submit">Submit</button>
          </form>
        </>
      )}
    </div>
  );
};

export default CustomerForm;
