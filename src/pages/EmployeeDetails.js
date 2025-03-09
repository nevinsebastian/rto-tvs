import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import '../styles/AdminDashboard.css';

const EmployeeDetails = ({ userId, onBack }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        const response = await fetch(`https://prod.tophaventvs.com/admin/users/${userId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        setEmployee(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch employee details error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [userId]);

  if (loading) {
    return <div className="loading">Loading employee details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  const getBranchName = (branchId) => {
    return branchId === 1 ? 'Thiruvambady' : (branchId || 'N/A');
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>
          <button className="icon-btn" onClick={onBack}>
            <FiArrowLeft />
          </button>
          {`${employee.first_name} ${employee.last_name}`}
        </h2>
      </div>
      <div className="employee-details">
        <div className="details-grid">
          <div className="detail-item">
            <label>User ID:</label>
            <span>{employee.user_id}</span>
          </div>
          <div className="detail-item">
            <label>First Name:</label>
            <span>{employee.first_name}</span>
          </div>
          <div className="detail-item">
            <label>Last Name:</label>
            <span>{employee.last_name}</span>
          </div>
          <div className="detail-item">
            <label>Email:</label>
            <span>{employee.email}</span>
          </div>
          <div className="detail-item">
            <label>Role:</label>
            <span>{employee.role_name}</span>
          </div>
          <div className="detail-item">
            <label>Branch:</label>
            <span>{getBranchName(employee.branch_id)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;