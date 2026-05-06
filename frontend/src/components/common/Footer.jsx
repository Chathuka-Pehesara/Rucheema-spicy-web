import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Send, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="logo">
            RICHEEMA<span>SPICY</span>
          </Link>
          <p className="footer-desc">
            Bringing you the finest, most authentic spices from the heart of the spice routes. 
            Quality and tradition in every grain.
          </p>
          <div className="social-links">
            <a href="#"><Globe size={20} /></a>
            <a href="#"><Send size={20} /></a>
            <a href="#"><MessageCircle size={20} /></a>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/collections">Our Collections</Link></li>
            <li><Link to="/recipes">Spice Recipes</Link></li>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/business">Business/Wholesale</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>Customer Care</h3>
          <ul>
            <li><Link to="/shipping">Shipping Policy</Link></li>
            <li><Link to="/returns">Returns & Refunds</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Info</h3>
          <ul>
            <li><MapPin size={18} /> 123 Spice Garden, Kandy, Sri Lanka</li>
            <li><Phone size={18} /> +94 11 234 5678</li>
            <li><Mail size={18} /> info@richeemaspicy.com</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2026 Richeema Spicy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
