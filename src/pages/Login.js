import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login({ setToken, setUserRole }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      params.append('grant_type', '');
      params.append('username', username);
      params.append('password', password);
      params.append('scope', '');
      params.append('client_id', '');
      params.append('client_secret', '');

      const response = await axios.post('https://prod.tophaventvs.com/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200) {
        const { access_token, user } = response.data;

        // Store the token and user data (including role)
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

        // Update the app's state for token and user role
        setToken(access_token);
        setUserRole(user.role_name); // Save the role in the app state

        // Redirect based on user role
        setTimeout(() => {
          navigateToRole(user.role_name); // Navigate to the appropriate route based on the role
        }, 100);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRole = (role) => {
    switch (role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'sales':
        navigate('/sales-executive');
        break;
      case 'accounts':
        navigate('/accounts');
        break;
      case 'rto':
        navigate('/rto');
        break;
      case 'manager':
        navigate('/manager');
        break;
      case 'stock_person':
        navigate('/stock');
        break;
      default:
        setError('Unknown role.');
    }
  };

  return (
    <div style={{
      backgroundImage: 'linear-gradient(135deg, #1f1f2e, #282846)',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#eaeaea',
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        padding: '30px',
        backgroundColor: '#161b22',
        borderRadius: '8px',
        boxShadow: '0px 4px 12px rgba(0,0,0,0.5)',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>TVS Top Haven</h2>
        <p style={{ textAlign: 'center', color: '#aaa' }}>Welcome back</p>

        <form onSubmit={handleLogin} style={{ marginTop: '20px' }}>
          <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              borderRadius: '4px',
              border: '1px solid #333',
              backgroundColor: '#1f1f2e',
              color: '#eaeaea'
            }}
          />

          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '15px',
              borderRadius: '4px',
              border: '1px solid #333',
              backgroundColor: '#1f1f2e',
              color: '#eaeaea'
            }}
          />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
            <input type="checkbox" id="remember" style={{ marginRight: '8px' }} />
            <label htmlFor="remember" style={{ color: '#aaa' }}>Remember me</label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              backgroundColor: '#1db954',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#1db954a3'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#1db954'}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
