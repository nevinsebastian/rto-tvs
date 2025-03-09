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

  const getBranchName = (branchId) => {
    return branchId === 1 ? 'Thiruvambady' : (branchId || 'N/A');
  };

  if (loading) {
    return (
      <div className="section animate-fade-in">
        <div className="section-header flex items-center space-x-4">
          <div className="skeleton h-8 w-8 rounded-full"></div>
          <div className="skeleton h-6 w-48 rounded"></div>
        </div>
        <div className="employee-details-card mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(6).fill().map((_, index) => (
              <div key={index} className="detail-item">
                <div className="skeleton h-4 w-20 mb-2 rounded"></div>
                <div className="skeleton h-10 w-full rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section animate-fade-in">
          <button onClick={onBack}>
            <FiArrowLeft size={50} />
          </button>
          <h2 className="text-xl font-semibold text-red-600">Error</h2>
        <div className="employee-details-card mt-6 p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section animate-fade-in">
      <div className="section-header flex items-center space-x-4">
  <button className="btn-back" onClick={onBack}>
    <FiArrowLeft size={20} className="text-gray-700" /> {/* Added explicit color */}
  </button>
  <h2 className="text-2xl font-bold text-gray-900">
    {`${employee.first_name} ${employee.last_name}`}
  </h2>
</div>
      <div className="employee-details-card mt-6 p-6 bg-white shadow-md rounded-lg border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
          <div className="detail-item">
            <label className="label">First Name</label>
            <span className="value">{employee.first_name}</span>
          </div>
          <div className="detail-item">
            <label className="label">Last Name</label>
            <span className="value">{employee.last_name}</span>
          </div>
          <div className="detail-item">
            <label className="label">Email</label>
            <span className="value">{employee.email}</span>
          </div>
          <div className="detail-item">
            <label className="label">Role</label>
            <span className="value capitalize">{employee.role_name}</span>
          </div>
          <div className="detail-item">
            <label className="label">Branch</label>
            <span className="value">{getBranchName(employee.branch_id)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;