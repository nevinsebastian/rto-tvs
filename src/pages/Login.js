import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  TextField,
  Typography,
  Card,
  Link,
  Divider,
  Stack,
} from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Customize the primary color if needed
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e', // Dark background for cards and papers
    },
  },
  typography: {
    h5: {
      fontWeight: 600,
    },
  },
});

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '400px',
  margin: 'auto',
  marginTop: theme.spacing(8),
  boxShadow: '0px 3px 15px rgba(0, 0, 0, 0.1)',
  backgroundColor: theme.palette.background.paper, // Apply dark background to card
}));

const Login = () => {
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
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: darkTheme.palette.background.default,
        }}
      >
        <StyledCard>
          <Typography variant="h5" component="h1" align="center" gutterBottom>
            TVS Top Heaven
          </Typography>
          <Typography variant="subtitle1" align="center" gutterBottom>
            Welcome back
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              fullWidth
              label="Email"
              margin="normal"
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              InputProps={{
                sx: { color: '#fff' }, // Make text in input white
              }}
            />
            <TextField
              fullWidth
              label="Password"
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                sx: { color: '#fff' }, // Make text in input white
              }}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 2 }}
            >
              Login
            </Button>
          </Box>
          {error && <Typography color="error" variant="body2" align="center">{error}</Typography>}
          <Divider sx={{ my: 2, borderColor: '#666' }}>or</Divider>
          <Stack spacing={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Google')}
            >
              Sign in with Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Facebook')}
            >
              Sign in with Facebook
            </Button>
          </Stack>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account? <Link href="/signup" sx={{ color: '#90caf9' }}>Sign up</Link>
          </Typography>
        </StyledCard>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
