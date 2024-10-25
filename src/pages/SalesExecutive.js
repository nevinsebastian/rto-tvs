import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CustomerCounts from '../components/CustomerCounts';
import ReviewCounts from '../components/ReviewCounts';
import NavBar from '../components/NavBar';
import StatusButtons from '../components/StatusButtons';
import CustomerForm from '../components/CustomerForm';
import GeneratedLink from '../components/GeneratedLink';
import '../styles/SalesExecutive.css';


const SalesExecutive = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [customerCounts, setCustomerCounts] = useState({
    total_count: 0,
    total_pending: 0,
    total_submitted: 0,
  });

  const [reviewCounts, setReviewCounts] = useState({
    reviews_pending: 0,
    reviews_done: 0,
  });

  const [showForm, setShowForm] = useState(false); 
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
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [expanded, setExpanded] = useState(false); 

  // Define fetchCounts using useCallback
  const fetchCounts = useCallback(async () => {
    const [customerResponse, reviewResponse] = await Promise.all([
      fetch('https://api.tophaventvs.com:8000/sales/customers/count', {
        method: 'GET',
        headers: { accept: 'application/json', Authorization: `Bearer ${token}` }
      }),
      fetch('https://api.tophaventvs.com:8000/sales/customer-verification/count', {
        method: 'GET',
        headers: { accept: 'application/json', Authorization: `Bearer ${token}` }
      }),
    ]);

    const customerData = await customerResponse.json();
    setCustomerCounts(customerData);

    const reviewData = await reviewResponse.json();
    setReviewCounts({
      reviews_pending: reviewData['reviews pending'],
      reviews_done: reviewData['reviews Done'],
    });
  }, [token]);

  // Define fetchCustomers using useCallback
  const fetchCustomers = useCallback(async () => {
    const response = await fetch('https://api.tophaventvs.com:8000/sales/customers', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setCustomers(data);
    setFilteredCustomers(data); // Initially show all customers
  }, [token]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
    
    // Fetch counts and customers
    fetchCounts();
    fetchCustomers();

    const handleBackButton = (e) => {
      e.preventDefault();
      window.history.pushState(null, null, window.location.pathname);
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate, fetchCounts, fetchCustomers]); // Added fetchCounts and fetchCustomers to dependencies

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
      setFormData({ name: '', phone_number: '', alternate_phone_number: '', vehicle_name: '', vehicle_variant: '', vehicle_color: '', ex_showroom_price: '', tax: '', insurance: '', tp_registration: '', man_accessories: '', optional_accessories: '', booking: '', total_price: '', finance_amount: '', finance_id: '' });
    } else if (e.target.textContent === 'All') {
      setShowForm(false);
      await fetchCustomers();
    } else {
      setShowForm(false);
      filterCustomers(e.target.textContent);
    }
  };

  const filterCustomers = (status) => {
    let filtered;
    switch (status) {
      case 'Waiting for data':
        filtered = customers.filter(customer => customer.status === 'pending');
        break;
      case 'To verify':
        filtered = customers.filter(customer => customer.status === 'submitted' && !customer.sales_verified);
        break;
      case 'Verified':
        filtered = customers.filter(customer => customer.sales_verified);
        break;
      case 'Registered':
        filtered = customers.filter(customer => customer.registered);
        break;
      default:
        filtered = customers;
    }
    setFilteredCustomers(filtered);
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
        const response = await fetch('https://api.tophaventvs.com:8000/sales/create-customer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            setGeneratedLink(data.customer_link);
            fetchCustomers();
            toast.success("Customer created successfully!", {
                position: "top-center",  // Positioning to the top-center
                className: 'toast-center-mobile',  // Custom class for mobile
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } else {
            toast.error(data.message || "Failed to create customer. Try again.", {
                position: "top-center",
                className: 'toast-center-mobile',
                autoClose: 3000,
                hideProgressBar: true,
            });
        }
    } catch (error) {
        toast.error("An error occurred. Please try again.", {
            position: "top-center",
            className: 'toast-center-mobile',
            autoClose: 3000,
            hideProgressBar: true,
        });
    }
};


  const handleCustomerClick = (customerId) => {
    navigate(`/customer-details/${customerId}`);
  };

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
          onSubmit={handleSubmit}
          isEditing={false}
          token={token}
        />
      )}
      <div className="customers-list">
        {Array.isArray(filteredCustomers) && filteredCustomers.length > 0 ? (
          filteredCustomers.map(customer => (
            <div 
              key={customer.customer_id} 
              className="customer-card" 
              onClick={() => handleCustomerClick(customer.customer_id)}
            >
              <h3>{customer.name}</h3>
              <p>Phone: {customer.phone_number}</p>
              <p>Status: {customer.status}</p>
            </div>
          ))
        ) : (
          <p>No customers available</p>
        )}
      </div>

      {generatedLink && <GeneratedLink link={generatedLink} />}
      <ToastContainer />
    </div>
  );
};

export default SalesExecutive;
