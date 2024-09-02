import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SalesExecutiveHome from './pages/SalesExecutiveHome';
import NewCustomer from './pages/NewCustomer';
import SalesDashboard from './pages/SalesDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/sales-executive-home" element={<SalesExecutiveHome />} />
        <Route path="/new-customer" element={<NewCustomer />} />
        <Route path="/dashboard" element={<SalesDashboard />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
