import React, { useState } from 'react';

const NewCustomer = () => {
  const [customerName, setCustomerName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  const handleGenerateLink = () => {
    const uniqueId = encodeURIComponent(customerName);
    const link = `${window.location.origin}/customer-info/${uniqueId}`;
    setGeneratedLink(link);
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
      textarea.style.position = 'fixed';  // Avoid scrolling to bottom
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
  

  return (
    <div style={styles.container}>
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
        <div>
          <p>{generatedLink}</p>
          <button onClick={copyToClipboard} style={styles.button}>
            Copy Link
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    background: '#f0f0f0',
    minHeight: '100vh',
  },
  input: {
    padding: '10px',
    marginBottom: '10px',
  },
  button: {
    padding: '10px',
    cursor: 'pointer',
  },
};

export default NewCustomer;
