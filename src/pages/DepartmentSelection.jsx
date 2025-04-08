import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
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

const DepartmentSelection = () => {
  const navigate = useNavigate();
  const { currentUser, setUserDepartment } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authenticating, setAuthenticating] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/departments/all');
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

      const response = await axios.post('http://localhost:8080/authenticate', authData);
      
      // Store the authentication token or user data
      if (response.data && response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      
      // Update the user context with department info
      setUserDepartment(selectedDepartment);
      
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
    <Container maxWidth="md">
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
        <Card sx={{ width: '100%', mb: 4 }}>
          <CardContent sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Select Your Department
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Please select your department to continue
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={3} sx={{ mb: 4 }}>
              {departments.map((department) => (
                <Grid item xs={12} sm={6} md={4} key={department.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedDepartment?.id === department.id ? '2px solid' : '1px solid',
                      borderColor: selectedDepartment?.id === department.id ? 'primary.main' : 'divider',
                      bgcolor: selectedDepartment?.id === department.id ? 'action.selected' : 'background.paper',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => handleDepartmentSelect(department)}
                  >
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {department.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              size="large"
              onClick={handleAuthenticate}
              disabled={!selectedDepartment || authenticating}
              sx={{ minWidth: 200 }}
            >
              {authenticating ? <CircularProgress size={24} /> : 'Continue'}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default DepartmentSelection; 
