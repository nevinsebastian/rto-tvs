import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaFileUpload, FaTimes } from 'react-icons/fa';
import '../styles/CustomerDetailsModern.css'; // Updated styles

const CustomerDetails = () => {
  const { customerId } = useParams();
  const [customerData, setCustomerData] = useState(null);
  const [formData, setFormData] = useState({
    number_plate_front: null,
    number_plate_back: null,
    delivery_photo: null,
  });
  const [addDeliveryPhotoMode, setAddDeliveryPhotoMode] = useState(false);
  const [previews, setPreviews] = useState({
    number_plate_front: null,
    number_plate_back: null,
    delivery_photo: null,
  });
  const [uploadStatus, setUploadStatus] = useState('');

  useEffect(() => {
    const fetchCustomerById = async () => {
      try {
        const response = await fetch(`https://api.tophaventvs.com:8000/sales/customers/${customerId}`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const data = await response.json();
        setCustomerData(data);
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    };

    fetchCustomerById();
  }, [customerId]);

  const handleFileChange = (field, file) => {
    if (file) {
      setFormData(prev => ({
        ...prev,
        [field]: file,
      }));
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviews(prev => ({
        ...prev,
        [field]: previewUrl,
      }));
    }
  };

  const handleCancelClick = () => {
    setAddDeliveryPhotoMode(false);
    setFormData({
      number_plate_front: null,
      number_plate_back: null,
      delivery_photo: null,
    });
    
    // Clean up preview URLs
    Object.values(previews).forEach(url => {
      if (url) URL.revokeObjectURL(url);
    });
    
    setPreviews({
      number_plate_front: null,
      number_plate_back: null,
      delivery_photo: null,
    });
    setUploadStatus('');
  };

  const handleSaveClick = async () => {
    setUploadStatus('uploading');
    const formDataToSubmit = new FormData();

    if (!formData.number_plate_front || !formData.number_plate_back || !formData.delivery_photo) {
      setUploadStatus('Please upload all required photos');
      return;
    }

    // Append files to FormData
    formDataToSubmit.append('number_plate_front', formData.number_plate_front);
    formDataToSubmit.append('number_plate_back', formData.number_plate_back);
    formDataToSubmit.append('delivery_photo', formData.delivery_photo);

    try {
      const response = await fetch(`https://api.tophaventvs.com:8000/sales/customers/delivery-update/${customerId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSubmit,
      });

      if (response.ok) {
        const updatedData = await response.json();
        setCustomerData(updatedData);
        setUploadStatus('success');
        setTimeout(handleCancelClick, 1500);
      } else {
        const errorData = await response.json();
        console.error('Failed to update delivery details:', errorData);
        setUploadStatus('Failed to upload photos. Please try again.');
      }
    } catch (error) {
      console.error('Error updating delivery details:', error);
      setUploadStatus('Error uploading photos. Please check your connection.');
    }
  };

  

  const renderImage = (url, alt) => {
    if (!url) return <div className="no-image">No image available</div>;
    return (
      <div className="image-container">
        <img src={url} alt={alt} className="document-image" />
      </div>
    );
  };

  const handleVerifyCustomer = async () => {
    try {
      const response = await fetch(`https://api.tophaventvs.com:8000/sales/verify/${customerId}`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const responseData = await response.json();
        alert(responseData.message); // You can use a toast or modal for a better user experience
      } else {
        const errorData = await response.json();
        console.error('Failed to verify customer:', errorData);
        alert('Failed to verify customer. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying customer:', error);
      alert('Error verifying customer. Please check your connection.');
    }
  };


  const renderField = (label, value) => (
    <div className="field-container">
      <label className="field-label">{label}:</label>
      <div className="field-content">
        {value ? <span className="field-value">{value}</span> : <span className="field-value">Not provided</span>}
      </div>
    </div>
  );

  if (!customerData) {
    return <div className="loading">Loading customer details...</div>;
  }

  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Upload Delivery Photos</h3>
            <button 
              onClick={handleCancelClick}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Front Number Plate Upload */}
          <div className="upload-section">
            <label className="block">Front Number Plate:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleFileChange('number_plate_front', e.target.files[0])} 
            />
            {previews.number_plate_front && <img src={previews.number_plate_front} alt="Front Number Plate Preview" className="preview-image" />}
          </div>

          {/* Back Number Plate Upload */}
          <div className="upload-section">
            <label className="block">Back Number Plate:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleFileChange('number_plate_back', e.target.files[0])} 
            />
            {previews.number_plate_back && <img src={previews.number_plate_back} alt="Back Number Plate Preview" className="preview-image" />}
          </div>

          {/* Delivery Photo Upload */}
          <div className="upload-section">
            <label className="block">Delivery Photo:</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => handleFileChange('delivery_photo', e.target.files[0])} 
            />
            {previews.delivery_photo && <img src={previews.delivery_photo} alt="Delivery" className="preview-image" />}
          </div>
        </div>

        <div className="p-4 border-t">
          {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
          <div className="flex justify-between">
            <button onClick={handleSaveClick} className="btn btn-primary">Save</button>
            <button onClick={handleCancelClick} className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="customer-details">
      <h1 className="title">Customer Details</h1>
      <button 
        onClick={() => setAddDeliveryPhotoMode(true)} 
        className="btn btn-add-delivery"
      >
        Add Delivery Photos <FaFileUpload />
      </button>

      <div className="customer-info">
        {renderField('Customer ID', customerData.customer_id)}
        {renderField('Name', customerData.name)}
        {renderField('First Name', customerData.first_name)}
        {renderField('Last Name', customerData.last_name)}
        {renderField('Address', customerData.address)}
        {renderField('Pin Code', customerData.pin_code)}
        {renderField('Phone Number', customerData.phone_number)}
        {renderField('Alternate Phone Number', customerData.alternate_phone_number)}
        {renderField('Date of Birth', customerData.dob)}
        {renderField('Nominee', customerData.nominee)}
        {renderField('Relation', customerData.relation)}
        {renderField('Taluk', customerData.taluk)}
        {renderField(
  'Customer Link', 
  <a href={customerData.link} target="_blank" rel="noopener noreferrer">{customerData.link}</a>
)}

        {renderField('Vehicle Name', customerData.vehicle_name)}
        {renderField('Vehicle Variant', customerData.vehicle_variant)}
        {renderField('Vehicle Color', customerData.vehicle_color)}
        {renderField('Ex Showroom Price', customerData.ex_showroom_price)}
        {renderField('Tax', customerData.tax)}
        {renderField('Amount Paid', customerData.amount_paid)}
        {renderField('Balance Amount', customerData.balance_amount)}
        {renderField('Total Price', customerData.total_price)}
        {renderField('Optional Accessories', customerData.optional_accessories)}
        {renderField('Mandatory Accessories', customerData.man_accessories)}
        {renderField('TP Registration', customerData.tp_registration)}
        {renderField('Insurance', customerData.insurance)}
        {renderField('Vehicle Number', customerData.vehicle_number)}
        
        {renderField('Aadhar Combined Photo', renderImage(customerData.photo_adhaar_combined, "Aadhar Combined Photo"))}
        
        {renderField('Aadhar Front Photo', renderImage(customerData.adhaar_front, "Aadhar Front Photo"))}
        
        {renderField('Aadhar Back Photo', renderImage(customerData.adhaar_back, "Aadhar Back Photo"))}

        {renderField('Passport Photo', renderImage(customerData.photo_passport, "Passport Photo"))}
        {renderField('Customer Signature', renderImage(customerData.customer_sign, "Customer Signature"))}
        {renderField('Customer Signature Copy', renderImage(customerData.customer_sign_copy, "Customer Signature Copy"))}
        {renderField('Front Number Plate', renderImage(customerData.number_plate_front, "Front Number Plate"))}
        {renderField('Back Number Plate', renderImage(customerData.number_plate_back, "Back Number Plate"))}
        {renderField('Delivery Photo', renderImage(customerData.delivery_photo, "Delivery Photo"))}
        <div className="flex justify-center mt-4">
        <button onClick={handleVerifyCustomer} className="btn btn-verify">
          Verify Customer
        </button>
      </div>
      </div>

      {addDeliveryPhotoMode && <UploadModal />}
     
    </div>
  );
};

export default CustomerDetails;
