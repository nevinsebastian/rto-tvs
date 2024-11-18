import React, { useState } from 'react';
import { Grid, Typography, Button, TextField } from '@mui/material';

const InspectionLetter = () => {
  const [saleInvoiceNo, setSaleInvoiceNo] = useState('');
  const [date, setDate] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [chassisNumberPic, setChassisNumberPic] = useState(null);
  const [processedInspectionLetter, setProcessedInspectionLetter] = useState(null);

  const handleInspectionLetterChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleChasisNumberPicChange = (event) => {
    setChassisNumberPic(event.target.files[0]);
  };

  const handleInspectionLetterSubmit = async () => {
    if (!pdfFile || !chassisNumberPic || !saleInvoiceNo || !date) {
      alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('chasis_number_pic', chassisNumberPic);

    const url = `https://13.127.21.70:8000/pdf/process_pdf/inspection_letter?sale_invoice_no=${saleInvoiceNo}&date=${date}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setProcessedInspectionLetter(url);
      } else {
        console.error('Failed to process PDF:', response.statusText);
      }
    } catch (error) {
      console.error('Error processing PDF:', error);
    }
  };

  return (
    <Grid container spacing={2}>
      {/* Inspection Letter Section */}
      <Grid item xs={12} className='form-item'>
        <Typography>Sale Invoice Number:</Typography>
        <TextField
          variant="outlined"
          fullWidth
          value={saleInvoiceNo}
          onChange={(e) => setSaleInvoiceNo(e.target.value)}
        />

        <Typography>Date:</Typography>
        <TextField
          variant="outlined"
          fullWidth
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <Typography>Upload Inspection Letter PDF:</Typography>
        <input type="file" accept="application/pdf" onChange={handleInspectionLetterChange} />

        <Typography>Upload Chassis Number Picture:</Typography>
        <input type="file" accept="image/*" onChange={handleChasisNumberPicChange} />

        <Button onClick={handleInspectionLetterSubmit} variant="contained" color="primary">
          Submit Inspection Letter
        </Button>

        {processedInspectionLetter && (
          <a href={processedInspectionLetter} target="_blank" rel="noopener noreferrer">
            Download Processed Inspection Letter
          </a>
        )}
      </Grid>
    </Grid>
  );
};

export default InspectionLetter;
