import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Send, MessageCircle, Mail, Phone, MapPin } from 'lucide-react';
import brandLogo from '../../assets/brand-logo-transparent.png';
import mainLogo from '../../assets/main-logo-transparent.png';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="footer-logo-container">
            <img src={brandLogo} alt="Rucheema Spicy Brand" className="brand-logo-img" />
          </Link>
          <div className="parent-company-footer">
            <span className="parent-label">An Enterprise of</span>
            <img src={mainLogo} alt="Main Headbranch Company" className="parent-logo-footer" />
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/collections">{t('nav.collections')}</Link></li>
            <li><Link to="/recipes">Spice Recipes</Link></li>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/business">{t('nav.business')}</Link></li>
          </ul>
        </div>

        <div className="footer-links">
          <h3>{t('footer.support')}</h3>
          <ul>
            <li><Link to="/shipping">Shipping Policy</Link></li>
            <li><Link to="/returns">Returns & Refunds</Link></li>
            <li><Link to="/faq">FAQs</Link></li>
            <li><Link to="/contact">{t('footer.contact_us')}</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Info</h3>
          <ul>
            <li><MapPin size={18} /> 123 Spice Garden, Kandy, Sri Lanka</li>
            <li><Phone size={18} /> +94 11 234 5678</li>
            <li><Mail size={18} /> info@richeemaspicy.com</li>
          </ul>
          <div className="social-links">
            <a href="#"><Globe size={20} /></a>
            <a href="#"><Send size={20} /></a>
            <a href="#"><MessageCircle size={20} /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-content">
          <p className="footer-desc-bottom">
            Bringing you the finest, most authentic spices from the heart of the spice routes. Quality and tradition in every grain.
          </p>
          <p className="copyright">&copy; 2026 Richeema Spicy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
