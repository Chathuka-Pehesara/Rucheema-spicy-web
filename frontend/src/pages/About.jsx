import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Award, Leaf, Globe, Heart, CheckCircle, ShieldCheck, Microscope, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './About.css';

const About = () => {
  const { t } = useTranslation();
  const observerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      revealElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="about-page">
      {/* Immersive Hero Section */}
      <section className="about-hero-premium">
        <div className="hero-overlay-gradient"></div>
        <div className="container hero-content-wrapper">
          <h1 className="reveal fade-up">The Legacy of <span>Excellence</span></h1>
          <p className="reveal fade-up delay-1">
            Beyond the grain, lies a century of heritage. Discover the pursuit of the world's most pristine flavors.
          </p>
          <div className="scroll-indicator">
            <div className="mouse"></div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="philosophy">
        <div className="container">
          <div className="philosophy-grid">
            <div className="philosophy-image reveal fade-right">
              <div className="image-frame">
                <img src="https://images.unsplash.com/photo-1599940824399-b87987ceb72a?q=80&w=1200" alt="Authentic Harvest" />
                <div className="experience-badge">
                  <span className="years">25+</span>
                  <span className="text">Years of Mastery</span>
                </div>
              </div>
            </div>
            <div className="philosophy-text reveal fade-left">
              <span className="subtitle">Our Philosophy</span>
              <h2>Purity is Not a Choice, <span>It's a Promise</span></h2>
              <p>
                In an era of mass production, Richeema Spicy stands as a sanctuary for authenticity. We believe that a spice is only as good as the soil that nurtured it and the hands that harvested it.
              </p>
              <p>
                Our journey began in the high-altitude estates of Kandy, where the air is thin and the flavor is concentrated. Today, we bridge the gap between small-scale organic artisans and the world's most discerning kitchens.
              </p>
              <ul className="philosophy-list">
                <li><CheckCircle size={20} className="icon" /> Single-origin transparency</li>
                <li><CheckCircle size={20} className="icon" /> Zero-additive commitment</li>
                <li><CheckCircle size={20} className="icon" /> Climate-controlled preservation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The Science of Spice (Trust Builder) */}
      <section className="science">
        <div className="container">
          <div className="section-header center reveal fade-up">
            <span className="subtitle">Quality Assurance</span>
            <h2>The Science of <span>Perfection</span></h2>
            <p>Every harvest undergoes a rigorous three-tier validation process to ensure international export standards.</p>
          </div>
          <div className="science-grid">
            <div className="science-card reveal fade-up delay-1">
              <Microscope className="card-icon" size={48} />
              <h3>Organoleptic Testing</h3>
              <p>Our experts evaluate color, aroma, and essential oil content to ensure the highest therapeutic and culinary potency.</p>
            </div>
            <div className="science-card reveal fade-up delay-2">
              <ShieldCheck className="card-icon" size={48} />
              <h3>Purity Validation</h3>
              <p>Strict laboratory screening for pesticides, heavy metals, and moisture levels to meet EU and FDA standards.</p>
            </div>
            <div className="science-card reveal fade-up delay-3">
              <Globe className="card-icon" size={48} />
              <h3>Freshness Lock</h3>
              <p>Our proprietary vacuum-sealing technology preserves volatile oils from the moment of harvest until it reaches your door.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact & Sustainability */}
      <section className="impact">
        <div className="impact-bg"></div>
        <div className="container impact-content">
          <div className="reveal fade-up">
            <h2>Empowering the <span>Hands that Feed Us</span></h2>
            <p>
              Sustainability is woven into every thread of our story. We invest 15% of our profits directly back into rural infrastructure, education, and healthcare for our farming communities.
            </p>
            <div className="impact-stats">
              <div className="impact-stat">
                <h3>500+</h3>
                <p>Artisan Farmers Supported</p>
              </div>
              <div className="impact-stat">
                <h3>100%</h3>
                <p>Plastic-Free Packaging</p>
              </div>
              <div className="impact-stat">
                <h3>Global</h3>
                <p>Fair Trade Certified</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Timeline */}
      <section className="timeline">
        <div className="container">
          <div className="section-header center reveal fade-up">
            <span className="subtitle">Our History</span>
            <h2>A Century of <span>Flavor</span></h2>
          </div>
          <div className="timeline-wrapper">
            <div className="timeline-item reveal fade-left">
              <div className="time">1924</div>
              <div className="content">
                <h3>The First Acre</h3>
                <p>Our great-grandfather planted the first organic cinnamon grove in the fertile valleys of Kandy.</p>
              </div>
            </div>
            <div className="timeline-item reveal fade-right">
              <div className="time">1968</div>
              <div className="content">
                <h3>Mastering the Blend</h3>
                <p>Recognition from the Royal Culinary Society for our unique cold-milling process that preserves essential oils.</p>
              </div>
            </div>
            <div className="timeline-item reveal fade-left">
              <div className="time">2005</div>
              <div className="content">
                <h3>Going Global</h3>
                <p>Richeema Spicy expands its reach, supplying Michelin-starred kitchens across Europe and North America.</p>
              </div>
            </div>
            <div className="timeline-item reveal fade-right">
              <div className="time">Today</div>
              <div className="content">
                <h3>The Gold Standard</h3>
                <p>Continuing to push the boundaries of purity with our AI-driven quality assurance and zero-waste initiatives.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Testimonials */}
      <section className="expert-testimonials">
        <div className="container">
          <div className="testimonial-quote reveal fade-up">
            <Users className="quote-icon" size={40} />
            <blockquote>
              "In thirty years of sourcing, I have never encountered spices with this level of aromatic complexity. Richeema is not just a supplier; they are guardians of flavor."
            </blockquote>
            <cite>
              <strong>Marcus von Essen</strong>
              <span>Executive Chef, The Gilded Table</span>
            </cite>
          </div>
        </div>
      </section>

      {/* Conversion Section */}
      <section className="about-cta">
        <div className="container center reveal fade-up">
          <span className="subtitle">Luxury Spices</span>
          <h2>Experience the <span>Gold Standard</span></h2>
          <p>Join thousands of gourmet chefs and home connoisseurs who refuse to settle for anything less than perfection.</p>
          <div className="cta-btns">
            <Link to="/collections" className="btn-premium">{t('hero.cta')}</Link>
            <Link to="/business" className="btn-outline-dark">{t('nav.business')}</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
