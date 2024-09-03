import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SalesExecutiveHome from './pages/SalesExecutiveHome';
import NewCustomer from './pages/NewCustomer';
import Dashboard from './pages/SalesDashboard';

const App = () => {
  return (
    <Router>
      {/* Ensure Navbar is rendered */}
      <Routes>
        <Route path="/" element={<SalesExecutiveHome />} />
        <Route path="/new-customer" element={<NewCustomer />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
