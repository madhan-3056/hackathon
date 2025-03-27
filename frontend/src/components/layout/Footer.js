import React from 'react';

const Footer = () => {
  return (
    <footer className='bg-dark text-white p-1 text-center'>
      <p>Virtual Lawyer &copy; {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer;