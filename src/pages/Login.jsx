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
import { PiStudentDuotone } from "react-icons/pi";

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
  };

  return (
    <Container
    maxWidth={false}
    disableGutters
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1200, // higher than most elements
      backgroundColor: '#F8F9FB',
      padding: 2,
    }}
    >
      <Container
    maxWidth='sm'  >
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
          <PiStudentDuotone style={{
                        fontSize: 60,
                        color: '#8BBCB9', // manually set to match theme
                        marginBottom: '16px'
                    }}/>
            <Typography variant="h4" component="h1" gutterBottom>
              User Login
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Choose your login method
            </Typography>
            
            <Button
              variant="outlined"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
              sx={{
                mb: 2,
                fontFamily: 'ClashGrotesk-Medium', // your custom font
                fontSize: '1rem', // optional
                fontWeight: 500,  // optional
                borderColor: 'primary.main', // base border color
                '&:hover': {
                  borderColor: 'secondary.main', 
                  backgroundColor: 'secondary.light',
                  color: 'secondary.main',
                },
              }}
            >
              Continue with Google
            </Button>
            
            <Divider sx={{ my: 2 ,  
              fontFamily: 'ClashGrotesk-Medium',
            }}>OR</Divider>
            
            <Button
              variant="outlined"
              size="large"
              fontFamily='ClashGrotesk-Medium'
              startIcon={<GitHubIcon />}
              onClick={handleGithubLogin}
              sx={{
                mb: 2,
                fontFamily: 'ClashGrotesk-Medium', // your custom font
                fontSize: '1rem', // optional
                fontWeight: 500,  // optional
                borderColor: 'primary.main', // base border color
                '&:hover': {
                  borderColor: 'secondary.main', 
                  backgroundColor: 'secondary.light',
                  color: 'secondary.main',
                },
              }}
            >
              Continue with GitHub
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
    </Container>
  );
};

export default Login; 
