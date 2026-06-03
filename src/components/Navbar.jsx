import React, { useContext, useRef } from 'react';
import '../index.css';
import { AuthContext } from '../contexts/AuthContext';
import Popup from 'reactjs-popup';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, isAuthenticated, handleLogout } = useContext(AuthContext);

  const closeRef = useRef(null);

  let state = 0;
  const handleResNav = () => {
    const navbar = document.getElementById('res-navbar');
    if (state === 0) {
      navbar.style.display = 'block';
      state = 1;
    } else {
      navbar.style.display = 'none';
      state = 0;
    }
  };

  const handleCloseRef = () => {
    closeRef.current.click();
  };

  return (
    <nav>
      <div className="logo">
        <Link to="/">&lt; AtCOM &gt;</Link>
      </div>
      <div className="nav-items" id="res-navbar">
        <ul>
          <li>
            <Link onClick={handleCloseRef} to="/">Home</Link>
          </li>
          <li>
            <Link onClick={handleCloseRef} to="/attendance">Attendance</Link>
          </li>
          {!isAuthenticated && (
            <li>
              <Link onClick={handleCloseRef} to="/signup">Signup</Link>
            </li>
          )}
          <li>
            <Link onClick={handleCloseRef} to="/reviews">Reviews</Link>
          </li>
        </ul>
      </div>
      <div className="buttons">
        {isAuthenticated && (
          <div>
            <Popup
              trigger={
                <button className="account">
                  <i className="fa-solid fa-user"></i>
                </button>
              }
            >
              {() => (
                <div className="accountDetails">
                  <p>Account</p>
                  <strong className="userName">{user?.name}</strong>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </Popup>
          </div>
        )}
        <div className="res-nav">
          <button onClick={handleResNav} ref={closeRef}>
            <i className="fa-solid fa-bars-staggered"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
