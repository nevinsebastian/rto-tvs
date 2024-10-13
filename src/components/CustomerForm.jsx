import React from 'react';

const CustomerForm = ({ formData, onInputChange, onSubmit, isEditing }) => {
  return (
    <form className="customer-form" onSubmit={onSubmit}>
      <h2>{isEditing ? 'Edit Customer' : 'Add New Customer'}</h2>
      
      {/* Customer Information */}
      <div className="form-group">
        <label htmlFor="name">Customer Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
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
          value={formData.phone_number}
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
          value={formData.alternate_phone_number}
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
          value={formData.vehicle_name}
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
          value={formData.vehicle_variant}
          onChange={onInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="vehicle_color">Vehicle Color</label>
        <input
          type="text"
          id="vehicle_color"
          name="vehicle_color"
          value={formData.vehicle_color}
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
          value={formData.ex_showroom_price}
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
          value={formData.tax}
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
          value={formData.insurance}
          onChange={onInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="tp_registration">Temporary Registration</label>
        <input
          type="number"
          id="tp_registration"
          name="tp_registration"
          value={formData.tp_registration}
          onChange={onInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="man_accessories">Mandatory Accessories</label>
        <input
          type="number"
          id="man_accessories"
          name="man_accessories"
          value={formData.man_accessories}
          onChange={onInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="optional_accessories">Optional Accessories</label>
        <input
          type="number"
          id="optional_accessories"
          name="optional_accessories"
          value={formData.optional_accessories}
          onChange={onInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="booking">Booking Amount</label>
        <input
          type="number"
          id="booking"
          name="booking"
          value={formData.booking}
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
          value={formData.amount_paid}
          onChange={onInputChange}
          required
        />
      </div>

      <button type="submit" className="submit-button">
        {isEditing ? 'Save Changes' : 'Add Customer'}
      </button>
    </form>
  );
};

export default CustomerForm;
