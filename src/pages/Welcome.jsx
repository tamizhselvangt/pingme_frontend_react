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
  Alert,
  Grid
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import { PiChalkboardTeacherDuotone } from "react-icons/pi";
import { PiStudentDuotone } from "react-icons/pi";
import pingmeImage from '../assets/pingme.png';

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
    <Container   maxWidth={false}
    disableGutters
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1200, // higher than most elements
      backgroundColor: '#EEEDE6',
      padding: 2,
    }}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
    <img src={pingmeImage} alt="PingMe Logo" style={{ width: '100%', maxWidth: 150 }} />
  </Grid>
  <Grid item xs={12} md={6}>
    <Typography variant="h3" component="h1" align="center" fontFamily="ClashGrotesk-Semibold"
    sx={{
      background: 'linear-gradient(90deg, #8BBCB9, #EF4955, #ff8a00)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      fontWeight: 600,
    }}
    >
      Welcome to PingMe
    </Typography>
  </Grid>
</Grid>
        <Typography variant="h5" gutterBottom align="center" color="text.secondary"
        sx={{
          fontFamily: 'ClashGrotesk-Semibold',
        
          textAlign: 'center',
          background: 'linear-gradient(135deg, #a3a3a3,rgb(205, 205, 205),#a3a3a3,rgb(206, 205, 205),#a3a3a3)',
          WebkitBackgroundClip: 'text',
        
          WebkitTextFillColor: 'transparent',
        }}
        >
          Choose your login type
        </Typography>

        {!showAdminLogin ? (
          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Card sx={{
    width: 200,
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: 6,
      backgroundColor: '#F6FAFD',
    },
  }}
   onClick={() => setShowAdminLogin(true)}>
              <CardContent sx={{ textAlign: 'center' }}>
               
                <PiChalkboardTeacherDuotone  style={{
                        fontSize: 60,
                        color: '#1976d2', // manually set to match theme
                        marginBottom: '16px'
                    }}/>
                <Typography variant="h6" fontFamily="ClashGrotesk-Medium">Admin Login</Typography>
              </CardContent>
            </Card>
            <Card  sx={{
    width: 200,
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: 6,
      backgroundColor: '#f0f4f3',
    },
  }} onClick={() => navigate('/login')}>
              <CardContent sx={{ textAlign: 'center' }}>
              
              <PiStudentDuotone style={{
                        fontSize: 60,
                        color: '#8BBCB9', // manually set to match theme
                        marginBottom: '16px'
                    }}/>
                <Typography variant="h6" fontFamily="ClashGrotesk-Medium">User Login</Typography>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Container
          maxWidth='sm'  >
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
          </Container>
        )}
      </Box>
      
    </Container>
  );
};

export default Welcome; 
