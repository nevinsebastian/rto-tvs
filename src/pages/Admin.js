import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';
import { FaPlus, FaEdit, FaSave } from 'react-icons/fa';
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
      const response = await fetch('https://api.tophaventvs.com:8000/admin/create_user', {
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
      const response = await fetch('https://api.tophaventvs.com:8000/admin/', {
        method: 'GET',
        headers: {
          accept: 'application/json',
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
      const response = await fetch(`https://api.tophaventvs.com:8000/admin/${branchId}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
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

  const fetchEmployeeData = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://api.tophaventvs.com:8000/admin/users', {
        method: 'GET',
        headers: {
          accept: 'application/json',
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

      const customerResponse = await fetch('https://api.tophaventvs.com:8000/admin/customers', {
        method: 'GET',
        headers: {
          accept: 'application/json',
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
  }, []); // UseCallback to avoid re-creation on every render

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
        months.push({ month, year });
      }
    }

    const customerData = [];
    const labels = [];

    for (const month of months) {
      try {
        const response = await fetch(`https://api.tophaventvs.com:8000/admin/monthly-customers?month=${month.month}&year=${month.year}`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
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
  }, [fetchEmployeeData]);

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
      const response = await fetch(`https://api.tophaventvs.com:8000/admin/${selectedBranch}`, {
        method: 'PUT',
        headers: {
          accept: 'application/json',
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
        <h2 className="logo" onClick={() => window.location.reload()}>Admin Dashboard</h2>
        <div className="user-info">
          <span>Welcome, {user?.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="branch-list">
        <h3>Branches</h3>
        <ul>
          {branches.map(branch => (
            <li key={branch.id} onClick={() => handleBranchClick(branch.id)}>
              {branch.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="branch-details">
        {branchDetails && (
          <div>
            <h3>Branch Details</h3>
            <p><strong>Address:</strong> {isEditing ? <input name="address" value={editableBranchDetails.address} onChange={handleInputChange} /> : branchDetails.address}</p>
            <p><strong>Branch Manager:</strong> {isEditing ? <input name="branch_manager" value={editableBranchDetails.branch_manager} onChange={handleInputChange} /> : branchDetails.branch_manager}</p>
            <p><strong>Phone Number:</strong> {isEditing ? <input name="phone_number" value={editableBranchDetails.phone_number} onChange={handleInputChange} /> : branchDetails.phone_number}</p>
            {isEditing ? <button onClick={handleSaveClick}><FaSave /> Save</button> : <button onClick={handleEditClick}><FaEdit /> Edit</button>}
          </div>
        )}
      </div>

      <div className="employee-data">
        <h3>Employee Stats</h3>
        <p>Total Employees: {employeeData.totalEmployees}</p>
        <p>Sales: {employeeData.salesCount}</p>
        <p>RTO: {employeeData.rtoCount}</p>
        <p>Accounts: {employeeData.accountsCount}</p>
        <p>Total Customers: {employeeData.totalCustomers}</p>
      </div>

      <div className="add-employee-form">
        {showAddEmployeeForm && (
          <div>
            <h3>Add New Employee</h3>
            <input name="first_name" value={newEmployee.first_name} onChange={handleNewEmployeeChange} placeholder="First Name" />
            <input name="last_name" value={newEmployee.last_name} onChange={handleNewEmployeeChange} placeholder="Last Name" />
            <input name="email" value={newEmployee.email} onChange={handleNewEmployeeChange} placeholder="Email" />
            <input name="password" value={newEmployee.password} onChange={handleNewEmployeeChange} placeholder="Password" />
            <input name="role_id" value={newEmployee.role_id} onChange={handleNewEmployeeChange} placeholder="Role ID" />
            <input name="branch_id" value={newEmployee.branch_id} onChange={handleNewEmployeeChange} placeholder="Branch ID" />
            <button onClick={handleAddEmployee}>Add Employee</button>
          </div>
        )}
        <button onClick={handleAddEmployeeClick}><FaPlus /> Add Employee</button>
      </div>

      <div className="customer-chart">
        <h3>Customer Growth</h3>
        <Line data={customerData} />
      </div>
    </div>
  );
};

export default Admin;
