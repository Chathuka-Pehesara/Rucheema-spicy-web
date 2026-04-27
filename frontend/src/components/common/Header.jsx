import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, Heart } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './Header.css';

const Header = () => {
  const { cartCount, wishlist } = useShop();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          <Link to="/dashboard" className="action-btn" aria-label="Account">
            <User size={20} />
          </Link>
          <Link to="/dashboard" className="action-btn" aria-label="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && <span className="action-badge">{wishlist.length}</span>}
          </Link>
          <Link to="/cart" className="action-btn cart-btn" aria-label="Cart">
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
