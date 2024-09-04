import React, { useState } from 'react';
import axios from 'axios';

const PdfEditor = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!pdfFile) {
      alert('Please select a PDF file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
      const response = await axios.post('http://127.0.0.1:8000/process_pdf/form21', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'blob' // Important for handling file responses
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setDownloadUrl(url);
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>PDF Editor</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label style={styles.label}>
          Upload PDF:
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            style={styles.input}
          />
        </label>
        <button type="submit" style={styles.button}>Submit</button>
      </form>
      {downloadUrl && (
        <div style={styles.downloadSection}>
          <a href={downloadUrl} download="processed_pdf.pdf" style={styles.downloadLink}>Download Processed PDF</a>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    background: '#ffffff',
    minHeight: '100vh',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    margin: '20px auto',
    maxWidth: '800px',
  },
  header: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '16px',
    marginBottom: '5px',
    color: '#333',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    boxShadow: 'inset 0px 1px 3px rgba(0, 0, 0, 0.1)',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#007BFF',
    color: '#fff',
    marginTop: '20px',
    transition: 'background-color 0.3s ease',
  },
  downloadSection: {
    marginTop: '20px',
    textAlign: 'center',
  },
  downloadLink: {
    fontSize: '16px',
    color: '#007BFF',
    textDecoration: 'none',
  },
};

export default PdfEditor;
