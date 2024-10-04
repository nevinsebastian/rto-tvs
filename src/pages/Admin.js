import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';
import { FaPlus, FaUserTie, FaUsers, FaChartLine, FaCashRegister } from 'react-icons/fa'; // Icons for insight section

const Admin = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: '',
    branch_id: ''
  });
  const [apiResponse, setApiResponse] = useState(null);
  const [employeeData, setEmployeeData] = useState({
    totalEmployees: 0,
    salesCount: 0,
    rtoCount: 0,
    accountsCount: 0,
    totalCustomers: 0 // New state for total customers
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    let roleId = '';
    switch (selectedRole) {
      case 'Admin':
        roleId = 1;
        break;
      case 'Sales':
        roleId = 2;
        break;
      case 'Accounts':
        roleId = 3;
        break;
      case 'RTO':
        roleId = 4;
        break;
      default:
        roleId = '';
    }
    setFormData({
      ...formData,
      role_id: roleId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://13.127.21.70:8000/admin/create_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setApiResponse(data);
      alert('Employee created successfully!');
      setShowForm(false);
      fetchEmployeeData(); // Refresh employee data after creating a new employee
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Failed to create employee');
    }
  };

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

      // Fetch total customers
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
        totalCustomers // Update total customers state
      }));

    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  return (
    <div className="admin-dashboard">
      <nav className="navbar">
        <h2 className="logo">Admin Dashboard</h2>
        <div className="navbar-right">
          <span className="username">
            Welcome, {user?.first_name} {user?.last_name}
          </span>
          <FaPlus className="add-employee-icon" onClick={toggleForm} />
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="employee-insights">
        <div className="employee-stats">
          <div className="stat-box glowing-box">
            <FaUsers className="insight-icon" />
            <h3>Total Customers</h3>
            <p>{employeeData.totalCustomers}</p> {/* Total Customers Display */}
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

      {showForm && (
        <div className="employee-form-container">
          <h3>Add New Employee</h3>
          <form className="employee-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="branch_id"
              placeholder="Branch ID"
              value={formData.branch_id}
              onChange={handleChange}
              required
            />
            <select name="role" onChange={handleRoleChange} required>
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Sales">Sales</option>
              <option value="Accounts">Accounts</option>
              <option value="RTO">RTO</option>
            </select>
            <button type="submit" className="submit-button">Create Employee</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Admin;
