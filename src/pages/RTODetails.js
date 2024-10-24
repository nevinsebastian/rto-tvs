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

const [customerName, setCustomerName] = useState('');
const [chassisNumber, setChassisNumber] = useState('');
const [date, setDate] = useState('');
const [helmetCertPDF, setHelmetCertPDF] = useState(null);
const [processedHelmetCert, setProcessedHelmetCert] = useState(null);

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
  const [helmetCertPdf, setHelmetCertPdf] = useState(null);
  const [helmetCertSignature, setHelmetCertSignature] = useState(null);
  const [inspectionLetterPdf, setInspectionLetterPdf] = useState(null);
  const [chasisNumberPic, setChasisNumberPic] = useState(null);
  const [processedDisclaimer, setProcessedDisclaimer] = useState(null);
  const [processedInspectionLetter, setProcessedInspectionLetter] = useState(null);
  
  const [chassisSearchNumber, setChassisSearchNumber] = useState('');
  const [chassisImageUrl, setChassisImageUrl] = useState('');
  const [chassisError, setChassisError] = useState('');
  const [loadingChassisImage, setLoadingChassisImage] = useState(false);
  
  
  const token = localStorage.getItem('token');
  const navigate = useNavigate();


  
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
  const handleChassisSearch = async () => {
    if (!chassisSearchNumber) {
      setChassisError('Please enter a chassis number.');
      return;
    }

    setLoadingChassisImage(true);
    setChassisError('');

    try {
      const response = await axios.get(`https://api.tophaventvs.com:8000/chasisimage/${chassisSearchNumber}`, {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setChassisImageUrl(response.data.image_url);
        setChasisNumberPic(response.data.image_url); // Automatically set the chassis image for the inspection letter
      }
    } catch (err) {
      setChassisError('Error: ' + (err.response?.data?.detail || 'Failed to fetch chassis image'));
      setChassisImageUrl('');
    } finally {
      setLoadingChassisImage(false);
    }
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

  const handleHelmetCertChange = (e) => {
    setHelmetCertPdf(e.target.files[0]);
  };

  const handleHelmetCertSignatureChange = (e) => {
    setHelmetCertSignature(e.target.files[0]);
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

const handleHelmetCertSubmit = async () => {
  const formData = new FormData();
  formData.append('customer_name', customerName);
  formData.append('chasis_number', chassisNumber);
  formData.append('date', date);
  formData.append('pdf', helmetCertPDF);
  formData.append('signature', signature);

  try {
    const response = await fetch('https://13.127.21.70:8000/pdf/process_pdf/helmetcert', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setProcessedHelmetCert(data); // Assuming the response contains the link to the processed PDF
  } catch (error) {
    console.error('Error submitting helmet certification:', error);
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

    // Prepare the images to be downloaded
    const imageUrls = [
        { name: 'aadhaar_combined.jpg', url: customer.photo_adhaar_combined },
        { name: 'passport.jpg', url: customer.photo_passport },
        { name: 'customer_signature.png', url: customer.customer_sign },
        { name: 'customer_signature_copy.png', url: customer.customer_sign_copy }, // New entry

    ];

    try {
        // Add images to the zip
        await Promise.all(
            imageUrls.map(async (image) => {
                // Log the image URL for debugging
                console.log(`Fetching image from: ${image.url}`);
                
                const imgData = await axios.get(image.url, { responseType: 'arraybuffer' });
                imgFolder.file(image.name, imgData.data);
            })
        );

        // Generate zip file and trigger download
        zip.generateAsync({ type: 'blob' }).then((content) => {
            FileSaver.saveAs(content, 'customer_documents.zip');
        });
    } catch (error) {
        // Handle and log errors
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
          </Typography>
          <Divider />

          {customer && (
            <Grid container spacing={2} className="customer-details-grid">
              {/* Customer Details */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6"><PersonIcon /> {customer.first_name} {customer.last_name}</Typography>
                <Typography><PhoneIcon /> {customer.phone_number}</Typography>
                <Typography><strong>Address:</strong> {customer.address}, {customer.pin_code}</Typography>
                <Typography><strong>Date of Birth:</strong> {customer.dob}</Typography>
                <Typography><strong>Nominee:</strong> {customer.nominee} ({customer.relation})</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6"><DirectionsCarIcon /> {customer.vehicle_name} - {customer.vehicle_variant}</Typography>
                <Typography><strong>Color:</strong> {customer.vehicle_color}</Typography>
                <Typography><strong>Ex-showroom Price:</strong> ₹{customer.ex_showroom_price}</Typography>
                <Typography><strong>Tax:</strong> ₹{customer.tax}</Typography>
                <Typography><strong>Status:</strong> {customer.status}</Typography>
              </Grid>

              {/* Verification Status */}
              <Grid item xs={12}>
                <Typography variant="h6">Verification Status</Typography>
                <Typography><strong>Sales Verified:</strong> {statusIcon(customer.sales_verified)}</Typography>
                <Typography><strong>Accounts Verified:</strong> {statusIcon(customer.accounts_verified)}</Typography>
                <Typography><strong>RTO Verified:</strong> {statusIcon(customer.rto_verified)}</Typography>
              </Grid>

              {/* Image Preview */}
              <Grid item xs={12}>
  <Typography variant="h6">Images</Typography>
  <Grid container spacing={2}>
    <Grid item xs={4}>
      <Avatar variant="rounded" src={customer.photo_adhaar_combined} sx={{ width: 150, height: 150, cursor: 'pointer' }} onClick={() => handleImageClick(customer.photo_adhaar_combined)} />
    </Grid>
    <Grid item xs={4}>
      <Avatar variant="rounded" src={customer.photo_passport} sx={{ width: 150, height: 150, cursor: 'pointer' }} onClick={() => handleImageClick(customer.photo_passport)} />
    </Grid>
    <Grid item xs={4}>
      <Avatar variant="rounded" src={customer.customer_sign} sx={{ width: 150, height: 150, cursor: 'pointer' }} onClick={() => handleImageClick(customer.customer_sign)} />
    </Grid>
    {/* New Image for customer_sign_copy */}
    <Grid item xs={4}>
      <Avatar variant="rounded" src={customer.customer_sign_copy} sx={{ width: 150, height: 150, cursor: 'pointer' }} onClick={() => handleImageClick(customer.customer_sign_copy)} />
    </Grid>
  </Grid>
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
      <Card className="chassis-search-card" variant="outlined" style={{ marginTop: '20px' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Chassis Image Search
          </Typography>
          <Divider />
          
          <Grid container spacing={2} alignItems="center" style={{ marginTop: '10px' }}>
            <Grid item xs={12} sm={6}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Enter Chassis Number"
                  value={chassisSearchNumber}
                  onChange={(e) => setChassisSearchNumber(e.target.value)}
                  style={{
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    flexGrow: 1
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleChassisSearch}
                  disabled={loadingChassisImage}
                >
                  {loadingChassisImage ? <CircularProgress size={24} /> : 'Search'}
                </Button>
              </div>
              {chassisError && (
                <Typography color="error" style={{ marginTop: '8px' }}>
                  {chassisError}
                </Typography>
              )}
            </Grid>
            
            {chassisImageUrl && (
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Chassis Image:
                </Typography>
                <img
                  src={chassisImageUrl}
                  alt="Chassis"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '4px'
                  }}
                />
              </Grid>
            )}
          </Grid>
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
  <Typography>Upload Helmet Certificate PDF:</Typography>
  <input type="file" accept="application/pdf" onChange={handleHelmetCertChange} />
  
  <Typography>Customer Name:</Typography>
  <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
  
  <Typography>Chassis Number:</Typography>
  <input type="text" value={chassisNumber} onChange={(e) => setChassisNumber(e.target.value)} />
  
  <Typography>Date:</Typography>
  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
  
  <Typography>Upload Helmet Certification Signature:</Typography>
  <input type="file" accept="image/*" onChange={handleHelmetCertSignatureChange} />
  
  <Button onClick={handleHelmetCertSubmit} variant="contained" color="primary">Submit Helmet Certification</Button>
  
  {processedHelmetCert && <a href={processedHelmetCert} target="_blank" rel="noopener noreferrer">Download Processed Helmet Certificate</a>}
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
