import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Navbar = ({ title, icon }) => {
    // Placeholder for authentication context
    const isAuthenticated = localStorage.getItem('token') ? true : false;
    const user = { name: 'User' }; // Placeholder

    const onLogout = () => {
        // Placeholder for logout functionality
        localStorage.removeItem('token');
        window.location.href = '/login';
    };

    const authLinks = (
        <>
            <li>Hello {user && user.name}</li>
            <li>
                <Link to='/dashboard'>Dashboard</Link>
            </li>
            <li>
                <Link to='/documents'>Documents</Link>
            </li>
            <li>
                <Link to='/chat'>Chat</Link>
            </li>
            <li>
                <a onClick={onLogout} href='#!'>
                    <i className='fas fa-sign-out-alt'></i> <span className='hide-sm'>Logout</span>
                </a>
            </li>
        </>
    );

    const guestLinks = (
        <>
            <li>
                <Link to='/register'>Register</Link>
            </li>
            <li>
                <Link to='/login'>Login</Link>
            </li>
        </>
    );

    return (
        <div className='navbar bg-primary'>
            <h1>
                <Link to='/'>
                    <i className={icon}></i> {title}
                </Link>
            </h1>
            <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
        </div>
    );
};

Navbar.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string
};

Navbar.defaultProps = {
    title: 'Virtual Lawyer',
    icon: 'fas fa-balance-scale'
};

export default Navbar;