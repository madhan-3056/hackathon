import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Documents from './components/documents/Documents';
import Chat from './components/chat/Chat';
import NotFound from './components/pages/NotFound';

// Context
import AuthState from './context/auth/AuthState';
import AlertState from './context/alert/AlertState';
import DocumentState from './context/document/DocumentState';
import ChatState from './context/chat/ChatState';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // Protected route component
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthState>
      <AlertState>
        <DocumentState>
          <ChatState>
            <Router>
              <div className="App">
                <Navbar />
                <div className="container">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/dashboard"
                      element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/documents"
                      element={
                        <PrivateRoute>
                          <Documents />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/chat"
                      element={
                        <PrivateRoute>
                          <Chat />
                        </PrivateRoute>
                      }
                    />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            </Router>
          </ChatState>
        </DocumentState>
      </AlertState>
    </AuthState>
  );
};

export default App;