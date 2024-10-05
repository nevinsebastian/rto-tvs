import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Avatar, Divider, Button, CircularProgress, Snackbar, Alert, Dialog, IconButton } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/RTODetails.css';

const RTODetails = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [openImage, setOpenImage] = useState(null); // New state for image enlargement
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

  const handleSubmission = () => {
    setSubmitting(true);
    fetch(`http://13.127.21.70:8000/rto/verify/${customerId}`, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to submit data.');
        }
        return response.json();
      })
      .then((data) => {
        setSubmissionSuccess(true);
        setSubmitting(false);
      })
      .catch((error) => {
        setSubmissionError(error.message);
        setSubmitting(false);
      });
  };

  const handleImageClick = (image) => {
    setOpenImage(image);
  };

  const handleCloseImage = () => {
    setOpenImage(null);
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

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmission}
                  disabled={submitting}
                  fullWidth
                >
                  {submitting ? <CircularProgress size={24} /> : 'Submit RTO Verification'}
                </Button>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Success and Error Feedback */}
      <Snackbar
        open={submissionSuccess}
        autoHideDuration={4000}
        onClose={() => setSubmissionSuccess(false)}
      >
        <Alert onClose={() => setSubmissionSuccess(false)} severity="success">
          Customer RTO registration successful!
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!submissionError}
        autoHideDuration={4000}
        onClose={() => setSubmissionError(null)}
      >
        <Alert onClose={() => setSubmissionError(null)} severity="error">
          {submissionError}
        </Alert>
      </Snackbar>

      {/* Dialog for Image Enlargement */}
      <Dialog
        open={!!openImage}
        onClose={handleCloseImage}
        maxWidth="lg"
      >
        <div style={{ position: 'relative' }}>
          <IconButton
            onClick={handleCloseImage}
            style={{ position: 'absolute', right: 10, top: 10, color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
          <img src={openImage} alt="Enlarged Document" style={{ width: '100%', height: 'auto' }} />
        </div>
      </Dialog>
    </div>
  );
};

export default RTODetails;
