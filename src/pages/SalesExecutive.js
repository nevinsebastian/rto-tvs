import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SalesExecutive.css'; // Import the CSS for styling

const SalesExecutive = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false); // State to show/hide form
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    vehicle_name: '',
    vehicle_variant: '',
    vehicle_color: '',
    ex_showroom_price: '',
    tax: '',
    onroad_price: '',
  });
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }

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

  const handleButtonClick = (e) => {
    const buttons = document.querySelectorAll('.status-button');
    buttons.forEach(button => button.classList.remove('active')); // Remove active from all buttons
    e.target.classList.add('active'); // Add active class to the clicked button

    if (e.target.textContent === 'Add New') {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
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
    const response = await fetch('http://192.168.29.198:8000/sales/create-customer', {
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
    const message = `Fill the data for RTO procedure 
: ${generatedLink}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`);
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
          <h2>Total Links Generated</h2>
          <p>{Math.floor(Math.random() * 1000)}</p>
        </div>
        <div className="insight-box">
          <h2>Waiting for Data</h2>
          <p>{Math.floor(Math.random() * 100)}</p>
        </div>
        <div className="insight-box">
          <h2>Pending Verification</h2>
          <p>{Math.floor(Math.random() * 100)}</p>
        </div>
        <div className="insight-box">
          <h2>Verified</h2>
          <p>{Math.floor(Math.random() * 100)}</p>
        </div>
      </div>

      {/* Status Buttons Section */}
      <div className="status-buttons-container">
        <button className="status-button" onClick={handleButtonClick}>Pending</button>
        <button className="status-button" onClick={handleButtonClick}>Not Verified</button>
        <button className="status-button" onClick={handleButtonClick}>Verified</button>
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
            />
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              placeholder="Phone Number"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="vehicle_name"
              value={formData.vehicle_name}
              placeholder="Vehicle Name"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="vehicle_variant"
              value={formData.vehicle_variant}
              placeholder="Vehicle Variant"
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="vehicle_color"
              value={formData.vehicle_color}
              placeholder="Vehicle Color"
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="ex_showroom_price"
              value={formData.ex_showroom_price}
              placeholder="Ex-showroom Price"
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="tax"
              value={formData.tax}
              placeholder="Tax"
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="onroad_price"
              value={formData.onroad_price}
              placeholder="On-road Price"
              onChange={handleInputChange}
            />
            <button type="submit" className="submit-button">Submit</button>
          </form>

          {generatedLink && (
            <div className="generated-link-container">
              <p>Generated Link: {generatedLink}</p>
              <button className="copy-button" onClick={copyToClipboard}>Copy to Clipboard</button>
              <button className="whatsapp-button" onClick={shareToWhatsApp}>Share on WhatsApp</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SalesExecutive;
