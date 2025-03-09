import React, { useState, useEffect } from 'react';
import { FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import '../styles/EmployeeDetails.css';

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
    return branchId === 1 ? 'Thiruvambady' : branchId || 'N/A';
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="flex items-center space-x-4 mb-6">
          <div className="skeleton h-10 w-10 rounded-full"></div>
          <div className="skeleton h-8 w-56 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array(5).fill().map((_, index) => (
            <div key={index} className="skeleton-card">
              <div className="skeleton h-4 w-24 mb-3 rounded"></div>
              <div className="skeleton h-12 w-full rounded-lg"></div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="back-button flex items-center space-x-2"
          >
            <FiArrowLeft size={24} />
          </button>
        </div>
        <div className="bg-red-50 p-6 rounded-xl shadow-sm border border-red-100">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-red-500">{error}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Back Button & Employee Name in One Line */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="back-button flex items-center space-x-2"
        >
          <FiArrowLeft size={24} />
        </button>
        <h2 className="text-3xl font-bold text-gray-800">
          {`${employee.first_name} ${employee.last_name}`}
        </h2>
      </div>

      {/* Employee Details Box */}
      <div className="p-6 rounded-xl border employee-card mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div className="detail-item" whileHover={{ scale: 1.02 }}>
            <label className="label">First Name</label>
            <span className="value">{`${employee.first_name} ${employee.last_name}`}</span>
          </motion.div>

          <motion.div className="detail-item" whileHover={{ scale: 1.02 }}>
            <label className="label">Email</label>
            <span className="value">{employee.email}</span>
          </motion.div>

          <motion.div className="detail-item" whileHover={{ scale: 1.02 }}>
            <label className="label">Role</label>
            <span className="value capitalize">{employee.role_name}</span>
          </motion.div>

          <motion.div className="detail-item" whileHover={{ scale: 1.02 }}>
            <label className="label">Branch</label>
            <span className="value">{getBranchName(employee.branch_id)}</span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployeeDetails;
