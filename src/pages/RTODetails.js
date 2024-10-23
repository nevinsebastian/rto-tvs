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
  const [processedHelmetCert, setProcessedHelmetCert] = useState(null);
  const [processedInspectionLetter, setProcessedInspectionLetter] = useState(null);
  
  
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
  if (!helmetCertPdf || !helmetCertSignature) return;

  const formData = new FormData();
  formData.append('pdf', helmetCertPdf);
  formData.append('signature', helmetCertSignature);

  try {
    const response = await axios.post('https://api.tophaventvs.com:8000/pdf/process_pdf/helmetcert', formData, {
      responseType: 'blob',
    });
    setProcessedHelmetCert(URL.createObjectURL(response.data));
  } catch (error) {
    console.error('Error processing helmet certificate:', error);
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

      {/* PDF Editor */}
      <Card className="pdf-editor-card" variant="outlined">
        <CardContent>
          <Typography variant="h5">PDF Editor</Typography>
          <Divider />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography>Upload Form 21 PDF:</Typography>
              <input type="file" accept="application/pdf" onChange={handleForm21Change} />
              <Button onClick={handleForm21Submit} variant="contained" color="primary">Submit Form 21</Button>
              {processedForm21 && <a href={processedForm21} target="_blank" rel="noopener noreferrer">Download Processed Form 21</a>}
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography>Upload Form 20 PDF:</Typography>
              <input type="file" accept="application/pdf" onChange={handleForm20Change} />
              <input type="file" accept="image/*" onChange={handleSignatureChange} />
              <select value={financeCompany} onChange={handleFinanceCompanyChange}>
                <option value="idfc">IDFC</option>
                <option value="hdfc">HDFC</option>
                <option value="other">Other</option>
              </select>
              <Button onClick={handleForm20Submit} variant="contained" color="primary">Submit Form 20</Button>
              {processedForm20 && <a href={processedForm20} target="_blank" rel="noopener noreferrer">Download Processed Form 20</a>}
            </Grid>

            <Grid item xs={12}>
              <Typography>Upload Invoice PDF:</Typography>
              <input type="file" accept="application/pdf" onChange={handleInvoiceChange} />
              <input type="file" accept="image/*" onChange={handleBuyerSignatureChange} />
              <Button onClick={handleInvoiceSubmit} variant="contained" color="primary">Submit Invoice</Button>
              {processedInvoice && <a href={processedInvoice} target="_blank" rel="noopener noreferrer">Download Processed Invoice</a>}
            </Grid>
            <Grid item xs={12} md={6}>
  <Typography>Upload Disclaimer PDF:</Typography>
  <input type="file" accept="application/pdf" onChange={handleDisclaimerChange} />
  <input type="file" accept="image/*" onChange={handleDisclaimerSignatureChange} />
  <Button onClick={handleDisclaimerSubmit} variant="contained" color="primary">Submit Disclaimer</Button>
  {processedDisclaimer && <a href={processedDisclaimer} target="_blank" rel="noopener noreferrer">Download Processed Disclaimer</a>}
</Grid>

<Grid item xs={12} md={6}>
  <Typography>Upload Helmet Certificate PDF:</Typography>
  <input type="file" accept="application/pdf" onChange={handleHelmetCertChange} />
  <input type="file" accept="image/*" onChange={handleHelmetCertSignatureChange} />
  <Button onClick={handleHelmetCertSubmit} variant="contained" color="primary">Submit Helmet Certificate</Button>
  {processedHelmetCert && <a href={processedHelmetCert} target="_blank" rel="noopener noreferrer">Download Processed Helmet Certificate</a>}
</Grid>

<Grid item xs={12} md={6}>
  <Typography>Upload Inspection Letter PDF:</Typography>
  <input type="file" accept="application/pdf" onChange={handleInspectionLetterChange} />
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
