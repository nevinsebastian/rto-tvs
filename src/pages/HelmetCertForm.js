import React, { useState } from 'react';
import axios from 'axios';

const HelmetCertForm = () => {
  const [customerName, setCustomerName] = useState('');
  const [chasisNumber, setChasisNumber] = useState('');
  const [date, setDate] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [signatureFile, setSignatureFile] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('signature', signatureFile);

    try {
      const response = await axios.post(
        `https://api.tophaventvs.com:8000/pdf/process_pdf/helmetcert`,
        formData,
        {
          params: {
            customer_name: customerName,
            chasis_number: chasisNumber,
            date: date,
          },
          headers: {
            'Content-Type': 'multipart/form-data',
            accept: 'application/json',
          },
          responseType: 'blob', // To handle the file download as a response
        }
      );

      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.setAttribute('download', 'processed_HELMET.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to process PDF:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="helmet-cert-form">
      <h2>Helmet Certificate Form</h2>

      <label>
        Customer Name:
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />
      </label>

      <label>
        Chasis Number:
        <input
          type="text"
          value={chasisNumber}
          onChange={(e) => setChasisNumber(e.target.value)}
          required
        />
      </label>

      <label>
        Date:
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </label>

      <label>
        PDF File:
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          required
        />
      </label>

      <label>
        Signature Image:
        <input
          type="file"
          accept="image/png"
          onChange={(e) => setSignatureFile(e.target.files[0])}
          required
        />
      </label>

      <button type="submit">Generate PDF</button>
    </form>
  );
};

export default HelmetCertForm;
