import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiEdit } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import '../styles/EmployeeDetails.css'

const EmployeeDetails = ({ userId, onBack }) => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: '',
  });
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);


  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found. Please log in.');

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
        setFormData({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          password: '',
          role_id: getRoleIdFromName(data.role_name),
        });
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

  const getRoleIdFromName = (roleName) => {
    const roleMap = {
      admin: 1,
      sales: 2,
      accounts: 3,
      rto: 4,
      stockperson: 5,
    };
    return roleMap[roleName.toLowerCase()] || '';
  };

  const roleOptions = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Sales' },
    { id: 3, name: 'Accounts' },
    { id: 4, name: 'RTO' },
    { id: 5, name: 'Stockperson' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found.');

      const response = await fetch(`https://prod.tophaventvs.com/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          branch_id: 1, // Fixed branch_id
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
      }

      const updatedData = await response.json();
      setEmployee(updatedData);
      setIsModalOpen(false);
      toast.success('Employee details updated successfully!', {
        style: { background: '#10B981', color: '#fff' },
      });
    } catch (err) {
      console.error('Update employee error:', err);
      toast.error('Something went wrong. Please try again.', {
        style: { background: '#EF4444', color: '#fff' },
      });
    }
  };


  const handleDeactivateEmployee = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found.');
  
      const response = await fetch(`https://prod.tophaventvs.com/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
      }
  
      setIsDeactivateModalOpen(false);
      toast.success('Employee deactivated successfully!', {
        style: { background: '#10B981', color: '#fff' },
      });
      onBack(); // Navigate back after deactivation
    } catch (err) {
      console.error('Deactivate employee error:', err);
      toast.error('Failed to deactivate employee. Try again.', {
        style: { background: '#EF4444', color: '#fff' },
      });
    }
  };



  const closeModal = () => setIsModalOpen(false);

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8">
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
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button onClick={onBack} className="back-button flex items-center space-x-2">
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
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
  <div className="flex items-center space-x-4">
    <button onClick={onBack} className="back-button flex items-center space-x-2">
      <FiArrowLeft size={24} />
    </button>
    <h2 className="text-3xl font-bold text-gray-800">
      {`${employee.first_name} ${employee.last_name}`}
    </h2>
  </div>
  <div className="flex space-x-4">
    <button
      onClick={() => setIsModalOpen(true)}
      className="edit-button flex items-center space-x-2"
    >
      <FiEdit size={20} />
      <span>Edit</span>
    </button>
    <button
      onClick={() => setIsDeactivateModalOpen(true)}
      className="deactivate-button flex items-center space-x-2"
    >
      <span>Deactivate</span>
    </button>
  </div>
</div>

      <div className="p-6 rounded-xl border employee-card mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div className="detail-item" whileHover={{ scale: 1.02 }}>
            <label className="label">First Name</label>
            <span className="value">{employee.first_name}</span>
          </motion.div>
          <motion.div className="detail-item" whileHover={{ scale: 1.02 }}>
            <label className="label">Last Name</label>
            <span className="value">{employee.last_name}</span>
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

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Edit Employee</h3>
            <form onSubmit={handleUpdateEmployee} className="space-y-4">
              <div>
                <label className="modal-label">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="modal-input"
                  required
                />
              </div>
              <div>
                <label className="modal-label">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="modal-input"
                  required
                />
              </div>
              <div>
                <label className="modal-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="modal-input"
                  required
                />
              </div>
              <div>
                <label className="modal-label">Password (leave blank to keep unchanged)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="modal-input"
                />
              </div>
              <div>
                <label className="modal-label">Role</label>
                <select
                  name="role_id"
                  value={formData.role_id}
                  onChange={handleInputChange}
                  className="modal-input"
                  required
                >
                  <option value="">Select Role</option>
                  {roleOptions.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={closeModal} className="modal-cancel-button">
                  Cancel
                </button>
                <button type="submit" className="modal-save-button">
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

{isDeactivateModalOpen && (
  <div className="modal-overlay" onClick={() => setIsDeactivateModalOpen(false)}>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="modal-content"
      onClick={(e) => e.stopPropagation()}
    >
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        Are you sure?
      </h3>
      <p className="text-gray-600 mb-6">
        Do you really want to deactivate this employee? This action cannot be undone.
      </p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setIsDeactivateModalOpen(false)}
          className="modal-cancel-button"
        >
          No
        </button>
        <button
          onClick={handleDeactivateEmployee}
          className="modal-deactivate-button"
        >
          Yes
        </button>
      </div>
    </motion.div>
  </div>
)}
    </motion.div>
  );
};

export default EmployeeDetails;