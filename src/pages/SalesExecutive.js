
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SalesExecutive.css'; // Import the CSS for styling

const SalesExecutive = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  // State for customer counts
  const [customerCounts, setCustomerCounts] = useState({
    total_count: 0,
    total_pending: 0,
    total_submitted: 0,
  });

  // State for customer review counts
  const [reviewCounts, setReviewCounts] = useState({
    reviews_pending: 0,
    reviews_done: 0,
  });

  const [showForm, setShowForm] = useState(false); // State to show/hide form
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    alternate_phone_number: '',
    vehicle_name: '',
    vehicle_variant: '',
    vehicle_color: '',
    ex_showroom_price: '',
    tax: '',
    insurance: '',
    tp_registration: '',
    man_accessories: '',
    optional_accessories: '',
    booking: '',
    total_price: '',
    finance_amount: '',
    finance_id: '',
  });
  const [generatedLink, setGeneratedLink] = useState('');
  
  // State for customers data
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null); // State for selected customer data

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

    const fetchCustomerCounts = async () => {
      const response = await fetch('https://13.127.21.70:8000/sales/customers/count', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setCustomerCounts(data);
    };

    const fetchReviewCounts = async () => {
      const response = await fetch('https://13.127.21.70:8000/sales/customer-verification/count', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setReviewCounts({
        reviews_pending: data['reviews pending'],
        reviews_done: data['reviews Done'],
      });
    };

    fetchCustomerCounts();
    fetchReviewCounts();

    const handleBackButton = (e) => {
      e.preventDefault();
      window.history.pushState(null, null, window.location.pathname);
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleButtonClick = async (e) => {
    const buttons = document.querySelectorAll('.status-button');
    buttons.forEach(button => button.classList.remove('active'));
    e.target.classList.add('active');

    if (e.target.textContent === 'Add New') {
      setShowForm(true);
      setFormData({
        name: '',
        phone_number: '',
        alternate_phone_number: '',
        vehicle_name: '',
        vehicle_variant: '',
        vehicle_color: '',
        ex_showroom_price: '',
        tax: '',
        insurance: '',
        tp_registration: '',
        man_accessories: '',
        optional_accessories: '',
        booking: '',
        total_price: '',
        finance_amount: '',
        finance_id: '',
      });
    } else if (e.target.textContent === 'All') {
      setShowForm(false);
      await fetchCustomers();
    } else {
      setShowForm(false);
    }
  };

  const fetchCustomers = async () => {
    const response = await fetch('https://13.127.21.70:8000/sales/customers', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    setCustomers(data);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('https://13.127.21.70:8000/sales/create-customer', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setGeneratedLink(data.customer_link);
    fetchCustomers(); // Refresh customers list after adding
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`https://13.127.21.70:8000/sales/customers/${selectedCustomer.customer_id}`, {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const updatedCustomer = await response.json();
      setCustomers(prev => prev.map(customer => customer.customer_id === updatedCustomer.customer_id ? updatedCustomer : customer));
      setSelectedCustomer(updatedCustomer); // Update the selected customer with new data
    }
  };

  const handleCustomerClick = (customerId) => {
    navigate(`/customer-details/${customerId}`);
  };
  

  const handleVerifyCustomer = async () => {
    const response = await fetch(`https://13.127.21.70:8000/sales/customers/${selectedCustomer.customer_id}/verify`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.ok) {
      const updatedCustomer = await response.json();
      setCustomers(prev => prev.map(customer => customer.customer_id === updatedCustomer.customer_id ? updatedCustomer : customer));
      setSelectedCustomer(updatedCustomer);
    }
  };

  return (
    <div className="sales-executive-container">
      <div className="nav-bar">
        <span className="user-info">{user.first_name} {user.last_name}</span>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      {/* Insights Section */}
      <div className="insights-container">
        <div className="insight-box">
          <h2>Total Customers</h2>
          <p>{customerCounts.total_count}</p>
        </div>
        <div className="insight-box">
          <h2>Pending Customers</h2>
          <p>{customerCounts.total_pending}</p>
        </div>
        <div className="insight-box">
          <h2>Submitted Customers</h2>
          <p>{customerCounts.total_submitted}</p>
        </div>
        <div className="insight-box">
          <h2>Pending Reviews</h2>
          <p>{reviewCounts.reviews_pending}</p>
        </div>
        <div className="insight-box">
          <h2>Completed Reviews</h2>
          <p>{reviewCounts.reviews_done}</p>
        </div>
      </div>

      {/* Status Buttons Section */}
      <div className="status-buttons-container">
        <button className="status-button" onClick={handleButtonClick}>All</button>
        <button className="status-button" onClick={handleButtonClick}>Pending</button>
        <button className="status-button" onClick={handleButtonClick}>Submitted</button>
        <button className="status-button" onClick={handleButtonClick}>Add New</button>
      </div>

      {/* Add New Form */}
      {showForm && (
        <div className="form-container">
          <form onSubmit={selectedCustomer ? handleEditSubmit : handleSubmit}>
            <h3>{selectedCustomer ? 'Edit Customer' : 'Add New Customer'}</h3>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Customer Name" required />
            <input type="text" name="phone_number" value={formData.phone_number} onChange={handleInputChange} placeholder="Phone Number" required />
            <input type="text" name="alternate_phone_number" value={formData.alternate_phone_number} onChange={handleInputChange} placeholder="Alternate Phone Number" />
            <input type="text" name="vehicle_name" value={formData.vehicle_name} onChange={handleInputChange} placeholder="Vehicle Name" />
            <input type="text" name="vehicle_variant" value={formData.vehicle_variant} onChange={handleInputChange} placeholder="Vehicle Variant" />
            <input type="text" name="vehicle_color" value={formData.vehicle_color} onChange={handleInputChange} placeholder="Vehicle Color" />
            <input type="text" name="ex_showroom_price" value={formData.ex_showroom_price} onChange={handleInputChange} placeholder="Ex-showroom Price" />
            <input type="text" name="tax" value={formData.tax} onChange={handleInputChange} placeholder="Tax" />
            <input type="text" name="insurance" value={formData.insurance} onChange={handleInputChange} placeholder="Insurance" />
            <input type="text" name="tp_registration" value={formData.tp_registration} onChange={handleInputChange} placeholder="TP Registration" />
            <input type="text" name="man_accessories" value={formData.man_accessories} onChange={handleInputChange} placeholder="Mandatory Accessories" />
            <input type="text" name="optional_accessories" value={formData.optional_accessories} onChange={handleInputChange} placeholder="Optional Accessories" />
            <input type="text" name="booking" value={formData.booking} onChange={handleInputChange} placeholder="Booking Amount" />
            <input type="text" name="total_price" value={formData.total_price} onChange={handleInputChange} placeholder="Total Price" />
            <input type="text" name="finance_amount" value={formData.finance_amount} onChange={handleInputChange} placeholder="Finance Amount" />
            <input type="text" name="finance_id" value={formData.finance_id} onChange={handleInputChange} placeholder="Finance ID" />
            <button type="submit">{selectedCustomer ? 'Update Customer' : 'Add Customer'}</button>
          </form>
        </div>
      )}

      {/* Customers List */}
      <div className="customers-list">
        {customers.map(customer => (
          <div key={customer.customer_id} className="customer-card" onClick={() => handleCustomerClick(customer.customer_id)}>
            <h3>{customer.name}</h3>
            <p>Phone: {customer.phone_number}</p>
            <p>Vehicle: {customer.vehicle_name} - {customer.vehicle_variant}</p>
            <button onClick={handleVerifyCustomer}>Verify</button>
          </div>
        ))}
      </div>

      {/* Generated Link */}
      {generatedLink && (
        <div className="link-container">
          <h4>Customer Link Generated:</h4>
          <a href={generatedLink} target="_blank" rel="noopener noreferrer">{generatedLink}</a>
        </div>
      )}
    </div>
  );
};

export default SalesExecutive;
