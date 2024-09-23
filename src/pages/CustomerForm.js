import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/CustomerForm.css'; // Make sure to create this CSS file for styling

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

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
  
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
    // Draw bounding box based on currentField
    context.strokeStyle = 'red';
    context.lineWidth = 2;
  
    // Define bounding box dimensions
    let x, y, width, height;
    if (currentField === 'aadhaar_front_photo' || currentField === 'aadhaar_back_photo') {
      x = 50; // Adjust as needed
      y = 100; // Adjust as needed
      width = 300; // Adjust as needed
      height = 150; // Adjust as needed
    } else if (currentField === 'passport_photo') {
      x = 50; // Adjust as needed
      y = 100; // Adjust as needed
      width = 200; // Adjust as needed
      height = 250; // Adjust as needed
    }
  
    // Draw the bounding box
    context.strokeRect(x, y, width, height);
  
    // Create the blob for the form data
    canvas.toBlob((blob) => {
      setFormData(prev => ({
        ...prev,
        [currentField]: blob
      }));
      setIsCameraOpen(false);
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
            <p><strong>Vehicle Name:</strong> {customerData.vehicle_name}</p>
            <p><strong>Vehicle Variant:</strong> {customerData.vehicle_variant}</p>
            <p><strong>Vehicle Color:</strong> {customerData.vehicle_color}</p>
            <p><strong>Ex-Showroom Price:</strong> {customerData.ex_showroom_price}</p>
            <p><strong>Tax:</strong> {customerData.tax}</p>
            <p><strong>On-Road Price:</strong> {customerData.onroad_price}</p>
          </div>

          <h2>Update Customer Information</h2>
          <form onSubmit={handleSubmit} className="form">
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
            <input
              type="text"
              name="address"
              value={formData.address}
              placeholder="Address"
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
            
            <div className="file-inputs">
              <div>
                {isCameraOpen && currentField === 'aadhaar_front_photo' ? (
                  <div className="camera-container">
                    <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <button type="button" onClick={captureImage}>Capture Aadhaar Front</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => openCamera('aadhaar_front_photo')}>Open Camera for Aadhaar Front</button>
                )}
              </div>
              <div>
                {isCameraOpen && currentField === 'aadhaar_back_photo' ? (
                  <div className="camera-container">
                    <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <button type="button" onClick={captureImage}>Capture Aadhaar Back</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => openCamera('aadhaar_back_photo')}>Open Camera for Aadhaar Back</button>
                )}
              </div>
              <div>
                {isCameraOpen && currentField === 'passport_photo' ? (
                  <div className="camera-container">
                    <video ref={videoRef} style={{ width: '100%', height: 'auto' }} />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <button type="button" onClick={captureImage}>Capture Passport</button>
                  </div>
                ) : (
                  <button type="button" onClick={() => openCamera('passport_photo')}>Open Camera for Passport</button>
                )}
              </div>
            </div>

            <button type="submit">Submit</button>
          </form>
        </>
      )}
    </div>
  );
};

export default CustomerForm;