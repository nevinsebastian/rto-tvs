import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaWhatsapp } from 'react-icons/fa'; // Import WhatsApp icon


const CustomerForm = ({ formData, onInputChange, isEditing, token }) => {
  const [customerLink, setCustomerLink] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const preparedData = {
      ...formData,
      ex_showroom_price: parseFloat(formData.ex_showroom_price) || 0,
      tax: parseFloat(formData.tax) || 0,
      insurance: parseFloat(formData.insurance) || 0,
      tp_registration: parseFloat(formData.tp_registration) || 0,
      man_accessories: parseFloat(formData.man_accessories) || 0,
      optional_accessories: parseFloat(formData.optional_accessories) || 0,
      booking: parseFloat(formData.booking) || 0,
      amount_paid: parseFloat(formData.amount_paid) || 0,
    };

    try {
      const response = await fetch('https://api.tophaventvs.com:8000/sales/create-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(preparedData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(JSON.stringify(data.detail));
      }

      const data = await response.json();
      console.log('Customer created:', data);
      setCustomerLink(data.customer_link); // Set the customer link
      toast.success('Customer created successfully!', {
        position: "top-center", // Change the position of the toast
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to create customer. Please check the details.', {
        position: "top-center",
      });
    }
  };


  const copyToClipboard = () => {
    navigator.clipboard.writeText(customerLink);
    toast.success('Link copied to clipboard!', {
      position: "top-center",
    });
  };

  const shareOnWhatsApp = () => {
    if (customerLink) {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(customerLink)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <div className="customer-form-container">
      <form className="customer-form" onSubmit={handleSubmit}>
        <h2>{isEditing ? 'Edit Customer' : 'Add New Customer'}</h2>

        {/* Customer Information */}
        <div className="form-group">
          <label htmlFor="name">Customer Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={onInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone_number">Phone Number</label>
          <input
            type="text"
            id="phone_number"
            name="phone_number"
            value={formData.phone_number || ''}
            onChange={onInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="alternate_phone_number">Alternate Phone Number</label>
          <input
            type="text"
            id="alternate_phone_number"
            name="alternate_phone_number"
            value={formData.alternate_phone_number || ''}
            onChange={onInputChange}
          />
        </div>

        {/* Vehicle Information */}
        <div className="form-group">
          <label htmlFor="vehicle_name">Vehicle Name</label>
          <input
            type="text"
            id="vehicle_name"
            name="vehicle_name"
            value={formData.vehicle_name || ''}
            onChange={onInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="vehicle_variant">Vehicle Variant</label>
          <input
            type="text"
            id="vehicle_variant"
            name="vehicle_variant"
            value={formData.vehicle_variant || ''}
            onChange={onInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="vehicle_color">Vehicle Color</label>
          <input
            type="text"
            id="vehicle_color"
            name="vehicle_color"
            value={formData.vehicle_color || ''}
            onChange={onInputChange}
          />
        </div>

        {/* Pricing Information */}
        <div className="form-group">
  <label htmlFor="ex_showroom_price">Ex-showroom Price</label>
  <input
    type="number"
    id="ex_showroom_price"
    name="ex_showroom_price"
    value={formData.ex_showroom_price || ''}
    onChange={onInputChange}
    required
  />
</div>

<div className="form-group">
  <label htmlFor="tax">Tax</label>
  <input
    type="number"
    id="tax"
    name="tax"
    value={formData.tax || ''}
    onChange={onInputChange}
    required
  />
</div>

<div className="form-group">
  <label htmlFor="insurance">Insurance</label>
  <input
    type="number"
    id="insurance"
    name="insurance"
    value={formData.insurance || ''}
    onChange={onInputChange}
  />
</div>

<div className="form-group">
  <label htmlFor="tp_registration">Temporary Registration</label>
  <input
    type="number"
    id="tp_registration"
    name="tp_registration"
    value={formData.tp_registration || ''}
    onChange={onInputChange}
  />
</div>

<div className="form-group">
  <label htmlFor="man_accessories">Mandatory Accessories</label>
  <input
    type="number"
    id="man_accessories"
    name="man_accessories"
    value={formData.man_accessories || ''}
    onChange={onInputChange}
  />
</div>

<div className="form-group">
  <label htmlFor="optional_accessories">Optional Accessories</label>
  <input
    type="number"
    id="optional_accessories"
    name="optional_accessories"
    value={formData.optional_accessories || ''}
    onChange={onInputChange}
  />
</div>

<div className="form-group">
  <label htmlFor="booking">Booking Amount</label>
  <input
    type="number"
    id="booking"
    name="booking"
    value={formData.booking || ''}
    onChange={onInputChange}
    required
  />
</div>

<div className="form-group">
  <label htmlFor="amount_paid">Amount Paid</label>
  <input
    type="number"
    id="amount_paid"
    name="amount_paid"
    value={formData.amount_paid || ''}
    onChange={onInputChange}
    required
  />
</div>


        <button type="submit" className="submit-button">
          {isEditing ? 'Save Changes' : 'Add Customer'}
        </button>

        {/* Display customer link if available */}
        {customerLink && (
          <div className="customer-link" style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>Customer Created! View here: <a href={customerLink} target="_blank" rel="noopener noreferrer">{customerLink}</a></p>
            <button onClick={copyToClipboard} className="copy-button">Copy Link</button>
            <button onClick={shareOnWhatsApp} className="whatsapp-button">
              <FaWhatsapp /> Share on WhatsApp
            </button>
          </div>
        )}
      </form>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
/>
      
    </div>
  );
};

export default CustomerForm;
