import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://127.0.0.1:8000/login', {
                username: username,
                password: password,
                grant_type: '',
                scope: '',
                client_id: '',
                client_secret: ''
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const { access_token } = response.data;
            // Store the token in local storage or context
            localStorage.setItem('token', access_token);

            // Fetch user role using the token (you can adjust this according to your backend)
            const userResponse = await axios.get('http://127.0.0.1:8000/user', {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });

            const userRole = userResponse.data.role;

            // Navigate based on role
            switch (userRole) {
                case 'admin':
                    navigate('/admin');
                    break;
                case 'sales_executive':
                    navigate('/sales-dashboard');
                    break;
                case 'accounts':
                    navigate('/accounts-dashboard');
                    break;
                case 'rto':
                    navigate('/rto-dashboard');
                    break;
                default:
                    setError('Invalid role');
            }
        } catch (err) {
            setError('Login failed');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                <button type="submit">Login</button>
                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default Login;
