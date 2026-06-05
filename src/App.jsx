import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingBar from 'react-top-loading-bar';
import AttendState from './contexts/AttendContext';
import AuthState from './contexts/AuthContext';
import Navbar from './components/Navbar';
import SubjectPage from './pages/SubjectPage';
import Footer from './components/Footer';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ReviewPage from './pages/ReviewPage';
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
            {showComponent ? (
              <>
                <LoadingBar color="#f8cf38" progress={progress} height={4} />
                <Navbar />
                <ToastContainer />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/attendance" element={<SubjectPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/reviews" element={<ReviewPage />} />
                </Routes>
                <Footer />
              </>
            ) : (
              <Splash />
            )}
        </AttendState>
      </AuthState>
    </Router>
  );
};

export default App;
