import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Avatar, Divider, Button, CircularProgress, Snackbar, Alert, Dialog, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import '../styles/RTODetails.css';

const RTODetails = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [openImage, setOpenImage] = useState(null);

  // PDF Editor State
  const [form21Pdf, setForm21Pdf] = useState(null);
  const [form20Pdf, setForm20Pdf] = useState(null);
  const [signature, setSignature] = useState(null);
  const [financeCompany, setFinanceCompany] = useState('idfc');
  const [invoicePdf, setInvoicePdf] = useState(null);
  const [buyerSignature, setBuyerSignature] = useState(null);
  const [processedForm21, setProcessedForm21] = useState(null);
  const [processedForm20, setProcessedForm20] = useState(null);
  const [processedInvoice, setProcessedInvoice] = useState(null);
  
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetch(`http://13.127.21.70:8000/rto/${customerId}`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          setCustomer(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [customerId, token, navigate]);

  const handleImageClick = (image) => {
    setOpenImage(image);
  };

  const handleCloseImage = () => {
    setOpenImage(null);
  };

  // PDF Editor Functions
  const handleForm21Change = (e) => {
    setForm21Pdf(e.target.files[0]);
  };

  const handleForm20Change = (e) => {
    setForm20Pdf(e.target.files[0]);
  };

  const handleSignatureChange = (e) => {
    setSignature(e.target.files[0]);
  };

  const handleFinanceCompanyChange = (e) => {
    setFinanceCompany(e.target.value);
  };

  const handleInvoiceChange = (e) => {
    setInvoicePdf(e.target.files[0]);
  };

  const handleBuyerSignatureChange = (e) => {
    setBuyerSignature(e.target.files[0]);
  };

  const handleForm21Submit = async () => {
    if (!form21Pdf) return;

    const formData = new FormData();
    formData.append('pdf', form21Pdf);

    try {
      const response = await axios.post('http://13.127.21.70:8000/pdf/process_pdf/form21', formData, {
        responseType: 'blob',
      });
      setProcessedForm21(URL.createObjectURL(response.data));
    } catch (error) {
      console.error('Error processing form21:', error);
    }
  };

  const handleForm20Submit = async () => {
    if (!form20Pdf || !signature) return;

    const formData = new FormData();
    formData.append('pdf', form20Pdf);
    formData.append('signature', signature);
    formData.append('finance_company', financeCompany);

    try {
      const response = await axios.post('http://13.127.21.70:8000/pdf/process_pdf/form20', formData, {
        responseType: 'blob',
      });
      setProcessedForm20(URL.createObjectURL(response.data));
    } catch (error) {
      console.error('Error processing form20:', error);
    }
  };

  const handleInvoiceSubmit = async () => {
    if (!invoicePdf || !buyerSignature) return;

    const formData = new FormData();
    formData.append('pdf', invoicePdf);
    formData.append('signature', buyerSignature);

    try {
      const response = await axios.post('http://13.127.21.70:8000/pdf/process_pdf/invoice', formData, {
        responseType: 'blob',
      });
      setProcessedInvoice(URL.createObjectURL(response.data));
    } catch (error) {
      console.error('Error processing invoice:', error);
    }
  };

  if (loading) {
    return <p>Loading customer details...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  const statusIcon = (status) => (
    status ? <VerifiedIcon color="success" /> : <ErrorOutlineIcon color="error" />
  );

  return (
    <div className="rto-details-container">
      <Card className="rto-card" variant="outlined">
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Customer Details
          </Typography>
          <Divider />

          {customer && (
            <Grid container spacing={2} className="customer-details-grid">
              {/* Customer Details */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6"><PersonIcon /> {customer.first_name} {customer.last_name}</Typography>
                <Typography><PhoneIcon /> {customer.phone_number}</Typography>
                <Typography><strong>Address:</strong> {customer.address}</Typography>
                <Typography><strong>Nominee:</strong> {customer.nominee} ({customer.relation})</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6"><DirectionsCarIcon /> {customer.vehicle_name} - {customer.vehicle_variant}</Typography>
                <Typography><strong>Ex-showroom Price:</strong> ₹{customer.ex_showroom_price}</Typography>
                <Typography><strong>Tax:</strong> ₹{customer.tax}</Typography>
                <Typography><strong>Status:</strong> {customer.status}</Typography>
              </Grid>

              {/* Verification Status */}
              <Grid item xs={12}>
                <Typography variant="h6">Verification Status</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Typography>RTO Verified: {statusIcon(customer.rto_verified)}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography>Sales Verified: {statusIcon(customer.sales_verified)}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography>Accounts Verified: {statusIcon(customer.accounts_verified)}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              {/* Image Section */}
              <Grid item xs={12}>
                <Typography variant="h6">Documents</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography>Adhaar Front:</Typography>
                    <Avatar
                      alt="Aadhaar Front"
                      src={customer.photo_adhaar_front}
                      variant="rounded"
                      sx={{ width: 150, height: 150, cursor: 'pointer' }}
                      onClick={() => handleImageClick(customer.photo_adhaar_front)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography>Adhaar Back:</Typography>
                    <Avatar
                      alt="Aadhaar Back"
                      src={customer.photo_adhaar_back}
                      variant="rounded"
                      sx={{ width: 150, height: 150, cursor: 'pointer' }}
                      onClick={() => handleImageClick(customer.photo_adhaar_back)}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography>Passport:</Typography>
                    <Avatar
                      alt="Passport"
                      src={customer.photo_passport}
                      variant="rounded"
                      sx={{ width: 150, height: 150, cursor: 'pointer' }}
                      onClick={() => handleImageClick(customer.photo_passport)}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* PDF Editor Section */}
              <Grid item xs={12}>
                <Typography variant="h6">PDF Editor</Typography>

                <h3>Form 21</h3>
                <input type="file" accept="application/pdf" onChange={handleForm21Change} />
                <button onClick={handleForm21Submit}>Submit Form 21</button>
                {processedForm21 && (
                  <a href={processedForm21} download="processed_form21.pdf">Download Processed Form 21</a>
                )}

                <h3>Form 20</h3>
                <input type="file" accept="application/pdf" onChange={handleForm20Change} />
                <input type="file" accept="image/png" onChange={handleSignatureChange} />
                <select value={financeCompany} onChange={handleFinanceCompanyChange}>
                  <option value="idfc">IDFC</option>
                  <option value="tvscredit">TVS Credit</option>
                </select>
                <button onClick={handleForm20Submit}>Submit Form 20</button>
                {processedForm20 && (
                  <a href={processedForm20} download="processed_form20.pdf">Download Processed Form 20</a>
                )}

                <h3>Invoice</h3>
                <input type="file" accept="application/pdf" onChange={handleInvoiceChange} />
                <input type="file" accept="image/png" onChange={handleBuyerSignatureChange} />
                <button onClick={handleInvoiceSubmit}>Submit Invoice</button>
                {processedInvoice && (
                  <a href={processedInvoice} download="processed_invoice.pdf">Download Processed Invoice</a>
                )}
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Modal for Image Display */}
      <Dialog open={Boolean(openImage)} onClose={handleCloseImage}>
        <IconButton onClick={handleCloseImage} style={{ position: 'absolute', right: 8, top: 8 }}>
          <CloseIcon />
        </IconButton>
        <img src={openImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '90vh' }} />
      </Dialog>

      {/* Snackbar for Submission Status */}
      <Snackbar
        open={submissionSuccess || Boolean(submissionError)}
        autoHideDuration={6000}
        onClose={() => {
          setSubmissionSuccess(false);
          setSubmissionError(null);
        }}
      >
        <Alert onClose={() => {
          setSubmissionSuccess(false);
          setSubmissionError(null);
        }} severity={submissionSuccess ? 'success' : 'error'}>
          {submissionSuccess ? 'Submission successful!' : submissionError}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RTODetails;
