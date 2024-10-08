// src/pages/AccountCustomerDetails.js
import React, { useEffect, useState } from 'react';

const AccountCustomerDetails = ({ customerId }) => {
    const [customer, setCustomer] = useState(null);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const response = await fetch('https://13.127.21.70:8000/accounts/customers', {
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const customerData = data.find(c => c.customer_id === Number(customerId));
                setCustomer(customerData);
            } catch (error) {
                console.error('Error fetching customer details:', error);
            }
        };

        fetchCustomerDetails();
    }, [customerId, token]);

    if (!customer) return <div>Loading...</div>;

    return (
        <div>
            <h1>Customer Details</h1>
            <p>Name: {customer.name}</p>
            <p>Address: {customer.address}</p>
            <p>Phone: {customer.phone_number}</p>
            {/* Add more fields as needed */}
            <img src={customer.photo_adhaar_front} alt="Aadhaar Front" />
            {/* Add more images or details as needed */}
        </div>
    );
};

export default AccountCustomerDetails;
