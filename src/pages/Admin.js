import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';
import { FaPlus } from 'react-icons/fa'; // Plus icon for adding employee

const Admin = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false); // To toggle form visibility
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: '', // Will be set dynamically based on dropdown selection
    branch_id: '' // Admin will enter this manually
  });
  const [apiResponse, setApiResponse] = useState(null);
  const [branchCount, setBranchCount] = useState(0); // State to hold the branch count

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

  // Map the selected role to the corresponding role_id
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
        roleId = ''; // Default to empty if nothing is selected
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
      alert('Employee created successfully!'); // Handle success
      setShowForm(false); // Close form after submission
    } catch (error) {
      console.error('Error creating employee:', error);
      alert('Failed to create employee'); // Handle error
    }
  };

  // Fetch branches when the component mounts
  useEffect(() => {
    const fetchBranches = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://13.127.21.70:8000/admin/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Accept': 'application/json'
          },
        });
        const data = await response.json();
        setBranchCount(data.length); // Update branch count with the number of branches received
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranches();
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

      {/* Display branch count in a glowing container */}
      <div className="branch-count-container">
        <h3>Number of Branches</h3>
        <div className="branch-count">{branchCount}</div>
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
            {/* Dropdown for selecting role */}
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
