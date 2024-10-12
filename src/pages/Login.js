import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  Checkbox,
  FormControlLabel,
  Link,
  Container,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';

// Create the dark theme with the bluish gradient
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: 'linear-gradient(135deg, #1f1f2e, #282846)', // Dark bluish gradient background
    },
    primary: {
      main: '#1db954', // Green button color
    },
    text: {
      primary: '#eaeaea',
      secondary: '#aaa',
    },
  },
});

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://13.127.21.70:8000/login', {
        grant_type: '',
        username,
        password,
        scope: '',
        client_id: '',
        client_secret: '',
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200) {
        const { access_token, user } = response.data;
        localStorage.setItem('token', access_token);
        localStorage.setItem('user', JSON.stringify(user));

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
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: 'transparent',
          backgroundImage: 'linear-gradient(135deg, #1f1f2e, #282846)', // Dark bluish gradient
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={6}
            sx={{
              padding: 4,
              borderRadius: 4,
              backgroundColor: '#161b22',
              boxShadow: '0px 4px 12px rgba(0,0,0,0.5)',
              transition: 'background-color 0.3s ease-in-out',
            }}
          >
            <Typography variant="h5" align="center">
              TVS Top Haven
            </Typography>
            <Typography variant="body1" align="center" sx={{ mt: 1 }}>
              Welcome back
            </Typography>

            <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 3 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Email"
                name="username"
                autoComplete="email"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: '#1f2933',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#aaa',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#555',
                    },
                    '&:hover fieldset': {
                      borderColor: '#888',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1db954',
                    },
                  },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: '#1f2933',
                  },
                  '& .MuiInputLabel-root': {
                    color: '#aaa',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#555',
                    },
                    '&:hover fieldset': {
                      borderColor: '#888',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1db954',
                    },
                  },
                }}
              />
              {error && <Typography color="error">{error}</Typography>}
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
                sx={{ color: '#aaa' }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  backgroundColor: '#1db954',
                  '&:hover': {
                    backgroundColor: '#1db954a3',
                  },
                }}
              >
                Login
              </Button>
             
            </Box>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
