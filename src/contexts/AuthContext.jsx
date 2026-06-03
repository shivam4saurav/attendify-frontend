import React, { createContext, useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, setAccessToken, clearAccessToken } from '../services/api';
import { notify } from '../utils/toast';

export const AuthContext = createContext();

const AuthState = (props) => {
  const [signCredentials, setSignCredentials] = useState({ name: '', email: '', password: '', cpassword: '' });
  const [logCredentials, setLogCredentials] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  const [showPass, setShowPass] = useState('password');

  const navigate = useNavigate();

  // Try to restore session on mount via refresh token
  const restoreSession = useCallback(async () => {
    try {
      const token = await authApi.refresh();
      if (token) {
        const { data } = await authApi.getMe();
        if (data.success) {
          setUser(data.data.user);
          setIsAuthenticated(true);
        }
      }
    } catch {
      // No valid session
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const handleSignChange = (event) => {
    setSignCredentials({ ...signCredentials, [event.target.name]: event.target.value });
  };

  const handleShowPass = () => {
    setShowPass((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  const validateAuth = () => {
    const newErrors = {};

    if (!signCredentials.name) {
      newErrors.name = 'Name is required';
    }

    if (!signCredentials.email) {
      newErrors.email = 'Email is required';
    }

    if (!signCredentials.password) {
      newErrors.password = 'Password is required';
    } else if (signCredentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (signCredentials.password !== signCredentials.cpassword) {
      newErrors.cpassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    if (!validateAuth()) return;

    props.setProgress(30);
    try {
      const { data } = await authApi.signup(
        signCredentials.name,
        signCredentials.email,
        signCredentials.password
      );
      props.setProgress(70);

      if (data.success) {
        setAccessToken(data.data.accessToken);
        setUser(data.data.user);
        setIsAuthenticated(true);
        navigate('/attendance');
        notify.success('Account created');
      } else {
        notify.error(data.message || 'Signup failed');
      }
    } catch (err) {
      notify.error(err.response?.data?.message || 'Network error');
    }
    props.setProgress(100);
  };

  const handleLogChange = (event) => {
    setLogCredentials({ ...logCredentials, [event.target.name]: event.target.value });
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    props.setProgress(30);

    try {
      const { data } = await authApi.login(logCredentials.email, logCredentials.password);
      props.setProgress(70);

      if (data.success) {
        setAccessToken(data.data.accessToken);
        setUser(data.data.user);
        setIsAuthenticated(true);
        navigate('/attendance');
        notify.success('Logged in');
      } else {
        notify.error(data.message || 'Invalid credentials');
      }
    } catch (err) {
      notify.error(err.response?.data?.message || 'Network error');
    }
    props.setProgress(100);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Logout even if API fails
    }
    clearAccessToken();
    setUser(null);
    setIsAuthenticated(false);
    navigate('/');
    notify.info('Logged out');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authLoading,
        errors,
        showPass,
        handleShowPass,
        handleSignChange,
        handleSignUp,
        handleLogChange,
        handleLogin,
        handleLogout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
