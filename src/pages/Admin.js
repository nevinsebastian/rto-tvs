import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';
import { FaPlus, FaUserTie, FaUsers, FaChartLine, FaCashRegister } from 'react-icons/fa';

const Admin = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  
  // States for branches and selected branch details
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchDetails, setBranchDetails] = useState(null);
  
  // States for employee data
  const [employeeData, setEmployeeData] = useState({
    totalEmployees: 0,
    salesCount: 0,
    rtoCount: 0,
    accountsCount: 0,
    totalCustomers: 0
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Fetch all branches on load
  const fetchBranches = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://13.127.21.70:8000/admin/', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBranches(data); // Store branches in state
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  // Fetch branch details when a branch is selected
  const fetchBranchDetails = async (branchId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://13.127.21.70:8000/admin/${branchId}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBranchDetails(data); // Store selected branch details in state
    } catch (error) {
      console.error('Error fetching branch details:', error);
    }
  };

  // Fetch employee data and customer count
  const fetchEmployeeData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://13.127.21.70:8000/admin/users', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const totalEmployees = data.length;
      const salesCount = data.filter(user => user.role_name === 'Sales').length;
      const rtoCount = data.filter(user => user.role_name === 'RTO').length;
      const accountsCount = data.filter(user => user.role_name === 'Accounts').length;

      setEmployeeData(prevState => ({
        ...prevState,
        totalEmployees,
        salesCount,
        rtoCount,
        accountsCount
      }));

      const customerResponse = await fetch('http://13.127.21.70:8000/admin/customers', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const customerData = await customerResponse.json();
      const totalCustomers = customerData.length;

      setEmployeeData(prevState => ({
        ...prevState,
        totalCustomers
      }));

    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  useEffect(() => {
    fetchBranches(); // Fetch branches on component mount
    fetchEmployeeData(); // Fetch employee and customer data
  }, []);

  const handleBranchClick = (branchId) => {
    setSelectedBranch(branchId); // Set the selected branch ID
    fetchBranchDetails(branchId); // Fetch details of the selected branch
  };

  // Reload the page when the logo is clicked
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <div className="admin-dashboard">
      <nav className="navbar">
        {/* Make the logo clickable to reload the page */}
        <h2 className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          Admin Dashboard
        </h2>
        <div className="navbar-right">
          <span className="username">Welcome, {user?.first_name} {user?.last_name}</span>

          {/* Branch dropdown */}
          <div className="branch-dropdown">
            <button className="dropdown-button">Branches</button>
            <div className="dropdown-content">
              {branches.map((branch) => (
                <p key={branch.branch_id} onClick={() => handleBranchClick(branch.branch_id)}>
                  {branch.name}
                </p>
              ))}
            </div>
          </div>

          <FaPlus className="add-employee-icon" />
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {/* Display selected branch details */}
      {selectedBranch && branchDetails && (
        <div className="branch-details">
          <h3>Branch Details: {branchDetails.name}</h3>
          <p><strong>Address:</strong> {branchDetails.address}</p>
          <p><strong>Branch Manager:</strong> {branchDetails.branch_manager}</p>
          <p><strong>Phone Number:</strong> {branchDetails.phone_number}</p>
        </div>
      )}

      {/* Employee and customer insights */}
      <div className="employee-insights">
        <div className="employee-stats">
          <div className="stat-box glowing-box">
            <FaUsers className="insight-icon" />
            <h3>Total Customers</h3>
            <p>{employeeData.totalCustomers}</p>
          </div>
          <div className="stat-box glowing-box">
            <FaUsers className="insight-icon" />
            <h3>Total Employees</h3>
            <p>{employeeData.totalEmployees}</p>
          </div>
          <div className="stat-box glowing-box">
            <FaUserTie className="insight-icon" />
            <h3>Sales Employees</h3>
            <p>{employeeData.salesCount}</p>
          </div>
          <div className="stat-box glowing-box">
            <FaChartLine className="insight-icon" />
            <h3>RTO Employees</h3>
            <p>{employeeData.rtoCount}</p>
          </div>
          <div className="stat-box glowing-box">
            <FaCashRegister className="insight-icon" />
            <h3>Accounts Employees</h3>
            <p>{employeeData.accountsCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
