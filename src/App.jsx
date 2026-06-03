import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingBar from 'react-top-loading-bar';
import AttendState from './contexts/AttendContext';
import AuthState from './contexts/AuthContext';
import ReviewState from './contexts/ReviewContext';
import Navbar from './components/Navbar';
import Subjects from './components/Subjects';
import Footer from './components/Footer';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Reviews from './components/Reviews';
import Splash from './components/Splash';

const App = () => {
  const [progress, setProgress] = useState(0);
  const [showComponent, setShowComponent] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowComponent(true);
    }, 4000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Router>
      <AuthState setProgress={setProgress}>
        <AttendState setProgress={setProgress}>
          <ReviewState setProgress={setProgress}>
            {showComponent ? (
              <>
                <LoadingBar color="#f8cf38" progress={progress} height={4} />
                <Navbar />
                <ToastContainer />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/attendance" element={<Subjects />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/reviews" element={<Reviews />} />
                </Routes>
                <Footer />
              </>
            ) : (
              <Splash />
            )}
          </ReviewState>
        </AttendState>
      </AuthState>
    </Router>
  );
};

export default App;
