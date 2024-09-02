import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SalesDashboard from './pages/SalesDashboard';
import NewCustomer from './pages/NewCustomer';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<SalesDashboard />} />
        <Route path="/new-customer" element={<NewCustomer />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
