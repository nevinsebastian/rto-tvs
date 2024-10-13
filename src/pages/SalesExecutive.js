import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//notification

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



//components
import CustomerCounts from '../components/CustomerCounts';
import ReviewCounts from '../components/ReviewCounts';
import NavBar from '../components/NavBar';
import StatusButtons from '../components/StatusButtons';
import CustomerForm from '../components/CustomerForm';
import GeneratedLink from '../components/GeneratedLink';

//styles
import '../styles/SalesExecutive.css';

//theme

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
  const token = localStorage.getItem('token');

  const [generatedLink, setGeneratedLink] = useState('');
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
  
    try {
      const response = await fetch('https://13.127.21.70:8000/sales/create-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setGeneratedLink(data.customer_link);  // Access the correct field
        fetchCustomers();
        toast.success("Customer created successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error(data.message || "Failed to create customer. Try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  
  

  
  const handleCustomerClick = (customerId) => {
    navigate(`/customer-details/${customerId}`);
  };
  

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`https://13.127.21.70:8000/sales/customers/${selectedCustomer.customer_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(formData),
    });
    const data = await response.json();
    if (response.ok) {
      setGeneratedLink(data.link);
      fetchCustomers();
      setSelectedCustomer(null);
    } else {
      alert(data.message);
    }
  };
  const [expanded, setExpanded] = useState(false); // State to control the visibility of customer and review counts
  const handleToggleExpand = (newExpandedState) => {
    setExpanded(newExpandedState);
  };

  return (
    <div className="sales-executive-container">
      <NavBar user={user} onLogout={handleLogout} />
      <StatusButtons onButtonClick={handleButtonClick} onToggleExpand={handleToggleExpand} />
      {!expanded && (
        <>
          <CustomerCounts counts={customerCounts} />
          <ReviewCounts reviewCounts={reviewCounts} />
        </>
      )}
      
      {showForm && (
        <CustomerForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={selectedCustomer ? handleEditSubmit : handleSubmit}
          isEditing={!!selectedCustomer}
          token={token}
        />
      )}
      <div className="customers-list">
        {customers.map(customer => (
          <div key={customer.customer_id} className="customer-card" onClick={() => handleCustomerClick(customer.customer_id)}>
            <h3>{customer.name}</h3>
            <p>Phone: {customer.phone_number}</p>
            <p>Vehicle: {customer.vehicle_name}</p>
            <p>Status: {customer.status}</p>
            <button className="verify-button">Verify</button>
          </div>
          
        ))}
      </div>
      {generatedLink && <GeneratedLink link={generatedLink} />}
      <ToastContainer/>
    </div>
  );
};

export default SalesExecutive;
