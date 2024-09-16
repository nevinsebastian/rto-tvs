import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SalesExecutive from './pages/SalesExecutive';
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
      </Routes>
    </Router>
  );
};

export default App;
