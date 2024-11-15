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
  const [userRole, setUserRole] = useState(null); // Store user role (e.g., 'rto', 'sales-executive', etc.)
  const [loading, setLoading] = useState(true);

  // Set token and user role from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role'); // Assuming the role is stored separately
    if (storedToken && storedRole) {
      setToken(storedToken);
      setUserRole(storedRole); // Set the user role (e.g., 'sales-executive', 'rto', etc.)
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          {/* Root Route with Role-based Redirection */}
          <Route 
            path="/" 
            element={token ? 
              (userRole === 'rto' ? <Navigate to="/rto" replace /> :
                userRole === 'sales-executive' ? <Navigate to="/sales-executive" replace /> : 
                <Navigate to="/login" />) 
              : <Login setToken={setToken} setUserRole={setUserRole} />} 
          />
          <Route path="/login" element={<Login setToken={setToken} setUserRole={setUserRole} />} />

          {/* Protected routes */}
          <Route 
            path="/admin" 
            element={token && userRole === 'admin' ? <Admin /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/sales-executive" 
            element={token && userRole === 'sales' ? <SalesExecutive /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/accounts" 
            element={token && userRole === 'accounts' ? <Accounts /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/rto" 
            element={token && userRole === 'rto' ? <RTO /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/manager" 
            element={token && userRole === 'manager' ? <Manager /> : <Navigate to="/login" />} 
          />
          <Route path="/customer-form/:link_token" element={<CustomerForm />} />
          <Route path="/rto/:customerId" element={<RTODetails />} />
          <Route path="/pdf" element={<Pdf />} />
          <Route path="/customer-details/:customerId" element={<CustomerDetails />} />
          <Route path="/account-customer-details/:customerId" element={<AccountCustomerDetails />} />
          <Route 
            path="/stock" 
            element={token && userRole === 'stock' ? <Stock /> : <Navigate to="/login" />} 
          />
          <Route path="/chassis" element={<Chassis />} />
          <Route path="/hell" element={<HelmetCertForm />} />
          <Route path="/crop/:customerId" element={<CustomerImages />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
