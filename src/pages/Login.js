import React, { useState } from 'react';
import jwt_decode from 'jwt-decode'; // Correct import
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to decode token and get user role
  const getUserRoleFromToken = (token) => {
    try {
      const decodedToken = jwt_decode(token); // Correct usage of jwt_decode
      return decodedToken.role; // Extract the 'role' field from the token payload
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const loginData = await response.json();

      // Extract role from the token
      const role = getUserRoleFromToken(loginData.access_token);

      console.log('User role:', role);

      // Redirect or handle role-based logic
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'sales') {
        navigate('/sales-dashboard');
      } else if (role === 'accounts') {
        navigate('/accounts-dashboard');
      } else {
        throw new Error('Unknown role');
      }
    } catch (error) {
      setError('Login failed: ' + error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
