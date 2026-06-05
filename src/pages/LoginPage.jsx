import React, { useState, useContext } from 'react';
import '../index.css';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import validateLogin from '../utils/validateLogin';
import { authApi, setAccessToken } from '../services/api';
import { notify } from '../utils/toast';

const LoginPage = () => {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [logCredentials, setLogCredentials] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState('password');

  const handleLogChange = (event) => {
    setLogCredentials({ ...logCredentials, [event.target.name]: event.target.value });
  };

  const handleShowPass = () => {
    setShowPass((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const validation = validateLogin(logCredentials);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      const { data } = await authApi.login(logCredentials.email, logCredentials.password);

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
  };

  return (
    <div className='signForm'>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div className="details">
          <label htmlFor="email">Email ID</label>
          <input type="email" name='email' onChange={handleLogChange} />
          {errors.email && <span className='validation'>{errors.email}</span>}
        </div>
        <div className="details">
          <label htmlFor="password">Password</label>
          <input type={showPass} name='password' onChange={handleLogChange} />
          {errors.password && <span className='validation'>{errors.password}</span>}
        </div>
        <div className="showPass">
          <input onClick={handleShowPass} id='showPass' type="checkbox" />
          <label htmlFor="showPass">Show Password</label>
        </div>
        <button type='submit' id='button-anime'>Login</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Signup</Link></p>
    </div>
  );
};

export default LoginPage;
