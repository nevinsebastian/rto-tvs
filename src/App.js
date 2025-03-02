import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SalesExecutive from './pages/SalesExecutive';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Accounts from './pages/Accounts';
import RTO from './pages/RTO';
import Manager from './pages/Manager';
import CustomerForm from './pages/CustomerForm';
import RTODetails from './pages/RTODetails';
import Pdf from './pages/PdfEditor';
import CustomerDetails from './pages/CustomerDetails';
import AccountCustomerDetails from './pages/AccountCustomerDetails';
import Stock from './pages/Stock';
import Chassis from './pages/Chassis';
import NotFound from './pages/NotFound';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme';
import HelmetCertForm from './pages/HelmetCertForm';
import CustomerImages from './pages/CustomerImages.js';

const App = () => {
  const [token, setToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set token and user role from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUserRole(JSON.parse(storedUser).role_name); // assuming the user object contains the role_name
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show a loading screen while checking for token
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Redirect based on token existence */}
          <Route path="/" element={token ? <Navigate to={`/${userRole}`} replace /> : <Login setToken={setToken} setUserRole={setUserRole} />} />
          <Route path="/login" element={<Login setToken={setToken} setUserRole={setUserRole} />} />

          {/* Protected routes */}
          <Route path="/admin" element={token ? <Admin /> : <Navigate to="/login" />} />
          <Route path="/sales-executive" element={token ? <SalesExecutive /> : <Navigate to="/login" />} />
          <Route path="/accounts" element={token ? <Accounts /> : <Navigate to="/login" />} />
          <Route path="/rto" element={token ? <RTO /> : <Navigate to="/login" />} />
          <Route path="/manager" element={token ? <Manager /> : <Navigate to="/login" />} />
          <Route path="/customer-form/:link_token" element={<CustomerForm />} />
          <Route path="/rto/:customerId" element={<RTODetails />} />
          <Route path="/pdf" element={<Pdf />} />
          <Route path="/customer-details/:customerId" element={<CustomerDetails />} />
          <Route path="/account-customer-details/:customerId" element={<AccountCustomerDetails />} />
          <Route path="/stock" element={token ? <Stock /> : <Navigate to="/login" />} />
          <Route path="/chassis" element={<Chassis />} />
          <Route path='/hell' element={<HelmetCertForm/>}/>
          <Route path="/crop/:customerId" element={<CustomerImages />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
