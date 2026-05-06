import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import SpiceFinder from '../components/home/SpiceFinder';
import { ShieldCheck, Truck, RotateCcw, Award, CheckCircle, Globe, Verified, Medal, ChevronLeft, ChevronRight } from 'lucide-react';
import { SPICES_DATA, CATEGORIES, SUBSCRIPTION_PLANS } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSubscribe = () => {
    if (!user) {
      navigate('/login');
    } else {
      // Logic for authenticated subscription if any
      alert('Subscription feature coming soon!');
    }
  };

  const PARTNER_LOGOS = [
    "https://www.google.com/s2/favicons?domain=dilmahtea.com&sz=128",
    "https://www.google.com/s2/favicons?domain=jetwinghotels.com&sz=128",
    "https://www.google.com/s2/favicons?domain=aitkenspence.com&sz=128",
    "https://www.google.com/s2/favicons?domain=cinnamonhotels.com&sz=128",
    "https://www.google.com/s2/favicons?domain=keellssuper.com&sz=128",
    "https://www.google.com/s2/favicons?domain=arpicosupercentre.com&sz=128",
    "https://www.google.com/s2/favicons?domain=tajhotels.com&sz=128"
  ];

  return (
    <div className="home-page">
      <Hero />
      
      {/* Brand Trust Section */}
      <section className="brand-trust">
        <div className="container trust-grid">
          <div className="trust-item">
            <ShieldCheck size={32} />
            <h3>100% Authentic</h3>
            <p>Directly sourced from organic farms with certified quality standards.</p>
          </div>
          <div className="trust-item">
            <Award size={32} />
            <h3>Premium Grade</h3>
            <p>Only the highest quality harvests make it to our collection.</p>
          </div>
          <div className="trust-item">
            <Truck size={32} />
            <h3>Global Shipping</h3>
            <p>Fast and secure shipping to spice lovers worldwide.</p>
          </div>
          <div className="trust-item">
            <RotateCcw size={32} />
            <h3>Easy Returns</h3>
            <p>Not satisfied? Our 30-day return policy has you covered.</p>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section className="certificates">
        <div className="container">
          <div className="cert-grid">
            <div className="cert-item">
              <div className="cert-badge"><Award size={40} /></div>
              <span>ISO 22000 Certified</span>
            </div>
            <div className="cert-item">
              <div className="cert-badge"><Globe size={40} /></div>
              <span>Fair Trade Partner</span>
            </div>
            <div className="cert-item">
              <div className="cert-badge"><ShieldCheck size={40} /></div>
              <span>Organic Certified</span>
            </div>
            <div className="cert-item">
              <div className="cert-badge"><Medal size={40} /></div>
              <span>GMP Approved</span>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProducts />

      {/* Collections Section */}
      <section className="categories">
        <div className="container">
          <div className="section-header">
            <h2>Signature Collections</h2>
            <p>Explore our curated varieties of premium spices</p>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="cat-card">
                <img src={cat.image} alt={cat.name} />
                <div className="cat-content">
                  <h3>{cat.name}</h3>
                  <p>Hand-selected varieties for the discerning palate.</p>
                  <Link to="/collections" className="btn-link">{t('nav.collections')}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SpiceFinder />

      {/* Subscription Section with Packages */}
      <section className="subscription">
        <div className="container">
          <div className="section-header center">
            <h2>The Spice <span>Subscription</span></h2>
            <p>Choose a plan that fits your culinary lifestyle</p>
          </div>
          
          <div className="sub-packages-grid">
            {SUBSCRIPTION_PLANS.map((plan) => (
              <div key={plan.id} className={`sub-package-card ${plan.featured ? 'featured' : ''}`}>
                {plan.featured && <div className="featured-badge">Most Popular</div>}
                <div className="package-header">
                  <h3>{plan.name}</h3>
                  <div className="package-price">
                    <span className="currency">$</span>
                    <span className="amount">{plan.price}</span>
                    <span className="period">/{plan.period}</span>
                  </div>
                </div>
                <ul className="package-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>
                      <CheckCircle size={18} className="feature-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button 
                  className={plan.featured ? 'btn-premium' : 'btn-outline'}
                  onClick={handleSubscribe}
                >
                  {t('subscription.cta')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Partners Section */}
      <section className="partners">
        <div className="container">
          <h2 className="partners-title">Our Partners</h2>
          <div className="partners-logo-container">
            <div className="logo-track">
              {PARTNER_LOGOS.map((logo, index) => (
                <div className="logo-card" key={`logo-1-${index}`}>
                  <img src={logo} alt="Partner" />
                </div>
              ))}
              {PARTNER_LOGOS.map((logo, index) => (
                <div className="logo-card" key={`logo-2-${index}`}>
                  <img src={logo} alt="Partner" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>Kind Words</h2>
          </div>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p>"The quality of the Ceylon Cinnamon is unlike anything I've found in stores. Pure luxury for the kitchen."</p>
              <div className="customer">
                <img src="https://i.pravatar.cc/150?u=1" alt="Customer" />
                <div>
                  <h4>Elena Rodriguez</h4>
                  <span>Professional Chef</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p>"Richeema's Saffron transformed my risotto. The color and aroma are truly exceptional. Worth every penny."</p>
              <div className="customer">
                <img src="https://i.pravatar.cc/150?u=2" alt="Customer" />
                <div>
                  <h4>James Montgomery</h4>
                  <span>Food Critic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
