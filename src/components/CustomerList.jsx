import React from 'react';

const CustomerList = ({ customers, onCustomerClick }) => {
  return (
    <div className="customer-list">
      {customers.map(customer => (
        <div className="customer-item" key={customer.customer_id} onClick={() => onCustomerClick(customer.customer_id)}>
          <p>{customer.name}</p>
          <p>{customer.phone_number}</p>
        </div>
      ))}
    </div>
  );
};

export default CustomerList;
