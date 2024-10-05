import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Avatar, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import '../styles/RTODetails.css';

const RTODetails = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

              <Grid item xs={12}>
                <Typography variant="h6">Documents</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Avatar src={customer.photo_adhaar_front} alt="Aadhaar Front" variant="rounded" sx={{ width: 150, height: 150 }} />
                    <Typography>Aadhaar Front</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Avatar src={customer.photo_adhaar_back} alt="Aadhaar Back" variant="rounded" sx={{ width: 150, height: 150 }} />
                    <Typography>Aadhaar Back</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Avatar src={customer.photo_passport} alt="Passport" variant="rounded" sx={{ width: 150, height: 150 }} />
                    <Typography>Passport</Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RTODetails;
