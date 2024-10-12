import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//components
import CustomerCounts from '../components/CustomerCounts';
import ReviewCounts from '../components/ReviewCounts';
import NavBar from '../components/NavBar';
import StatusButtons from '../components/StatusButtons';
import CustomerForm from '../components/CustomerForm';
import CustomerList from '../components/CustomerList';
import GeneratedLink from '../components/GeneratedLink';

//styles
import '../styles/SalesExecutive.css';

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
    const response = await fetch('https://13.127.21.70:8000/sales/customers', {
      method: 'POST',
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
    } else {
      alert(data.message);
    }
  };

  const handleCustomerClick = (customerId) => {
    setShowForm(true);
    const selected = customers.find(customer => customer.customer_id === customerId);
    setSelectedCustomer(selected);
    setFormData(selected);
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

  return (
    <div className="sales-executive-container">
      <NavBar user={user} onLogout={handleLogout} />
      <CustomerCounts counts={customerCounts} />
      <ReviewCounts reviewCounts={reviewCounts} />
      <StatusButtons onButtonClick={handleButtonClick} />
      {showForm && (
        <CustomerForm
          formData={formData}
          onInputChange={handleInputChange}
          onSubmit={selectedCustomer ? handleEditSubmit : handleSubmit}
          isEditing={!!selectedCustomer}
        />
      )}
      <CustomerList customers={customers} onCustomerClick={handleCustomerClick} />
      {generatedLink && <GeneratedLink link={generatedLink} />}
    </div>
  );
};

export default SalesExecutive;
