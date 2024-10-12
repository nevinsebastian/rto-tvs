import React from 'react';

const CustomerForm = ({ formData, onInputChange, onSubmit, isEditing }) => {
  return (
    <div className="form-container">
      <form onSubmit={onSubmit}>
        <h3>{isEditing ? 'Edit Customer' : 'Add New Customer'}</h3>
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            type={key.includes('price') || key.includes('amount') ? 'number' : 'text'}
            name={key}
            value={formData[key]}
            onChange={onInputChange}
            placeholder={key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
            required={key === 'name' || key === 'phone_number'}
          />
        ))}
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  );
};

export default CustomerForm;
