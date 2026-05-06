import React from 'react';
import { Briefcase, Truck, FileText, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Business.css';

const Business = () => {
  const { t } = useTranslation();
  return (
    <div className="business-page">
      <div className="business-hero">
        <div className="container">
          <div className="discovery-badge fade-in-up">B2B Partnerships</div>
          <h1 className="fade-in-up" style={{ animationDelay: '0.2s' }}>Empowering <span>Culinary Excellence</span></h1>
          <p className="fade-in-up" style={{ animationDelay: '0.4s' }}>Global wholesale solutions for Michelin-starred kitchens, luxury hotels, and boutique retailers. Authentic spices, sourced directly, delivered worldwide.</p>
          <div className="hero-btns fade-in-up" style={{ animationDelay: '0.6s' }}>
            <a href="#inquiry" className="btn-premium">Talk to Us</a>
            <Link to="/about" className="btn-outline" style={{ borderColor: 'white', color: 'white' }}>Our Story</Link>
          </div>
          <div className="hero-stats fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="stat-item">
              <strong>500+</strong>
              <span>Global Partners</span>
            </div>
            <div className="stat-item">
              <strong>30+</strong>
              <span>Countries Served</span>
            </div>
            <div className="stat-item">
              <strong>100%</strong>
              <span>Purity Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Benefits Section */}
        <section className="business-benefits">
          <div className="section-header">
            <h2>Why partner with Richeema?</h2>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <Briefcase size={40} />
              <h3>Wholesale Pricing</h3>
              <p>Scale your business with competitive bulk rates and loyalty discounts.</p>
            </div>
            <div className="benefit-card">
              <Truck size={40} />
              <h3>Priority Logistics</h3>
              <p>Dedicated shipping channels for large volume orders with global reach.</p>
            </div>
            <div className="benefit-card">
              <FileText size={40} />
              <h3>Quality Assurance</h3>
              <p>Full traceability and COA (Certificate of Analysis) for every batch.</p>
            </div>
            <div className="benefit-card">
              <Headphones size={40} />
              <h3>Account Manager</h3>
              <p>A dedicated expert to help you source exactly what your kitchen needs.</p>
            </div>
          </div>
        </section>

        {/* Custom Request Form */}
        <section className="custom-request" id="inquiry">
          <div className="request-container">
            <div className="request-info">
              <h2>Custom Sourcing <span>Requests</span></h2>
              <p>Need a specific grade of spice or a unique blend? Our sourcing team can find it for you.</p>
              <ul className="request-list">
                <li>Specific origin sourcing</li>
                <li>Custom blend development</li>
                <li>Private label packaging</li>
                <li>Bulk grinding options</li>
              </ul>
            </div>
            <div className="request-form">
              <h3>Inquiry Form</h3>
              <form>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="e.g. John Doe" />
                </div>
                <div className="form-group">
                  <label>Company Name</label>
                  <input type="text" placeholder="e.g. Spice Restaurant Group" />
                </div>
                <div className="form-group">
                  <label>Business Type</label>
                  <select>
                    <option>Restaurant</option>
                    <option>Retailer</option>
                    <option>Manufacturer</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Message / Requirements</label>
                  <textarea rows="4" placeholder="Tell us what you are looking for..."></textarea>
                </div>
                <button className="btn-premium" type="button">{t('footer.contact_us')}</button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Business;
