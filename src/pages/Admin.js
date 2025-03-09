import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';
import { FiPlus, FiEdit, FiUsers, FiPieChart, FiBriefcase, FiLogOut, FiDownload, FiBell, FiImage, FiBarChart, FiFilter } from 'react-icons/fi';
import { Line, Pie } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [toast, setToast] = useState({ message: '', type: '' }); // Toast state
  const customersPerPage = 10;

  // Role ID mapping
  const roleMap = {
    'all': null,
    'admin': 1,
    'sales': 2,
    'accounts': 3,
    'rto': 4,
    'stock_person': 5
  };

  // New employee form state
  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: 1, // Default to Admin
    branch_id: 1 // Hardcoded
  });

  // Fetch customer and employee data from the API
  useEffect(() => {
    const fetchCustomers = async (month = null, year = null) => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        let url = 'https://prod.tophaventvs.com/admin/customers';
        if (month && year) {
          url = `https://prod.tophaventvs.com/admin/monthly-customers?month=${month}&year=${year}`;
        }

        const response = await fetch(url, {
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
        setCustomers(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch customers error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found. Please log in.');
        }

        let url = 'https://prod.tophaventvs.com/admin/users';
        if (selectedRoleFilter !== 'all') {
          const roleId = roleMap[selectedRoleFilter];
          url = `https://prod.tophaventvs.com/admin/branches/1/${roleId}`;
        }

        const response = await fetch(url, {
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
        setEmployees(data);
      } catch (err) {
        console.error('Fetch employees error:', err);
        setError(err.message);
      }
    };

    if (selectedDate) {
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      fetchCustomers(month, year);
    } else {
      fetchCustomers();
    }
    fetchEmployees();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, selectedRoleFilter]);

  // Handle toast dismissal
  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => setToast({ message: '', type: '' }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Dummy data for other sections
  const dummyData = {
    bookings: [
      { id: 1, customer: "John Doe", vehicle: "Honda City", status: "Booking", date: "2025-02-20", expectedDelivery: "2025-03-01", executive: "Alice", amount: 15000 },
      { id: 2, customer: "Jane Smith", vehicle: "Toyota Corolla", status: "Delivery", date: "2025-02-22", expectedDelivery: "2025-02-28", executive: "Bob", amount: 18000 },
      { id: 3, customer: "Mike Johnson", vehicle: "Hyundai Creta", status: "Completed", date: "2025-02-15", expectedDelivery: "2025-02-25", executive: "Charlie", amount: 20000 },
      { id: 4, customer: "Sarah Williams", vehicle: "Maruti Swift", status: "RTO", date: "2025-02-18", expectedDelivery: "2025-03-05", executive: "Alice", amount: 12000 },
    ],
    salesExecutives: [
      { id: 1, name: "Alice", bookings: 25, pending: 5, conversions: 20, rating: 4.8, branch: "Downtown" },
      { id: 2, name: "Bob", bookings: 18, pending: 3, conversions: 15, rating: 4.5, branch: "Uptown" },
      { id: 3, name: "Charlie", bookings: 15, pending: 2, conversions: 13, rating: 4.7, branch: "Downtown" },
    ],
    financial: {
      totalRevenue: 2500000,
      pendingPayments: 350000,
      loans: 1200000,
      taxes: 250000,
      approvalsPending: [
        { id: 1, customer: "John Doe", loan: 10000, tax: 1500, total: 15000 },
        { id: 2, customer: "Sarah Williams", loan: 8000, tax: 1200, total: 12000 },
      ]
    },
    rtoTasks: [
      { id: 1, vehicle: "Honda City", status: "Pending", customer: "John Doe", days: 5 },
      { id: 2, vehicle: "Toyota Corolla", status: "Completed", customer: "Jane Smith", days: 3 },
      { id: 3, vehicle: "Maruti Swift", status: "In Progress", customer: "Sarah Williams", days: 2 },
    ],
    feedback: [
      { id: 1, customer: "John Doe", rating: 5, comment: "Great service!", aspect: "Sales" },
      { id: 2, customer: "Jane Smith", rating: 4, comment: "Good experience", aspect: "Delivery" },
      { id: 3, customer: "Mike Johnson", rating: 5, comment: "Excellent support", aspect: "Service" },
    ],
    serviceBookings: [
      { id: 1, customer: "John Doe", status: "Pending", date: "2025-03-01", type: "Regular Maintenance" },
      { id: 2, customer: "Mike Johnson", status: "In Progress", date: "2025-02-28", type: "Repair" },
    ],
    notifications: [
      { id: 1, message: "Booking confirmed for John Doe", time: "2025-02-20 10:00" },
      { id: 2, message: "Delivery scheduled for Jane Smith", time: "2025-02-22 14:30" },
    ],
    deliveries: [
      { id: 1, vehicle: "Toyota Corolla", customer: "Jane Smith", status: "On Time", expected: "2025-02-28", actual: "2025-02-27", image: "url1" },
      { id: 2, vehicle: "Hyundai Creta", customer: "Mike Johnson", status: "Delayed", expected: "2025-02-25", actual: "2025-02-27", image: "url2" },
    ]
  };

  const [dashboardData] = useState({
    totalBookings: dummyData.bookings.length,
    pendingDeliveries: dummyData.bookings.filter(b => b.status !== "Completed").length,
    rtoPending: dummyData.rtoTasks.filter(t => t.status === "Pending").length,
    totalRevenue: dummyData.financial.totalRevenue,
    customerSatisfaction: dummyData.feedback.reduce((sum, f) => sum + f.rating, 0) / dummyData.feedback.length,
    onTimeDeliveries: dummyData.deliveries.filter(d => d.status === "On Time").length,
    serviceCompletionRate: (dummyData.serviceBookings.filter(s => s.status === "Completed").length / dummyData.serviceBookings.length) * 100 || 0
  });

  const salesChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [{
      label: 'Sales Revenue',
      data: [1200000, 1500000, 1800000, 2500000],
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 2
    }]
  };

  const vehiclePieData = {
    labels: dummyData.bookings.map(b => b.vehicle),
    datasets: [{
      data: dummyData.bookings.map(() => Math.floor(Math.random() * 10) + 1),
      backgroundColor: ['#6366f1', '#14b8a6', '#f97316', '#ef4444']
    }]
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Handle input changes in the modal
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({ ...prev, [name]: name === 'role_id' ? parseInt(value) : value }));
  };

  // Handle form submission
  const handleCreateEmployee = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await fetch('https://prod.tophaventvs.com/admin/create_user', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployee),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setShowAddEmployeeModal(false);
      setToast({ message: `Employee ${data.first_name} created and activated successfully`, type: 'success' });
      setEmployees([...employees, data]); // Add new employee to list
      setNewEmployee({ first_name: '', last_name: '', email: '', password: '', role_id: 1, branch_id: 1 }); // Reset form
    } catch (err) {
      console.error('Create employee error:', err);
      setToast({ message: `Error creating ${newEmployee.first_name} try again`, type: 'error' });
    }
  };

  const renderDashboard = () => (
    <div className="dashboard-grid">
      <div className="stats-card accent-purple"><h3>Total Bookings</h3><span>{dashboardData.totalBookings}</span></div>
      <div className="stats-card accent-teal"><h3>Pending Deliveries</h3><span>{dashboardData.pendingDeliveries}</span></div>
      <div className="stats-card accent-purple"><h3>RTO Pending</h3><span>{dashboardData.rtoPending}</span></div>
      <div className="stats-card accent-teal"><h3>Total Revenue</h3><span>${dashboardData.totalRevenue.toLocaleString()}</span></div>
      <div className="stats-card accent-purple"><h3>Customer Satisfaction</h3><span>{dashboardData.customerSatisfaction.toFixed(1)}/5</span></div>
      <div className="stats-card accent-teal"><h3>On-Time Deliveries</h3><span>{dashboardData.onTimeDeliveries}/{dummyData.deliveries.length}</span></div>
      <div className="chart-container">
        <h3>Sales Trend</h3>
        <Line data={salesChartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
      <div className="chart-container">
        <h3>Top Vehicles</h3>
        <Pie data={vehiclePieData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );

  const renderSales = () => {
    if (loading) {
      return <div className="loading">Loading customers...</div>;
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    const filteredCustomers = customers.filter(c => 
      selectedFilter === 'all' || c.status.toLowerCase() === selectedFilter.toLowerCase()
    );

    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
    const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const headerText = selectedDate
      ? `Sales ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
      : "Sales Management";

    return (
      <div className="section">
        <div className="section-header">
          <h2>{headerText}</h2>
          <div className="section-controls">
            <select onChange={(e) => setSelectedFilter(e.target.value)} className="filter-select">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
            </select>
            <button className="primary-btn" onClick={() => setShowDatePicker(!showDatePicker)}>
              <FiFilter />  Month
            </button>
            {showDatePicker && (
              <div className="datepicker-container">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => {
                    setSelectedDate(date);
                    setShowDatePicker(false);
                    setCurrentPage(1);
                  }}
                  dateFormat="MM/yyyy"
                  showMonthYearPicker
                  placeholderText="Select Month & Year"
                />
              </div>
            )}
            <button className="primary-btn"><FiDownload /> Export</button>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Vehicle</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map(customer => (
                <tr key={customer.customer_id}>
                  <td>{customer.name}</td>
                  <td>{customer.vehicle_name}</td>
                  <td>₹{customer.total_price.toLocaleString()}</td>
                  <td>{customer.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
        <div className="top-performers">
          <h3>Top Performers</h3>
          {dummyData.salesExecutives.map(exec => (
            <div key={exec.id} className="performer-card">
              <span>{exec.name} ({exec.branch})</span>
              <span>Bookings: {exec.bookings}</span>
              <span>Conv: {exec.conversions}</span>
              <span>Rating: {exec.rating}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAccounts = () => (
    <div className="section">
      <div className="section-header">
        <h2>Financial Overview</h2>
        <button className="primary-btn"><FiDownload /> Generate Report</button>
      </div>
      <div className="financial-grid">
        <div className="stats-card"><h3>Total Revenue</h3><span>${dummyData.financial.totalRevenue.toLocaleString()}</span></div>
        <div className="stats-card"><h3>Pending Payments</h3><span>${dummyData.financial.pendingPayments.toLocaleString()}</span></div>
        <div className="stats-card"><h3>Loans</h3><span>${dummyData.financial.loans.toLocaleString()}</span></div>
        <div className="stats-card"><h3>Taxes</h3><span>${dummyData.financial.taxes.toLocaleString()}</span></div>
      </div>
      <div className="table-container">
        <h3>Pending Approvals</h3>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Loan Amount</th>
              <th>Tax</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.financial.approvalsPending.map(approval => (
              <tr key={approval.id}>
                <td>{approval.customer}</td>
                <td>${approval.loan}</td>
                <td>${approval.tax}</td>
                <td>${approval.total}</td>
                <td><button className="primary-btn small">Approve</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRTO = () => (
    <div className="section">
      <div className="section-header">
        <h2>RTO Management</h2>
        <button className="primary-btn"><FiBarChart /> Performance Report</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Days Taken</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.rtoTasks.map(task => (
              <tr key={task.id}>
                <td>{task.vehicle}</td>
                <td>{task.customer}</td>
                <td>{task.status}</td>
                <td>{task.days}</td>
                <td><button className="secondary-btn small">Update</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="section">
      <div className="section-header">
        <h2>Customer Feedback</h2>
        <button className="primary-btn"><FiDownload /> Export Trends</button>
      </div>
      <div className="feedback-container">
        {dummyData.feedback.map(fb => (
          <div key={fb.id} className="feedback-card">
            <span>{fb.customer}</span>
            <span>Rating: {fb.rating}/5</span>
            <span>Aspect: {fb.aspect}</span>
            <p>{fb.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="section">
      <div className="section-header">
        <h2>Service Bookings</h2>
        <button className="primary-btn"><FiDownload /> Service Report</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Date</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.serviceBookings.map(service => (
              <tr key={service.id}>
                <td>{service.customer}</td>
                <td>{service.date}</td>
                <td>{service.type}</td>
                <td>{service.status}</td>
                <td><button className="secondary-btn small">View Job Card</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="section">
      <div className="section-header">
        <h2>Notification Logs</h2>
        <button className="primary-btn"><FiBell /> Send Manual Notification</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Message</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.notifications.map(notif => (
              <tr key={notif.id}>
                <td>{notif.message}</td>
                <td>{notif.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDeliveries = () => (
    <div className="section">
      <div className="section-header">
        <h2>Delivery Tracking</h2>
        <button className="primary-btn"><FiDownload /> Delivery Report</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Customer</th>
              <th>Expected</th>
              <th>Actual</th>
              <th>Status</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.deliveries.map(delivery => (
              <tr key={delivery.id}>
                <td>{delivery.vehicle}</td>
                <td>{delivery.customer}</td>
                <td>{delivery.expected}</td>
                <td>{delivery.actual}</td>
                <td>{delivery.status}</td>
                <td><button className="secondary-btn small"><FiImage /> View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderEmployees = () => {
    if (loading) {
      return <div className="loading">Loading employees...</div>;
    }

    if (error) {
      return <div className="error">Error: {error}</div>;
    }

    const roleOrder = ['admin', 'sales', 'accounts', 'rto', 'stock_person'];
    const groupedEmployees = roleOrder.map(role => ({
      role: role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' '),
      employees: selectedRoleFilter === 'all' 
        ? employees.filter(emp => emp.role_name?.toLowerCase() === role || emp.role_id === roleMap[role])
        : employees.filter(emp => emp.role_id === roleMap[role])
    }));

    const getBranchName = (branchId) => {
      return branchId === 1 ? 'Thiruvambady' : (branchId || 'N/A');
    };

    return (
      <div className="employees-section">
        <div className="section-header">
          <h2>Employee Management</h2>
          <div className="section-controls">
            <button className="primary-btn" onClick={() => setShowAddEmployeeModal(true)}>
              <FiPlus /> Add 
            </button>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="sales">Sales</option>
              <option value="accounts">Accounts</option>
              <option value="rto">RTO</option>
              <option value="stock_person">Stock Person</option>
            </select>
          </div>
        </div>
        {groupedEmployees.map(group => (
          group.employees.length > 0 && (
            <div key={group.role} className="role-section">
              <h3>{group.role}</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Branch</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.employees.map(emp => (
                      <tr key={emp.user_id}>
                        <td>{`${emp.first_name} ${emp.last_name}`}</td>
                        <td>{emp.role_name || Object.keys(roleMap).find(key => roleMap[key] === emp.role_id)}</td>
                        <td>{getBranchName(emp.branch_id)}</td>
                        <td>{emp.email}</td>
                        <td><button className="icon-btn"><FiEdit /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ))}
        {showAddEmployeeModal && (
          <div className="modal-overlay" onClick={() => setShowAddEmployeeModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>Add New Employee</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    name="first_name"
                    value={newEmployee.first_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    name="last_name"
                    value={newEmployee.last_name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={newEmployee.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input
                    name="password"
                    value={newEmployee.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    name="role_id"
                    value={newEmployee.role_id}
                    onChange={handleInputChange}
                  >
                    <option value={1}>Admin</option>
                    <option value={2}>Sales</option>
                    <option value={3}>Accounts</option>
                    <option value={4}>RTO</option>
                    <option value={5}>Stock Person</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Branch ID</label>
                  <input
                    type="number"
                    name="branch_id"
                    value={newEmployee.branch_id}
                    readOnly
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button className="secondary-btn" onClick={() => setShowAddEmployeeModal(false)}>Cancel</button>
                <button className="primary-btn" onClick={handleCreateEmployee}>Create</button>
              </div>
            </div>
          </div>
        )}
        {toast.message && (
          <div className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Portal</h2>
          <div className="user-profile">
            <div className="avatar">A</div>
            <div className="user-info">
              <span className="username">Admin</span>
              <span className="role">Administrator</span>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}><FiPieChart /> Dashboard</li>
            <li className={activeTab === 'sales' ? 'active' : ''} onClick={() => setActiveTab('sales')}><FiBriefcase /> Sales</li>
            <li className={activeTab === 'accounts' ? 'active' : ''} onClick={() => setActiveTab('accounts')}><FiUsers /> Accounts</li>
            <li className={activeTab === 'rto' ? 'active' : ''} onClick={() => setActiveTab('rto')}><FiBriefcase /> RTO</li>
            <li className={activeTab === 'feedback' ? 'active' : ''} onClick={() => setActiveTab('feedback')}><FiUsers /> Feedback</li>
            <li className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}><FiBriefcase /> Services</li>
            <li className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}><FiBell /> Notifications</li>
            <li className={activeTab === 'deliveries' ? 'active' : ''} onClick={() => setActiveTab('deliveries')}><FiImage /> Deliveries</li>
            <li className={activeTab === 'employees' ? 'active' : ''} onClick={() => setActiveTab('employees')}><FiUsers /> Employees</li>
          </ul>
        </nav>
        <button className="logout-btn" onClick={handleLogout}><FiLogOut /> Logout</button>
      </div>

      <div className="admin-main">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'sales' && renderSales()}
        {activeTab === 'accounts' && renderAccounts()}
        {activeTab === 'rto' && renderRTO()}
        {activeTab === 'feedback' && renderFeedback()}
        {activeTab === 'services' && renderServices()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'deliveries' && renderDeliveries()}
        {activeTab === 'employees' && renderEmployees()}
      </div>
    </div>
  );
};

export default Admin;