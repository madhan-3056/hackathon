import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='container'>
      <div className='text-center my-3'>
        <h1 className='x-large'>Virtual Lawyer</h1>
        <p className='lead'>
          AI-powered legal assistant for document analysis and compliance
        </p>
        <div className='buttons my-2'>
          <Link to='/register' className='btn btn-primary'>
            Sign Up
          </Link>
          <Link to='/login' className='btn btn-light'>
            Login
          </Link>
        </div>
      </div>

      <div className='grid-3 my-3'>
        <div className='card bg-light'>
          <h3 className='text-primary text-center'>Document Analysis</h3>
          <p>
            Upload legal documents and get AI-powered analysis to identify risks and
            opportunities.
          </p>
        </div>
        <div className='card bg-light'>
          <h3 className='text-primary text-center'>Compliance Checking</h3>
          <p>
            Ensure your documents comply with relevant laws and regulations across
            different jurisdictions.
          </p>
        </div>
        <div className='card bg-light'>
          <h3 className='text-primary text-center'>Legal Chat Assistant</h3>
          <p>
            Get answers to your legal questions through our AI-powered chat
            assistant.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;