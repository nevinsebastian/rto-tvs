import React, { useState } from 'react';
import axios from 'axios';

const Admin = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('accounts'); // default role
    const [branchId, setBranchId] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://127.0.0.1:8000/create_user', {
                username: username,
                email: email,
                password: password,
                role: role,
                branch_id: branchId
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            setSuccess(`User ${response.data.username} created successfully!`);
        } catch (err) {
            setError('Failed to create user');
        }
    };

    return (
        <div>
            <h2>Create New Employee</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="admin">Admin</option>
                    <option value="sales_executive">Sales Executive</option>
                    <option value="accounts">Accounts</option>
                    <option value="rto">RTO</option>
                </select>
                <input
                    type="number"
                    value={branchId}
                    onChange={(e) => setBranchId(e.target.value)}
                    placeholder="Branch ID"
                />
                <button type="submit">Create Employee</button>
                {success && <p>{success}</p>}
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default Admin;
