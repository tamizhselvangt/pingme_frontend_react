import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Container,
  TextField,
  Alert
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';

const Welcome = () => {
  const navigate = useNavigate();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    // Mock admin login - in a real app, this would call the auth context
    if (email === 'admin@example.com' && password === 'password') {
      navigate('/home');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Welcome to PingMe
        </Typography>
        <Typography variant="h6" gutterBottom align="center" color="text.secondary">
          Choose your login type
        </Typography>

        {!showAdminLogin ? (
          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Card sx={{ width: 200, cursor: 'pointer' }} onClick={() => setShowAdminLogin(true)}>
              <CardContent sx={{ textAlign: 'center' }}>
                <AdminPanelSettingsIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6">Admin Login</Typography>
              </CardContent>
            </Card>
            <Card sx={{ width: 200, cursor: 'pointer' }} onClick={() => navigate('/login')}>
              <CardContent sx={{ textAlign: 'center' }}>
                <PersonIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6">User Login</Typography>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Card sx={{ width: '100%', mt: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center">
                Admin Login
              </Typography>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              <form onSubmit={handleAdminLogin}>
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button variant="outlined" onClick={() => setShowAdminLogin(false)}>
                    Back
                  </Button>
                  <Button variant="contained" type="submit">
                    Login
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default Welcome; 
