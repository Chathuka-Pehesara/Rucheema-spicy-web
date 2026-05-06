import React, { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/product/ProductCard';
import { Search, ChevronDown, Flame, RotateCcw } from 'lucide-react';
import './ProductListing.css';

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(100);
  const [selectedSpices, setSelectedSpices] = useState([]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch products error:', err);
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const categories = ['All', 'Whole Spices', 'Powders', 'Rare Blends', 'Gift Sets'];

  const toggleSpiceLevel = (level) => {
    setSelectedSpices(prev => 
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (product.origin || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price <= maxPrice;
      const matchesSpice = selectedSpices.length === 0 || selectedSpices.includes(product.spiceLevel);
      
      return matchesSearch && matchesCategory && matchesPrice && matchesSpice;
    });
  }, [products, searchQuery, selectedCategory, maxPrice, selectedSpices]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setMaxPrice(100);
    setSelectedSpices([]);
  };

  return (
    <div className="shop-page">
      {/* Interactive Discovery Header */}
      <div className="shop-header">
        <div className="container">
          <div className="discovery-badge">New Experience</div>
          <h1>Signature <span>Collections</span></h1>
          <p>Beyond taste, we offer an artisanal journey. Discover the spice that defines your culinary soul.</p>
          
          <div className="flavor-wizard">
            <h3>Find Your Flavor Identity</h3>
            <div className="wizard-options">
              {['Smoky', 'Floral', 'Intense Heat', 'Zesty', 'Earthy'].map(flavor => (
                <button 
                  key={flavor} 
                  className={`wizard-btn ${searchQuery === flavor ? 'active' : ''}`}
                  onClick={() => setSearchQuery(flavor === searchQuery ? '' : flavor)}
                >
                  {flavor}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container shop-content">
        <aside className="shop-sidebar">
          <div className="filter-header-main">
            <h3>Refine Selection</h3>
            <button className="reset-btn" onClick={clearFilters}>
              <RotateCcw size={14} /> Clear All
            </button>
          </div>

          <div className="filter-group">
            <h3>Categories</h3>
            <ul className="category-list">
              {categories.map(cat => (
                <li 
                  key={cat} 
                  className={selectedCategory === cat ? 'active' : ''}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                  <span className="count">
                    {products.filter(p => cat === 'All' || p.category === cat).length}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <div className="filter-title-row">
              <h3>Budget Range</h3>
              <span className="current-val">Up to ${maxPrice}</span>
            </div>
            <div className="price-filter">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="custom-range"
              />
              <div className="price-range-labels">
                <span>$0</span>
                <span>$100</span>
              </div>
            </div>
          </div>

          <div className="filter-group">
            <h3>Spice Intensity</h3>
            <div className="spice-lvl-filter-new">
              {[1, 2, 3, 4, 5].map(lvl => (
                <button 
                  key={lvl} 
                  className={`spice-btn ${selectedSpices.includes(lvl) ? 'active' : ''}`}
                  onClick={() => toggleSpiceLevel(lvl)}
                >
                  <div className="flame-container">
                    {[...Array(lvl)].map((_, i) => (
                      <Flame 
                        key={i} 
                        size={14} 
                        className={selectedSpices.includes(lvl) ? 'flicker' : ''}
                        fill={selectedSpices.includes(lvl) ? "currentColor" : "none"} 
                      />
                    ))}
                  </div>
                  <span>Heat Level {lvl}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="shop-main">
          <div className="shop-controls-premium">
            <div className="search-bar-new">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search by spice, origin, or flavor..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="results-badge">
              <strong>{filteredProducts.length}</strong> Spices Matching
            </div>
          </div>

          {loading ? (
            <div className="products-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="product-card-skeleton" style={{ height: '380px', background: '#f9f9f9', borderRadius: '24px' }}></div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product, index) => (
                <div key={product._id} className="grid-item-reveal" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="no-results-premium">
              <div className="no-results-icon">🌶️</div>
              <h3>No Matches Found</h3>
              <p>Your current filters didn't return any spices. Try clearing some selections.</p>
              <button className="btn-premium" onClick={clearFilters}>Reset Filters</button>
            </div>
          )}
        </main>
      </div>

      {/* Elite Partner Showcase - High End Trust */}
      <section className="partners-showcase">
        <div className="container">
          <h2 style={{ color: 'var(--color-primary-dark)' }}>Trust of <span style={{ color: 'var(--color-secondary)' }}>Elite Institutions</span></h2>
          <div className="partners-categories-grid">
            
            <div className="partner-cat-group">
              <h3 style={{ borderBottomColor: 'var(--color-secondary)' }}>Epicurean Partners</h3>
              <div className="partner-logos-mini">
                {["dilmahtea.com", "malibanbiscuits.com", "munchieeats.com"].map(domain => (
                  <div key={domain} className="partner-mini-card">
                    <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`} alt="Partner" />
                  </div>
                ))}
              </div>
            </div>

            <div className="partner-cat-group">
              <h3 style={{ borderBottomColor: 'var(--color-secondary)' }}>Grand Kitchens</h3>
              <div className="partner-logos-mini">
                {["jetwing.com", "aitkenspence.com", "cinnamonhotels.com", "tajhotels.com"].map(domain => (
                  <div key={domain} className="partner-mini-card">
                    <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`} alt="Partner" />
                  </div>
                ))}
              </div>
            </div>

            <div className="partner-cat-group">
              <h3 style={{ borderBottomColor: 'var(--color-secondary)' }}>Premier Retailers</h3>
              <div className="partner-logos-mini">
                {["keellssuper.com", "arpicosupercentre.com", "cargills.com"].map(domain => (
                  <div key={domain} className="partner-mini-card">
                    <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`} alt="Partner" />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductListing;
