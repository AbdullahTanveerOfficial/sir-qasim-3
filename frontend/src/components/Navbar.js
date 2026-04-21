import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-brand">
        <Link to="/dashboard" className="brand-link">
          <span className="brand-icon">✦</span>
          <span className="brand-name">TaskFlow</span>
        </Link>
      </div>

      <div className="navbar-links">
        <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`} id="nav-dashboard">
          Dashboard
        </Link>
        <Link to="/projects" className={`nav-link ${isActive('/projects') ? 'active' : ''}`} id="nav-projects">
          Projects
        </Link>
      </div>

      <div className="navbar-user">
        <div className="user-menu" onClick={() => setMenuOpen(!menuOpen)}>
          <div className="user-avatar" id="user-avatar-btn">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className="user-name">{user?.name}</span>
          <span className="dropdown-arrow">▾</span>
        </div>
        {menuOpen && (
          <div className="dropdown-menu" id="user-dropdown">
            <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)} id="nav-profile">
              👤 Profile
            </Link>
            <button className="dropdown-item danger" onClick={handleLogout} id="logout-btn">
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
