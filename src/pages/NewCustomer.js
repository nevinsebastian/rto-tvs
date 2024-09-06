import React, { useState } from 'react';
import Navbar from '../components/Navbar';


// should include buke name verient color 
// should  include price and price break down
const NewCustomer = () => {
  const [customerName, setCustomerName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const handleGenerateLink = () => {
    if (customerName.trim() !== '') {
      const link = `${window.location.origin}/customer-form?name=${encodeURIComponent(customerName)}`;
      setGeneratedLink(link);
    } else {
      alert('Please enter a customer name');
    }
  };

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(generatedLink)
        .then(() => {
          alert('Link copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = generatedLink;
      textarea.style.position = 'fixed'; // Avoid scrolling to bottom
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        const successful = document.execCommand('copy');
        if (successful) {
          alert('Link copied to clipboard!');
        } else {
          console.error('Failed to copy');
        }
      } catch (err) {
        console.error('Failed to copy: ', err);
      }

      document.body.removeChild(textarea);
    }
  };

  const shareToWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(generatedLink)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <div style={styles.content}>
        <h1>New Customer</h1>
        <input
          type="text"
          placeholder="Enter customer name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleGenerateLink} style={styles.button}>
          Generate Link
        </button>

        {generatedLink && (
          <div style={styles.linkContainer}>
            <p>Generated Link: <a href={generatedLink} target="_blank" rel="noopener noreferrer">{generatedLink}</a></p>
            <button onClick={copyToClipboard} style={styles.button}>
              Copy Link
            </button>
            <button onClick={shareToWhatsApp} style={{ ...styles.button, backgroundColor: '#25D366', marginLeft: '10px' }}>
              Share to WhatsApp
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    paddingTop: '60px', // Adjust based on navbar height
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: '#f0f0f0',
    minHeight: '100vh',
  },
  content: {
    padding: '20px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    marginBottom: '20px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '300px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#007BFF',
    color: '#fff',
    marginTop: '10px',
  },
  linkContainer: {
    marginTop: '20px',
  },
};

export default NewCustomer;
