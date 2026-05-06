import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Hero.css';
import heroBg from '../../assets/hero-bg.png';

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section className="hero">
      <div className="hero-bg">
        <img src={heroBg} alt="Premium Spices" />
        <div className="hero-overlay"></div>
      </div>
      <div className="container hero-content">
        <h1 className="fade-in">Experience the Essence of <span>Pure Spices</span></h1>
        <p className="fade-in" style={{ animationDelay: '0.2s' }}>
          Hand-selected, ethically sourced, and ground to perfection. 
          Elevate your culinary journey with Richeema's premium collection.
        </p>
        <div className="hero-btns fade-in" style={{ animationDelay: '0.4s' }}>
          <Link to="/collections" className="btn-premium">{t('hero.cta')}</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
