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

  const handleVerifyCustomer = async () => {
    setSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await axios.post(`http://13.127.21.70:8000/rto/verify/${customerId}`, {}, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setSubmissionSuccess(true);
      }
    } catch (error) {
      setSubmissionError('Verification failed.');
    } finally {
      setSubmitting(false);
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

              {/* Form Submission Section */}
              <Grid item xs={12}>
                <Typography variant="h6">Form Submission</Typography>
                <div>
                  <Button variant="contained" component="label">
                    Upload Form 21 PDF
                    <input type="file" hidden onChange={handleForm21Change} />
                  </Button>
                  <Button variant="contained" onClick={handleForm21Submit}>Process Form 21</Button>
                  {processedForm21 && <a href={processedForm21} download>Download Processed Form 21</a>}
                </div>

                <div>
                  <Button variant="contained" component="label">
                    Upload Form 20 PDF
                    <input type="file" hidden onChange={handleForm20Change} />
                  </Button>
                  <Button variant="contained" component="label">
                    Upload Signature
                    <input type="file" hidden onChange={handleSignatureChange} />
                  </Button>
                  <select value={financeCompany} onChange={handleFinanceCompanyChange}>
                    <option value="idfc">IDFC</option>
                    <option value="bajaj">Bajaj</option>
                    <option value="hdfc">HDFC</option>
                  </select>
                  <Button variant="contained" onClick={handleForm20Submit}>Process Form 20</Button>
                  {processedForm20 && <a href={processedForm20} download>Download Processed Form 20</a>}
                </div>

                <div>
                  <Button variant="contained" component="label">
                    Upload Invoice PDF
                    <input type="file" hidden onChange={handleInvoiceChange} />
                  </Button>
                  <Button variant="contained" component="label">
                    Upload Buyer Signature
                    <input type="file" hidden onChange={handleBuyerSignatureChange} />
                  </Button>
                  <Button variant="contained" onClick={handleInvoiceSubmit}>Process Invoice</Button>
                  {processedInvoice && <a href={processedInvoice} download>Download Processed Invoice</a>}
                </div>
              </Grid>

              {/* Verify RTO Button */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<VerifiedIcon />}
                  onClick={handleVerifyCustomer}
                  disabled={submitting || customer.rto_verified}
                >
                  {submitting ? <CircularProgress size={24} /> : 'Verify RTO'}
                </Button>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Fullscreen Image Viewer */}
      <Dialog open={Boolean(openImage)} onClose={handleCloseImage} maxWidth="lg">
        <IconButton onClick={handleCloseImage} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: '9999' }}>
          <CloseIcon />
        </IconButton>
        <img src={openImage} alt="Document" style={{ maxWidth: '100%', maxHeight: '90vh' }} />
      </Dialog>

      {/* Snackbar for Success or Error */}
      <Snackbar open={submissionSuccess} autoHideDuration={3000} onClose={() => setSubmissionSuccess(false)}>
        <Alert onClose={() => setSubmissionSuccess(false)} severity="success">
          RTO Verified Successfully!
        </Alert>
      </Snackbar>

      <Snackbar open={Boolean(submissionError)} autoHideDuration={3000} onClose={() => setSubmissionError(null)}>
        <Alert onClose={() => setSubmissionError(null)} severity="error">
          {submissionError}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default RTODetails;
