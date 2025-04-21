import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Container,
  Grid
} from '@mui/material';
import { PiChalkboardTeacherDuotone } from "react-icons/pi";
import { PiStudentDuotone } from "react-icons/pi";
import pingmeImage from '../assets/pingme.png';

const Welcome = () => {
  const navigate = useNavigate();

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
            <Grid  size={{ xs: 5, sm: 4, md: 3, lg: 3 }}>
    <img src={pingmeImage} alt="PingMe Logo" style={{ width: '100%', maxWidth: 150 }} />
  </Grid>
  <Grid  size={{ xs: 12, sm: 12, md: 6 , lg: 12 }}>
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
          onClick={() => navigate('/admin/login')}>
            <CardContent sx={{ textAlign: 'center' }}>
              <PiChalkboardTeacherDuotone style={{
                fontSize: 60,
                color: '#1976d2',
                marginBottom: '16px'
              }}/>
              <Typography variant="h6" fontFamily="ClashGrotesk-Medium">Admin Login</Typography>
            </CardContent>
          </Card>
          <Card sx={{
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
                color: '#8BBCB9',
                marginBottom: '16px'
              }}/>
              <Typography variant="h6" fontFamily="ClashGrotesk-Medium">User Login</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
      
    </Container>
  );
};

export default Welcome; 
