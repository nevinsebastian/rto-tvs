import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';
import { FaPlus, FaUserTie, FaUsers, FaChartLine, FaCashRegister, FaEdit, FaSave } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const Admin = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchDetails, setBranchDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableBranchDetails, setEditableBranchDetails] = useState({
    name: '',
    address: '',
    branch_manager: '',
    phone_number: ''
  });
  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: '',
    branch_id: ''
  });
  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleAddEmployee = async () => {
    const token = localStorage.getItem('token');
  
    try {
      const response = await fetch('https://13.127.21.70:8000/admin/create_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployee),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Employee added:', data);
        // Optionally, refresh employee data after adding the new employee
        fetchEmployeeData();
      } else {
        const data = await response.json();
        console.error('Error adding employee:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);

  const handleAddEmployeeClick = () => {
    setShowAddEmployeeForm(true);
  };
  
  

  const [employeeData, setEmployeeData] = useState({
    totalEmployees: 0,
    salesCount: 0,
    rtoCount: 0,
    accountsCount: 0,
    totalCustomers: 0
  });
  const [customerData, setCustomerData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Customers per Month',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchBranches = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://13.127.21.70:8000/admin/', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchBranchDetails = async (branchId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://13.127.21.70:8000/admin/${branchId}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBranchDetails(data);
      setEditableBranchDetails(data);
    } catch (error) {
      console.error('Error fetching branch details:', error);
    }
  };

  const fetchEmployeeData = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://13.127.21.70:8000/admin/users', {
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

      const customerResponse = await fetch('https://13.127.21.70:8000/admin/customers', {
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

      await fetchCustomerData();
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const fetchCustomerData = async () => {
    const token = localStorage.getItem('token');
    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();
    const months = [];
      for (let i = 0; i < 5; i++) {
      const month = currentMonth - i;
      const year = currentYear;
      if (month < 1) {
        months.push({ month: 12 + month, year: year - 1 });
      } else {
        months .push({ month, year });
      }
    }

    const customerData = [];
    const labels = [];

    for (const month of months) {
      try {
        const response = await fetch(`https://13.127.21.70:8000/admin/monthly-customers?month=${month.month}&year=${month.year}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        customerData.push(data.length);
        labels.push(`${month.month}/${month.year}`);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    }

    setCustomerData(prevState => ({
      ...prevState,
      labels,
      datasets: [
        {
          ...prevState.datasets[0],
          data: customerData
        }
      ]
    }));
  };

  useEffect(() => {
    fetchBranches();
    fetchEmployeeData();
  }, []);

  useEffect(() => {
    if (selectedBranch) {
      fetchBranchDetails(selectedBranch);
    }
  }, [selectedBranch]);

  const handleBranchClick = (branchId) => {
    setSelectedBranch(branchId);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const token = localStorage.getItem('token');

    const updatedBranchDetails = {
      name: editableBranchDetails.name,
      address: editableBranchDetails.address,
      branch_manager: editableBranchDetails.branch_manager,
      phone_number: editableBranchDetails.phone_number,
    };

    if (!updatedBranchDetails.name || !updatedBranchDetails.address || !updatedBranchDetails.phone_number || !updatedBranchDetails.branch_manager) {
      console.error('All fields are required');
      return;
    }

    try {
      const response = await fetch(`https://13.127.21.70:8000/admin/${selectedBranch}`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBranchDetails),
      });

      if (response.ok) {
        console.log('Branch updated successfully');
        await fetchBranchDetails(selectedBranch);
        setIsEditing(false);
      } else {
        const data = await response.json();
        console.error('Error saving branch details:', data);
      }
    } catch (error) {
      console.error('Error saving branch details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableBranchDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="admin-dashboard">
      <nav className="navbar">
        <h2 className="logo" onClick={() => window.location.reload()} style={{ cursor: 'pointer' }}>
          Admin Dashboard
        </h2>
        <div className="navbar-right">
          <span className="username">Welcome, {user?.first_name} {user?.last_name}</span>
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
          <FaPlus className="add-employee-icon" onClick={handleAddEmployeeClick} />
          {showAddEmployeeForm && (
  <div className="add-employee-form">
    <h3>Add New Employee</h3>
    <input 
      type="text" 
      name="first_name" 
      placeholder="First Name" 
      value={newEmployee.first_name} 
      onChange={handleNewEmployeeChange} 
    />
    <input 
      type="text" 
      name="last_name" 
      placeholder="Last Name" 
      value={newEmployee.last_name} 
      onChange={handleNewEmployeeChange} 
    />
    <input 
      type="email" 
      name="email" 
      placeholder="Email" 
      value={newEmployee.email} 
      onChange={handleNewEmployeeChange} 
    />
    <input 
      type="password" 
      name="password" 
      placeholder="Password" 
      value={newEmployee.password} 
      onChange={handleNewEmployeeChange} 
    />
    <input 
      type="number" 
      name="role_id" 
      placeholder="Role ID" 
      value={newEmployee.role_id} 
      onChange={handleNewEmployeeChange} 
    />
    <input 
      type="number" 
      name="branch_id" 
      placeholder="Branch ID" 
      value={newEmployee.branch_id} 
      onChange={handleNewEmployeeChange} 
    />
    <button onClick={handleAddEmployee}>Add Employee</button>
    <button onClick={() => setShowAddEmployeeForm(false)}>Cancel</button>
  </div>
)}

          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      {selectedBranch && branchDetails && (
        <div className="branch-details">
          <h3>Branch Details: {branchDetails.name}</h3>
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={editableBranchDetails.name}
                onChange={handleInputChange}
                placeholder="Branch Name"
              />
              <input
                type="text"
                name="address"
                value={editableBranchDetails.address}
                onChange={handleInputChange}
                placeholder="Address"
              />
              <input
                type="text"
                name="branch_manager"
                value={editableBranchDetails.branch_manager}
                onChange={handleInputChange}
                placeholder="Branch Manager"
              />
              <input
                type="text"
                name="phone_number"
                value={editableBranchDetails.phone_number}
                onChange={handleInputChange}
                placeholder="Phone Number"
              />
              <FaSave className="edit-icon" onClick={handleSaveClick} />
            </>
          ) : (
            <>
              <p><strong>Address:</strong> {branchDetails.address}</p>
              <p><strong>Branch Manager:</strong> {branchDetails.branch_manager}</p>
              <p><strong>Phone Number:</strong> {branchDetails.phone_number}</p>
              <FaEdit className="edit-icon" onClick={handleEditClick} />
            </>
          )}
        </div>
      )}

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
        <div className="customer-graph">
          <div className='customer-graph'>
            {customerData.labels.length > 0 && <Line data={customerData} />}
            </div>
          </div>

      </div>
    </div>
  );
};

export default Admin;