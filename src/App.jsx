import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import DepartmentSelection from './pages/DepartmentSelection';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';
import './App.css';
import axios from 'axios';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SnackbarProvider, useSnackbar } from 'notistack';


// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider 
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
      <GoogleOAuthProvider clientId='434373968635-vq13dntdtrnlop0tgavco86lepqc710l.apps.googleusercontent.com'>
        <Router>
          <AuthProvider>
            <ChatProvider>
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/department-selection" element={<DepartmentSelection />} />
                <Route 
                  path="/home" 
                  element={
                    <PrivateRoute>
                      <Home />
                    </PrivateRoute>
                  } 
                />
              </Routes>
   
            </ChatProvider>
          </AuthProvider>
        </Router>
      </GoogleOAuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
