import { createContext, useState, useContext, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userDepartment, setUserDepartment] = useState(null);
  const navigate = useNavigate();
  // Initiates Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setUserToken(tokenResponse);
      setLoading(true);
    },
    onError: (error) => {
      console.error('Google Login Failed:', error);
      setLoading(false);
    }
  });

  // Fetch user info once access token is set
  useEffect(() => {
    const fetchGoogleUserInfo = async () => {
      if (userToken?.access_token) {
        try {
          const res = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            {
              headers: {
                Authorization: `Bearer ${userToken.access_token}`,
                Accept: 'application/json'
              }
            }
          );
          const userData = res.data;
          setCurrentUser({
            id: userData.sub,
            name: userData.name,
            email: userData.email,
            photoURL: userData.picture,
          });

          // decide user type
          setUserType('user'); // Or set based on email domain/role
          navigate('/department-selection');

        } catch (err) {
          console.error('Error fetching Google user info:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchGoogleUserInfo();
  }, [userToken]);

  // For triggering Google login
  const loginWithGoogle = () => {
    googleLogin();
  };

  // GitHub login mock
  const loginWithGithub = () => {
    setCurrentUser({
      id: '3',
      name: 'Jane Smith',
      email: 'janesmith@email.com',
      photoURL: 'https://i.pinimg.com/736x/df/bb/30/dfbb302fad975b17e5542db8c12b604e.jpg',
    });
    setUserType('user');
    navigate('/department-selection');
  };

  const adminLogin = (email, password) => {
    // Mock admin login
    if (email === 'admin@example.com' && password === 'password') {
      setCurrentUser({
        id: 'admin',
        name: 'Admin User',
        email: 'admin@example.com',
        photoURL: 'https://via.placeholder.com/150',
      });
      setUserType('admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    signOut();
  };

  const signOut = async () => {
    if(currentUser){
    try {
      const authData = {
        name: currentUser.name,
        email: currentUser.email,
        profileImage: currentUser.photoURL
      };
      const response = await axios.post(`${url}/sign-out`, authData);
      console.log('Logout Success Response: ',response);
      setCurrentUser(null);
    setUserType(null);
    setMessages([]); // clear chat messages   
    setUserDepartment(null);
    localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
  };

  useEffect(() => {
    // Check if user is logged in (e.g., from localStorage)
    const storedUser = localStorage.getItem('user');
    const storedDepartment = localStorage.getItem('userDepartment');
    const authToken = localStorage.getItem('authToken');
    
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setUserType(localStorage.getItem('userType'));
    }
    
    if (storedDepartment) {
      setUserDepartment(JSON.parse(storedDepartment));
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
      localStorage.setItem('userType', userType);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
    }
  }, [currentUser, userType]);

  useEffect(() => {
    if (userDepartment) {
      localStorage.setItem('userDepartment', JSON.stringify(userDepartment));
    } else {
      localStorage.removeItem('userDepartment');
    }
  }, [userDepartment]);

  const value = {
    currentUser,
    userType,
    setCurrentUser,
    userDepartment,
    setUserDepartment,
    loginWithGoogle,
    loginWithGithub,
    adminLogin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 
