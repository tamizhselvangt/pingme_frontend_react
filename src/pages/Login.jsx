import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Container,
  Divider
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Login = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, loginWithGithub } = useAuth();

  const handleGoogleLogin = () => {
    loginWithGoogle();
    // After Google login, user will be redirected to department selection
    // The redirection will be handled in the AuthContext useEffect
  };

  const handleGithubLogin = () => {
    loginWithGithub();
    navigate('/department-selection');
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
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
          sx={{ position: 'absolute', top: 20, left: 20 }}
        >
          Back
        </Button>
        
        <Card sx={{ width: '100%' }}>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              User Login
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Choose your login method
            </Typography>
            
            <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{ mb: 2 }}
            >
              Continue with Google
            </Button>
            
            <Divider sx={{ my: 2 }}>OR</Divider>
            
            <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<GitHubIcon />}
              onClick={handleGithubLogin}
            >
              Continue with GitHub
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login; 
