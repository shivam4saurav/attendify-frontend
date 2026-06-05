import React, { useState, useContext } from 'react';
import '../index.css';
import { AuthContext } from '../contexts/AuthContext'; // Auth Context API
import { Link } from 'react-router-dom';
import validateSignin from '../utils/validateSignin';
import { authApi, setAccessToken } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { notify } from '../utils/toast';

const SignupPage = () => {
  // Auth Context API
  // const context = useContext(AuthContext);
  // const {showPass, handleShowPass, errors, handleSignChange, handleSignUp} = context;

  const {setUser, setIsAuthenticated} = useContext(AuthContext);

  const navigate = useNavigate();

  const [signCredentials, setSignCredentials] = useState({ name: '', email: '', password: '', cpassword: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState('password');

  const handleSignChange = (event) => {
    setSignCredentials({ ...signCredentials, [event.target.name]: event.target.value });
  };

  const handleShowPass = () => {
    setShowPass((prev) => (prev === 'password' ? 'text' : 'password'));
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    const validation = validateSignin(signCredentials);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      const { data } = await authApi.signup(
        signCredentials.name,
        signCredentials.email,
        signCredentials.password
      );

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
    // props.setProgress(100);
  };

  return (
    <div className='signForm'>
      <h1>Signup</h1>
      <form onSubmit={handleSignUp}>
        <div className="details">
          <label htmlFor="name" required>Name</label>
          <input type="text" name='name' onChange={handleSignChange} />
          {/* Validation */}
          {errors.name && <span className='validation'>{errors.name}</span>}
        </div>
        <div className="details">
          <label htmlFor="name">Email ID</label>
          <input type="email" name='email' onChange={handleSignChange} />
          {/* Validation */}
          {errors.email && <span className='validation'>{errors.email}</span>}
        </div>
        <div className="details">
          <label htmlFor="name">Password</label>
          <input type={showPass} name='password' onChange={handleSignChange} />
          {/* Validation */}
          {errors.password && <span className='validation'>{errors.password}</span>}
        </div>
        <div className="details">
          <label htmlFor="name">Confirm Password</label>
          <input type={showPass} name='cpassword' onChange={handleSignChange} />
          {/* Validation */}
          {errors.cpassword && <span className='validation'>{errors.cpassword}</span>}
        </div>
        <div className="showPass"><input id='showPass' type="checkbox" style={{ marginRight: '7px' }} onClick={handleShowPass} /><label htmlFor="showPass">Show Password</label></div>
        <button type='submit' id='button-anime'>Signup</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  )
}

export default SignupPage;
