import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, Heart, LogOut, LayoutDashboard, Shield, Settings as SettingsIcon } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { cartCount, wishlist } = useShop();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/collections' },
    { name: 'Business', path: '/business' },
  ];

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header-container">
        <div className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </div>

        <Link to="/" className="logo">
          RICHEEMA<span>SPICY</span>
        </Link>

        <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.path} 
                  className={location.pathname === link.path ? 'active' : ''}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button className="action-btn" aria-label="Search">
            <Search size={20} />
          </button>
          
          <Link to="/cart" className="action-btn cart-btn" aria-label="Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-profile-dropdown">
              <button 
                className="profile-trigger" 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <img src={user.avatar} alt={user.name} className="user-avatar" />
              </button>
              
              {isProfileOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <p className="user-name">{user.name}</p>
                    <p className="user-role">{user.role}</p>
                  </div>
                  <div className="dropdown-divider"></div>
                  
                  <Link to="/profile" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                    <User size={18} /> My Profile
                  </Link>
                  
                  {(user.role === 'admin' || user.role === 'owner') && (
                    <>
                      <Link to="/admin" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                        <Shield size={18} /> Admin Panel
                      </Link>
                      <Link to="/settings" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                        <SettingsIcon size={18} /> Global Settings
                      </Link>
                    </>
                  )}
                  
                  {user.role === 'owner' && (
                    <Link to="/dashboard" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                      <LayoutDashboard size={18} /> Owner Dashboard
                    </Link>
                  )}

                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="header-auth-links">
              <Link to="/login" className="login-btn-header">
                Login
              </Link>
              <Link to="/register" className="register-btn-header">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
