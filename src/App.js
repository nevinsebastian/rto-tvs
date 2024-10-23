// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SalesExecutive from './pages/SalesExecutive';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Accounts from './pages/Accounts';
import RTO from './pages/RTO';
import Manager from './pages/Manager';
import CustomerForm from './pages/CustomerForm';
import RTODetails from './pages/RTODetails'; // Import the new component
import Pdf from './pages/PdfEditor';
import CustomerDetails from './pages/CustomerDetails';
import AccountCustomerDetails from './pages/AccountCustomerDetails'; 
import Stock from './pages/Stock';
import Chassis from './pages/Chassis';
import NotFound from './pages/NotFound';


//theme
import theme from './theme/theme';
import { ThemeProvider } from 'react-bootstrap';


const App = () => {
  const token = localStorage.getItem('token');

  return (
    <ThemeProvider theme={theme}>
      <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/sales-executive" /> : <Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={token ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/sales-executive" element={token ? <SalesExecutive /> : <Navigate to="/login" />} />
        <Route path="/accounts" element={token ? <Accounts /> : <Navigate to="/login" />} />
        <Route path="/rto" element={token ? <RTO /> : <Navigate to="/login" />} />
        <Route path="/manager" element={token ? <Manager /> : <Navigate to="/login" />} />
        <Route path="/customer-form/:link_token" element={<CustomerForm />} />
        <Route path="/rto/:customerId" element={<RTODetails />} /> {/* Updated route for customer details */}
        <Route path='/pdf' element={<Pdf />} />
        <Route path="/customer-details/:customerId" element={<CustomerDetails />} />
        <Route path="/account-customer-details/:customerId" element={<AccountCustomerDetails />} /> {/* Updated route for account customer details */}
        <Route  path='/stock' element={token ? <Stock/> :<Navigate to="/login" />}/>
        <Route path='/chassis' element={<Chassis/>}/>
        <Route path='*' element={<NotFound/>}/>

        </Routes>
        
    </Router>
    </ThemeProvider>

  );
};

export default App;
