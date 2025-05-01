import React from 'react';
import '../styles/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <img src="/logo.png" alt="Hospital Logo" className="logo" />
      </div>

      <div className="header-center">
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Search doctors, specializations..."
            className="search-bar"
          />
        </div>
      </div>

      <div className="header-right">
        <button className="login-button">
          <i className="fas fa-user login-icon"></i>
          Login
        </button>
      </div>
    </header>
  );
};

export default Header;
