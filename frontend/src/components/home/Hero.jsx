import React from 'react';
import './Hero.css';
import heroBg from '../../assets/hero-bg.png';

const Hero = () => {
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
          <button className="btn-premium">Shop Collection</button>
          <button className="btn-outline" style={{ borderColor: 'white', color: 'white' }}>Our Story</button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
