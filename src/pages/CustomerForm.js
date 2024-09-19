import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await fetch(`http://192.168.29.198:8000/customer/customer-form/${link_token}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const data = await response.json();
        setCustomerData(data);
        setFormData(prev => ({
          ...prev,
          ...data,
        }));
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [link_token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch(`http://192.168.29.198:8000/customer/customer/${link_token}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) throw new Error('Failed to submit data');

      const data = await response.json();
      alert('Data submitted successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="customer-form-container">
      {isLoading ? <p>Loading...</p> : error ? <p>Error: {error}</p> : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_name"
            value={formData.first_name || ''}
            placeholder="First Name"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name || ''}
            placeholder="Last Name"
            onChange={handleInputChange}
          />
          <input
            type="email"
            name="email"
            value={formData.email || ''}
            placeholder="Email"
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="address"
            value={formData.address || ''}
            placeholder="Address"
            onChange={handleInputChange}
          />
          <input
            type="file"
            name="aadhaar_front_photo"
            onChange={handleFileChange}
          />
          <input
            type="file"
            name="aadhaar_back_photo"
            onChange={handleFileChange}
          />
          <input
            type="file"
            name="passport_photo"
            onChange={handleFileChange}
          />
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default CustomerForm;
