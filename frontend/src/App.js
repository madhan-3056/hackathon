import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';

const App = () => {
  useEffect(() => {
    // Redirect to App.html
    window.location.href = '/App.html';
  }, []);

  return (
    <Router>
      <div className="App">
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          textAlign: 'center',
          padding: '20px'
        }}>
          <h1>Virtual Lawyer</h1>
          <p>Loading your AI-powered legal assistant...</p>
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p style={{ marginTop: '20px' }}>
            If you are not redirected automatically, please <a href="/App.html">click here</a>.
          </p>
        </div>
      </div>
    </Router>
  );
};

export default App;