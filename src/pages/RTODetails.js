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
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { 
          
  DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';


import '../styles/RTODetails.css';

import Chassis from './Chassis';
import HelmetCertForm from './HelmetCertForm';
import CustomerImages from './CustomerImages';

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


  
  const [disclaimerPdf, setDisclaimerPdf] = useState(null);
  const [disclaimerSignature, setDisclaimerSignature] = useState(null);
  const [inspectionLetterPdf, setInspectionLetterPdf] = useState(null);
  const [chasisNumberPic, setChasisNumberPic] = useState(null);
  const [processedDisclaimer, setProcessedDisclaimer] = useState(null);
  const [processedInspectionLetter, setProcessedInspectionLetter] = useState(null);
  
   // Add new state variables for edit functionality
   const [openEditDialog, setOpenEditDialog] = useState(false);
   const [editFormData, setEditFormData] = useState({
     first_name: '',
     last_name: '',
     phone_number: '',
     address: '',
     vehicle_number: ''
   });
   const [editLoading, setEditLoading] = useState(false);
   const [editError, setEditError] = useState(null);
   const [editSuccess, setEditSuccess] = useState(false);
  
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (customer) {
      setEditFormData({
        first_name: customer.first_name || '',
        last_name: customer.last_name || '',
        phone_number: customer.phone_number || '',
        address: customer.address || '',
        vehicle_number: customer.vehicle_number || ''
      });
    }
  }, [customer]);

  const handleEditClick = () => {
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setEditError(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


 
  const handleEditSubmit = async () => {
    setEditLoading(true);
    setEditError(null);

    try {
      const formData = new URLSearchParams();
      Object.entries(editFormData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const response = await axios.put(
        `https://api.tophaventvs.com:8000/rto/customers/${customerId}`,
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setEditSuccess(true);
        // Update the local customer state with new data
        setCustomer(prev => ({
          ...prev,
          ...editFormData
        }));
        handleEditClose();
        
        // Refresh the customer data
        const updatedCustomerResponse = await axios.get(
          `https://api.tophaventvs.com:8000/rto/${customerId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        setCustomer(updatedCustomerResponse.data);
      }
    } catch (error) {
      setEditError(error.response?.data?.detail || 'Failed to update customer details');
    } finally {
      setEditLoading(false);
    }
  };
  const EditDialog = () => (
    <Dialog open={openEditDialog} onClose={handleEditClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Edit Customer Details
        <IconButton
          aria-label="close"
          onClick={handleEditClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="first_name"
              label="First Name"
              fullWidth
              value={editFormData.first_name}
              onChange={handleEditInputChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="last_name"
              label="Last Name"
              fullWidth
              value={editFormData.last_name}
              onChange={handleEditInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="phone_number"
              label="Phone Number"
              fullWidth
              value={editFormData.phone_number}
              onChange={handleEditInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="address"
              label="Address"
              fullWidth
              multiline
              rows={2}
              value={editFormData.address}
              onChange={handleEditInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="vehicle_number"
              label="Vehicle Number"
              fullWidth
              value={editFormData.vehicle_number}
              onChange={handleEditInputChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEditClose}>Cancel</Button>
        <Button 
          onClick={handleEditSubmit} 
          variant="contained" 
          color="primary"
          disabled={editLoading}
        >
          {editLoading ? <CircularProgress size={24} /> : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  
  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetch(`https://api.tophaventvs.com:8000/rto/${customerId}`, {
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
  // New PDF handling functions
  const handleDisclaimerChange = (e) => {
    setDisclaimerPdf(e.target.files[0]);
  };

  const handleDisclaimerSignatureChange = (e) => {
    setDisclaimerSignature(e.target.files[0]);
  };





  const handleInspectionLetterChange = (e) => {
    setInspectionLetterPdf(e.target.files[0]);
  };

  const handleChasisNumberPicChange = (e) => {
    setChasisNumberPic(e.target.files[0]);
  };

// New PDF submission functions
const handleDisclaimerSubmit = async () => {
  if (!disclaimerPdf || !disclaimerSignature) return;

  const formData = new FormData();
  formData.append('pdf', disclaimerPdf);
  formData.append('signature', disclaimerSignature);

  try {
    const response = await axios.post('https://api.tophaventvs.com:8000/pdf/process_pdf/disclaimer', formData, {
      responseType: 'blob',
    });
    setProcessedDisclaimer(URL.createObjectURL(response.data));
  } catch (error) {
    console.error('Error processing disclaimer:', error);
  }
};







  // New PDF submission functions


  const handleInspectionLetterSubmit = async () => {
    if (!inspectionLetterPdf || !chasisNumberPic) return;

    const formData = new FormData();
    formData.append('pdf', inspectionLetterPdf);
    formData.append('chasis_number_pic', chasisNumberPic);

    try {
      const response = await axios.post('https://api.tophaventvs.com:8000/pdf/process_pdf/inspection_letter', formData, {
        responseType: 'blob',
      });
      setProcessedInspectionLetter(URL.createObjectURL(response.data));
    } catch (error) {
      console.error('Error processing inspection letter:', error);
    }
  };



  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleForm21Submit = async () => {
    if (!form21Pdf) return;

    const formData = new FormData();
    formData.append('pdf', form21Pdf);

    try {
      const response = await axios.post('https://api.tophaventvs.com:8000/pdf/process_pdf/form21', formData, {
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
      const response = await axios.post('https://api.tophaventvs.com:8000/pdf/process_pdf/form20', formData, {
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
      const response = await axios.post('https://api.tophaventvs.com:8000/pdf/process_pdf/invoice', formData, {
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
      const response = await axios.post(`https://api.tophaventvs.com:8000/rto/verify/${customerId}`, {}, {
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

  const handleDownloadImages = async () => {
    if (!customer) return;

    const zip = new JSZip();
    const imgFolder = zip.folder('documents'); // Create a folder in the zip
    const firstName = customer.name.split(' ')[0]; // Get the customer's first name

    // Prepare the images to be downloaded
    const imageUrls = [
        { name: 'aadhaar_combined.jpg', url: customer.photo_adhaar_combined },
        { name: 'customer_signature.png', url: customer.customer_sign },
        { name: 'customer_signature_copy.png', url: customer.customer_sign_copy }, // New entry
    ];

    try {
        // Add images to the zip
        await Promise.all(
            imageUrls.map(async (image) => {
                console.log(`Fetching image from: ${image.url}`);
                const imgData = await axios.get(image.url, { responseType: 'arraybuffer' });
                imgFolder.file(image.name, imgData.data);
            })
        );

        // Generate zip file and trigger download with customer's first name
        zip.generateAsync({ type: 'blob' }).then((content) => {
            FileSaver.saveAs(content, `${firstName}_documents.zip`);
        });
    } catch (error) {
        console.error('Error downloading images:', error);
        alert('An error occurred while downloading images. Please check the console for more details.');
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
        <Button
              startIcon={<EditIcon />}
              variant="outlined"
              color="primary"
              onClick={handleEditClick}
              sx={{ ml: 2 }}
            >
              Edit Details
            </Button>
      </Typography>
      <Divider />
      <EditDialog />
      <Snackbar 
            open={editSuccess} 
            autoHideDuration={6000} 
            onClose={() => setEditSuccess(false)}
          >
            <Alert severity="success" onClose={() => setEditSuccess(false)}>
              Customer details updated successfully!
            </Alert>
          </Snackbar>
          
          <Snackbar 
            open={Boolean(editError)} 
            autoHideDuration={6000} 
            onClose={() => setEditError(null)}
          >
            <Alert severity="error" onClose={() => setEditError(null)}>
              {editError}
            </Alert>
          </Snackbar>

      {customer && (
        <Grid container spacing={2} className="customer-details-grid">
          {/* Customer Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6">
              <PersonIcon /> {customer.first_name} {customer.last_name}
            </Typography>
            <Typography>
              <PhoneIcon /> {customer.phone_number}
            </Typography>
            <Typography>
              <strong>Alternate Phone:</strong> {customer.alternate_phone_number}
            </Typography>
            <Typography>
              <strong>Address:</strong> {customer.address}, {customer.pin_code}
            </Typography>
            <Typography>
              <strong>Date of Birth:</strong> {customer.dob}
            </Typography>
            <Typography>
              <strong>Nominee:</strong> {customer.nominee} ({customer.relation})
            </Typography>
            <Typography>
              <strong>taluk :</strong> {customer.taluk}
            </Typography>
          </Grid>

          {/* Vehicle Details */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6">
              <DirectionsCarIcon /> {customer.vehicle_name} - {customer.vehicle_variant}
            </Typography>
            <Typography>
              <strong>Color:</strong> {customer.vehicle_color}
            </Typography>
            <Typography>
              <strong>Ex-showroom Price:</strong> ₹{customer.ex_showroom_price}
            </Typography>
            <Typography>
              <strong>Tax:</strong> ₹{customer.tax}
            </Typography>
            <Typography>
              <strong>Insurance:</strong> ₹{customer.insurance}
            </Typography>
            <Typography>
              <strong>TP Registration:</strong> ₹{customer.tp_registration}
            </Typography>
            <Typography>
              <strong>Mandatory Accessories:</strong> ₹{customer.man_accessories}
            </Typography>
            <Typography>
              <strong>Optional Accessories:</strong> ₹{customer.optional_accessories}
            </Typography>
            <Typography>
              <strong>Amount Paid:</strong> ₹{customer.amount_paid}
            </Typography>
            <Typography>
              <strong>Balance Amount:</strong> ₹{customer.balance_amount}
            </Typography>
            <Typography>
              <strong>Total Price:</strong> ₹{customer.total_price}
            </Typography>
            <Typography>
              <strong>Status:</strong> {customer.status}
            </Typography>
          </Grid>

          {/* Verification Status */}
          <Grid item xs={12}>
            <Typography variant="h6">Verification Status</Typography>
            <Typography>
              <strong>Sales Verified:</strong> {statusIcon(customer.sales_verified)}
            </Typography>
            <Typography>
              <strong>Accounts Verified:</strong> {statusIcon(customer.accounts_verified)}
            </Typography>
            <Typography>
              <strong>RTO Verified:</strong> {statusIcon(customer.rto_verified)}
            </Typography>
          </Grid>

          {/* Image Preview */}
          <Grid item xs={12}>
            <Typography variant="h6">Images</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <p>Adhar combined</p>
                <Avatar
                  
                  variant="rounded"
                  src={customer.photo_adhaar_combined}
                  sx={{ width: 350, height: 350, cursor: 'pointer' }}
                  onClick={() => handleImageClick(customer.photo_adhaar_combined)}
                />
              </Grid>
              
              <Grid item xs={4}>
              <p>Sign bg removed</p>

                <Avatar
                
                  variant="rounded"
                  src={customer.customer_sign}
                  sx={{ width: 350, height: 350, cursor: 'pointer' }}
                  onClick={() => handleImageClick(customer.customer_sign)}
                />
              </Grid>

              {/* New Image for customer_sign_copy */}
              <Grid item xs={4}>
              <p>Sign stock</p>

                <Avatar
                  variant="rounded"
                  src={customer.customer_sign_copy}
                  sx={{ width: 350, height: 350, cursor: 'pointer' }}
                  onClick={() => handleImageClick(customer.customer_sign_copy)}
                />
              </Grid>
              <CustomerImages/>
            </Grid>
          </Grid>

          {/* Registration & Delivery Details */}
          <Grid item xs={12}>
            <Typography variant="h6">Registration Details</Typography>
            <Typography>
              <strong>Registered:</strong> {customer.registered ? 'Yes' : 'No'}
            </Typography>
            <Typography>
              <strong>Vehicle Number:</strong> {customer.vehicle_number || 'Not Assigned'}
            </Typography>
          </Grid>

          {/* Delivery Photo */}
          <Grid item xs={12}>
            <Typography variant="h6">Delivery Photo</Typography>
            {customer.delivery_photo ? (
              <Avatar
                variant="rounded"
                src={customer.delivery_photo}
                sx={{ width: 150, height: 150, cursor: 'pointer' }}
                onClick={() => handleImageClick(customer.delivery_photo)}
              />
            ) : (
              <Typography>No Delivery Photo</Typography>
            )}
          </Grid>
        </Grid>
      )}
    </CardContent>
    <Button onClick={handleVerifyCustomer} variant="contained" color="primary" disabled={submitting}>
      {submitting ? <CircularProgress size={24} /> : 'Verify Customer'}
    </Button>
    <Button onClick={handleDownloadImages} variant="contained" color="secondary" style={{ marginLeft: '10px' }}>
      Download Images
    </Button>

    <Snackbar open={submissionSuccess} autoHideDuration={6000} onClose={() => setSubmissionSuccess(false)}>
      <Alert onClose={() => setSubmissionSuccess(false)} severity="success">
        Customer verified successfully!
      </Alert>
    </Snackbar>

    <Snackbar open={Boolean(submissionError)} autoHideDuration={6000} onClose={() => setSubmissionError(null)}>
      <Alert onClose={() => setSubmissionError(null)} severity="error">
        {submissionError}
      </Alert>
    </Snackbar>

    {/* Image Dialog */}
    {openImage && (
      <Dialog open={Boolean(openImage)} onClose={handleCloseImage}>
        <IconButton onClick={handleCloseImage} sx={{ position: 'absolute', right: 8, top: 8 }} aria-label="close">
          <CloseIcon />
        </IconButton>
        <img src={openImage} alt="Document" style={{ width: '100%', height: 'auto' }} />
      </Dialog>
    )}
  </Card>

  {/* Chassis Image Search */}
  <Card className="chassis-search-card" variant="outlined" style={{ marginTop: '20px' }}>
    <CardContent>
      <Chassis/>
    </CardContent>
  </Card>

      {/* PDF Editor */}
     {/* PDF Editor */}
<Card className="pdf-editor-card" variant="outlined">
  <CardContent>
    <Typography variant="h5">PDF Editor</Typography>
    <Divider />

    <Grid container spacing={2}>

      {/* Form 21 Section */}
      <Grid item xs={12} className='form-item'>
        <Typography>Upload Form 21 PDF:</Typography>
        <input type="file" accept="application/pdf" onChange={handleForm21Change} />
        <Button onClick={handleForm21Submit} variant="contained" color="primary">Submit Form 21</Button>
        {processedForm21 && <a href={processedForm21} target="_blank" rel="noopener noreferrer">Download Processed Form 21</a>}
      </Grid>

      {/* Form 20 Section */}
      <Grid item xs={12} className='form-item'>
        <Typography>Upload Form 20 PDF:</Typography>
        <input type="file" accept="application/pdf" onChange={handleForm20Change} />
        <Typography>Upload Signature:</Typography>
        <input type="file" accept="image/*" onChange={handleSignatureChange} />
        <Typography>Finance Company:</Typography>
        <select value={financeCompany} onChange={handleFinanceCompanyChange}>
          <option value="idfc">IDFC</option>
          <option value="hdfc">HDFC</option>
          <option value="tvscredit">tvscredit</option>
          <option value="sreeramcheng">sreeramcheng</option>
          <option value="tatacap">tatacap</option>
          <option value="hdb">hdb</option>
          <option value="indus">indus</option>
          <option value="kotak">kotak</option>
          <option value="sreeramalp">sreeramalp</option>
          <option value="bajajalp">bajajalp</option>


        </select>
        <Button onClick={handleForm20Submit} variant="contained" color="primary">Submit Form 20</Button>
        {processedForm20 && <a href={processedForm20} target="_blank" rel="noopener noreferrer">Download Processed Form 20</a>}
      </Grid>

      {/* Invoice Section */}
      <Grid item xs={12} className='form-item'>
        <Typography>Upload Invoice PDF:</Typography>
        <input type="file" accept="application/pdf" onChange={handleInvoiceChange} />
        <Typography>Upload Buyer Signature:</Typography>
        <input type="file" accept="image/*" onChange={handleBuyerSignatureChange} />
        <Button onClick={handleInvoiceSubmit} variant="contained" color="primary">Submit Invoice</Button>
        {processedInvoice && <a href={processedInvoice} target="_blank" rel="noopener noreferrer">Download Processed Invoice</a>}
      </Grid>

      {/* Disclaimer Section */}
      <Grid item xs={12} className='form-item'>
        <Typography>Upload Disclaimer PDF:</Typography>
        <input type="file" accept="application/pdf" onChange={handleDisclaimerChange} />
        <Typography>Upload Disclaimer Signature:</Typography>
        <input type="file" accept="image/*" onChange={handleDisclaimerSignatureChange} />
        <Button onClick={handleDisclaimerSubmit} variant="contained" color="primary">Submit Disclaimer</Button>
        {processedDisclaimer && <a href={processedDisclaimer} target="_blank" rel="noopener noreferrer">Download Processed Disclaimer</a>}
      </Grid>

      {/* Helmet Certification Section */}
      <Grid item xs={12} className="form-item">
        <HelmetCertForm/>
      </Grid>


      {/* Inspection Letter Section */}
      <Grid item xs={12} className='form-item'>
        <Typography>Upload Inspection Letter PDF:</Typography>
        <input type="file" accept="application/pdf" onChange={handleInspectionLetterChange} />
        <Typography>Upload Chassis Number Picture:</Typography>
        <input type="file" accept="image/*" onChange={handleChasisNumberPicChange} />
        <Button onClick={handleInspectionLetterSubmit} variant="contained" color="primary">Submit Inspection Letter</Button>
        {processedInspectionLetter && <a href={processedInspectionLetter} target="_blank" rel="noopener noreferrer">Download Processed Inspection Letter</a>}
      </Grid>

    </Grid>
  </CardContent>
</Card>

    </div>
  );
};

export default RTODetails;
