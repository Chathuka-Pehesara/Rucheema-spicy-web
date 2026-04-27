import React, { useState } from 'react';
import { Search, Flame, Leaf, Wind } from 'lucide-react';
import './SpiceFinder.css';

const SpiceFinder = () => {
  const [activeMood, setActiveMood] = useState('Spicy');

  const moods = [
    { name: 'Spicy', icon: <Flame size={20} />, desc: 'Add heat to your kitchen.' },
    { name: 'Aromatic', icon: <Wind size={20} />, desc: 'Fill your home with scent.' },
    { name: 'Earthy', icon: <Leaf size={20} />, desc: 'Grounded and rich flavors.' },
  ];

  return (
    <section className="spice-finder">
      <div className="container">
        <div className="finder-card">
          <div className="finder-content">
            <h2>Find Your Perfect <span>Spice Match</span></h2>
            <p>Tell us what you're cooking or how you're feeling, and we'll suggest the perfect spice.</p>
            
            <div className="mood-selector">
              {moods.map(mood => (
                <div 
                  key={mood.name} 
                  className={`mood-item ${activeMood === mood.name ? 'active' : ''}`}
                  onClick={() => setActiveMood(mood.name)}
                >
                  <div className="mood-icon">{mood.icon}</div>
                  <div className="mood-text">
                    <strong>{mood.name}</strong>
                    <span>{mood.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="finder-search">
              <input type="text" placeholder="What are you cooking today? (e.g. Chicken Curry, Lamb Stew)" />
              <button className="btn-premium">Find Spices</button>
            </div>
          </div>
          <div className="finder-image">
            <img src="https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=800" alt="Spice Selection" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpiceFinder;
