import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SalesExecutiveHome from './pages/SalesExecutiveHome';
import NewCustomer from './pages/NewCustomer';
import Dashboard from './pages/SalesDashboard';
import CustomerInfo from './pages/CustomerInfo';
import PdfEditor from './pages/PdfEditor';


const App = () => {
  return (
    <Router>
      {/* Ensure Navbar is rendered */}
      <Routes>
        <Route path="/" element={<SalesExecutiveHome />} />
        <Route path="/new-customer" element={<NewCustomer />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Update this path to match URLs with query strings */}
        <Route path="/customer-form" element={<CustomerInfo />} />
        <Route path='/pdf-editor' element={<PdfEditor/>} />
      </Routes>
    </Router>
  );
};

export default App;
