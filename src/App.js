import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SalesExecutive from './pages/SalesExecutive';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Accounts from './pages/Accounts';
import RTO from './pages/RTO';
import Manager from './pages/Manager';
import CustomerForm from './pages/CustomerForm';

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* If there's a token, navigate to the Sales Executive page, else Login */}
        <Route path="/" element={token ? <Navigate to="/sales-executive" /> : <Login />} />
        
        {/* Protect the routes by checking token availability */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={token ? <Admin /> : <Navigate to="/login" />} />
        <Route path="/sales-executive" element={token ? <SalesExecutive /> : <Navigate to="/login" />} />
        <Route path="/accounts" element={token ? <Accounts /> : <Navigate to="/login" />} />
        <Route path="/rto" element={token ? <RTO /> : <Navigate to="/login" />} />
        <Route path="/manager" element={token ? <Manager /> : <Navigate to="/login" />} />
        <Route path="/customer-form/:link_token" element={<CustomerForm />} /> {/* New route */}

      </Routes>
    </Router>
  );
};

export default App;
