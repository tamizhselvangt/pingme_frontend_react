import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';

const url = "http://localhost:8080";
const DepartmentSelection = () => {
  const navigate = useNavigate();
  const { currentUser, setUserDepartment, setCurrentUser } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authenticating, setAuthenticating] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${url}/api/departments/all`);
        setDepartments(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching departments:', err);
        setError('Failed to load departments. Please try again.');
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
  };

  const handleAuthenticate = async () => {
    if (!selectedDepartment) {
      setError('Please select a department');
      return;
    }

    setAuthenticating(true);
    setError(null);

    try {
      const authData = {
        name: currentUser.name,
        email: currentUser.email,
        profileImage: currentUser.photoURL,
        departmentId: selectedDepartment.id
      };

        const response = await axios.post(`${url}/authenticate`, authData);
      // Store the authentication token or user data
      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      const responseData = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        profileImage: response.data.profileImage,
        departmentId: response.data.departmentId
      };
      // Update the user context with department info
      setCurrentUser(responseData);
      
      // Navigate to home page
      navigate('/home');
    } catch (err) {
      console.error('Authentication error:', err);
      setError('Authentication failed. Please try again.');
      setAuthenticating(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

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
      backgroundColor: '#B6CAD4',
      padding: 2,
    }}
    >
          <Container
    maxWidth='md'
    sx={{
      padding: 2,
    }}
    >
         <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
          sx={{ position: 'absolute', top: 20, left: 20 }}
        >
          Back
        </Button>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4
        }}
      >
      
        <Card sx={{ width: '100%', mb: 4 , 
             borderRadius: '20px',
             backgroundColor: '#F2F7F9',
        }}>

          
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom
            sx={{
              fontFamily: 'ClashGrotesk-Medium',
              fontSize: '2 rem',
              color: '#6F8CFF',
            }}
            >
              Select Your Department
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
              Please select your department to continue
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
<Box
  sx={{
    maxHeight: '60vh', // adjust as needed
    overflowY: 'auto',
    px: 2,
    py: 1,
  
  }}
>
  <Grid
    container
    spacing={3}
    justifyContent="center" // ✅ centers the grid content
    sx={{ mb: 4 }}
  >
    {departments.map((department) => (
      <Grid  size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={department.id}>
        <Card
          sx={{
            height: '100%',
            width: '100%',
            minWidth: '100px',
            cursor: 'pointer',
            borderRadius: '8px',
            border: selectedDepartment?.id === department.id ? '2px solid' : '1px solid',
            borderColor: selectedDepartment?.id === department.id ? 'primary.main' : 'divider',
            bgcolor: selectedDepartment?.id === department.id ? 'action.selected' : 'background.paper',
            '&:hover': {
              bgcolor: '#D0DEFD',
              borderColor: '#6F8CFF',
            },
          }}
          onClick={() => handleDepartmentSelect(department)}
        >
          <CardContent>
            <Typography  align="center" 
            sx={{
              fontFamily: 'ClashGrotesk-Medium',
              fontSize: '18px',
              color: '#6C707D',
            }}
            >
           {department.name}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Box>

            <Button
              variant="contained"
              size="large"
              onClick={handleAuthenticate}
              disabled={!selectedDepartment || authenticating}
              sx={{
                 minWidth: 200,
                 fontFamily: 'ClashGrotesk-SemiBold',
                 fontSize: '15px',
               }}
            >
              {authenticating ? <CircularProgress size={24} /> : 'Continue'}
            </Button>
          </CardContent>
        </Card>
      </Box>
      </Container>
    </Container>
  );
};

export default DepartmentSelection; 
