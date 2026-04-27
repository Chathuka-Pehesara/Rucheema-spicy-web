import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import FeaturedProducts from '../components/home/FeaturedProducts';
import SpiceFinder from '../components/home/SpiceFinder';
import { ShieldCheck, Truck, RotateCcw, Award } from 'lucide-react';
import { SPICES_DATA, CATEGORIES, SUBSCRIPTION_PLANS } from '../utils/mockData';
import './Home.css';

const Home = () => {
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
                  <Link to="/collections" className="btn-link">Explore Collection</Link>
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
                <div className="package-header" style={{ borderBottomColor: plan.color }}>
                  <h3 style={{ color: plan.color }}>{plan.name}</h3>
                  <div className="package-price">
                    <span className="currency">$</span>
                    <span className="amount">{plan.price}</span>
                    <span className="period">/{plan.period}</span>
                  </div>
                </div>
                <ul className="package-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                <button 
                  className={`btn-${plan.featured ? 'premium' : 'outline'}`}
                  style={!plan.featured ? { color: plan.color, borderColor: plan.color } : {}}
                >
                  Select Plan
                </button>
              </div>
            ))}
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
