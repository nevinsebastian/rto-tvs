import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';  // Import the CSS

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();  // Prevent form reload on submit

    try {
      const response = await axios.post('https://13.127.21.70:8000/login', {
        grant_type: '',
        username,
        password,
        scope: '',
        client_id: '',
        client_secret: ''
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.status === 200) {
        const { access_token, user } = response.data;
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect based on role
        switch (user.role_name) {
          case 'Admin':
            navigate('/admin');
            break;
          case 'Sales':
            navigate('/sales-executive');
            break;
          case 'Accounts':
            navigate('/accounts');
            break;
          case 'RTO':
            navigate('/rto');
            break;
          case 'Manager':
            navigate('/manager');
            break;
          case 'stock_person':
            navigate('/stock');
            break;
          default:
            setError('Unknown role.');
        }
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="main-container">
      {/* Form Section */}
      <div className="form-section">
        <h1 className="login-title">TVS Top Heaven</h1>
        <p className="login-subtitle">Welcome back</p>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-container">
            <label>Email</label>
            <input
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="input-container">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Image Section */}
      <div className="image-section">
        <img src="/login.svg" alt="Illustration" />
      </div>
    </div>
  );
};

export default Login;
