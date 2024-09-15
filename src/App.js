import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SalesExecutive from './pages/SalesExecutive';
import NewCustomer from './pages/NewCustomer';
import Dashboard from './pages/SalesDashboard';
import CustomerInfo from './pages/CustomerInfo';
import PdfEditor from './pages/PdfEditor';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Accounts from './pages/Accounts';
import RTO from './pages/RTO';
import Manager from './pages/Manager';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path='/admin' element={<Admin />} />
        <Route path='/sales-executive' element={<SalesExecutive />} />
        <Route path='/accounts' element={<Accounts />} />
        <Route path='/rto' element={<RTO />} />
        <Route path='/manager' element={<Manager />} />
        <Route path="/new-customer" element={<NewCustomer />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customer-form" element={<CustomerInfo />} />
        <Route path='/pdf-editor' element={<PdfEditor />} />
      </Routes>
    </Router>
  );
};

export default App;
