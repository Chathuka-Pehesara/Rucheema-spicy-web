import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, Heart, LogOut, LayoutDashboard, Shield, Settings as SettingsIcon, Languages } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './Header.css';

const Header = () => {
  const { cartCount } = useShop();
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
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

  const changeLanguage = (lng) => {
    // 1. Update i18n for internal labels (optional, but keep for consistency)
    i18n.changeLanguage(lng);
    
    // 2. Set Google Translate Cookie for total system conversion
    // Format: /en/si or /en/ta
    document.cookie = `googtrans=/en/${lng}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/en/${lng}; path=/`; // Fallback for local
    
    // 3. Trigger Google Translate Widget
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = lng;
      select.dispatchEvent(new Event('change'));
    } else {
      // If widget not ready, we reload to apply cookie-based translation
      window.location.reload();
    }
  };

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

        <Link to="/" className="logo notranslate">
          RICHEEMA<span>SPICY</span>
        </Link>

        <nav className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.path}>
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
          <div className="lang-switcher notranslate">
            <button className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`} onClick={() => changeLanguage('en')}>EN</button>
            <button className={`lang-btn ${i18n.language === 'si' ? 'active' : ''}`} onClick={() => changeLanguage('si')}>සිං</button>
            <button className={`lang-btn ${i18n.language === 'ta' ? 'active' : ''}`} onClick={() => changeLanguage('ta')}>தம</button>
          </div>

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
                  
                  {user.role === 'admin' && (
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
