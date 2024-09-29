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
    finance_id: '' 
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

    // Fetch customer count data from the first API
    const fetchCustomerCounts = async () => {
      const response = await fetch('http://13.127.21.70:8000/sales/customers/count', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();
      setCustomerCounts(data);
    };

    // Fetch customer review count data from the second API
    const fetchReviewCounts = async () => {
      const response = await fetch('http://13.127.21.70:8000/sales/customer-verification/count', {
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

    // Prevent back navigation
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
    buttons.forEach(button => button.classList.remove('active')); // Remove active from all buttons
    e.target.classList.add('active'); // Add active class to the clicked button

    if (e.target.textContent === 'Add New') {
      setShowForm(true);
    } else if (e.target.textContent === 'All') {
      setShowForm(false);
      await fetchCustomers(); // Fetch customers when "All" is clicked
    } else {
      setShowForm(false);
    }
  };

  const fetchCustomers = async () => {
    const response = await fetch('http://13.127.21.70:8000/sales/customers', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();
    setCustomers(data); // Set fetched customers to state
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Post data to API
    const response = await fetch('http://13.127.21.70:8000/sales/create-customer', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    setGeneratedLink(data.customer_link); // Store generated link
  };

  const copyToClipboard = () => {
    const fallbackCopyTextToClipboard = (text) => {
      const textArea = document.createElement("textarea");
      textArea.value = text;

      // Avoid scrolling to the bottom of the page
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";

      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand('copy');
        alert('Link copied to clipboard!');
      } catch (err) {
        alert('Unable to copy. Please copy the link manually.');
      }

      document.body.removeChild(textArea);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(generatedLink)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          fallbackCopyTextToClipboard(generatedLink);
        });
    } else {
      fallbackCopyTextToClipboard(generatedLink);
    }
  };

  const shareToWhatsApp = () => {
    const message = `Fill the data for RTO procedure: ${generatedLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`);
  };

  const handleCustomerClick = async (customerId) => {
    const response = await fetch(`http://13.127.21.70:8000/sales/customers/${customerId}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const data = await response.json();
    setSelectedCustomer(data); // Set selected customer data to state
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
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              value={formData.name}
              placeholder="Customer Name"
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              placeholder="Phone Number"
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="alternate_phone_number"
              value={formData.alternate_phone_number}
              placeholder="Alternate Phone Number"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="vehicle_name"
              value={formData.vehicle_name}
              placeholder="Vehicle Name"
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="vehicle_variant"
              value={formData.vehicle_variant}
              placeholder="Vehicle Variant"
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="vehicle_color"
              value={formData.vehicle_color}
              placeholder="Vehicle Color"
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="ex_showroom_price"
              value={formData.ex_showroom_price}
              placeholder="Ex-Showroom Price"
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="tax"
              value={formData.tax}
              placeholder="Tax"
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="insurance"
              value={formData.insurance}
              placeholder="Insurance"
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="tp_registration"
              value={formData.tp_registration}
              placeholder="TP Registration"
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="man_accessories"
              value={formData.man_accessories}
              placeholder="Mandatory Accessories"
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="optional_accessories"
              value={formData.optional_accessories}
              placeholder="Optional Accessories"
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="booking"
              value={formData.booking}
              placeholder="Booking Amount"
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="total_price"
              value={formData.total_price}
              placeholder="Total Price"
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="finance_amount"
              value={formData.finance_amount}
              placeholder="Finance Amount"
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="finance_id"
              value={formData.finance_id}
              placeholder="Finance ID"
              onChange={handleInputChange}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}

     {/* Customers List */}
<div className="customers-list">
  {customers.map(customer => (
    <div key={customer.customer_id} className="customer-card" onClick={() => handleCustomerClick(customer.customer_id)}>
      <h3>{customer.name}</h3>
      <p>Vehicle: {customer.vehicle_name} {customer.vehicle_variant}</p>
      <p>Status: {customer.sales_verified ? 'Verified' : 'Not Verified'}</p> {/* Status Logic */}
    </div>
  ))}
</div>


      {/* Generated Link Section */}
      {generatedLink && (
        <div className="generated-link-container">
          <p>Generated Link: <a href={generatedLink} target="_blank" rel="noopener noreferrer">{generatedLink}</a></p>
          <button onClick={copyToClipboard}>Copy Link</button>
          <button onClick={shareToWhatsApp}>Share to WhatsApp</button>
        </div>
      )}

      {/* Selected Customer Data */}
      {selectedCustomer && (
        <div className="selected-customer-data">
          <h2>Selected Customer Data</h2>
          <p>Name: {selectedCustomer.name}</p>
          <p>Phone Number: {selectedCustomer.phone_number}</p>
          <p>Vehicle Name: {selectedCustomer.vehicle_name}</p>
          <p>Vehicle Variant: {selectedCustomer.vehicle_variant}</p>
          <p>Verification Status: {selectedCustomer.verification_status}</p>
          {/* Add more customer data as needed */}
        </div>
      )}
    </div>
  );
};

export default SalesExecutive;
