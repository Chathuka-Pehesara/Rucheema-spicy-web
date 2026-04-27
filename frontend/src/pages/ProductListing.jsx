import React, { useState } from 'react';
import ProductCard from '../components/product/ProductCard';
import { SPICES_DATA } from '../utils/mockData';
import { Search, Filter, ChevronDown } from 'lucide-react';
import './ProductListing.css';

const ProductListing = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Whole Spices', 'Artisanal Powders', 'Rare Exotics'];

  const filteredProducts = SPICES_DATA.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                  className="wizard-btn"
                  onClick={() => setSearchQuery(flavor)}
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
          <div className="filter-group">
            <h3>Categories</h3>
            <ul>
              {categories.map(cat => (
                <li 
                  key={cat} 
                  className={selectedCategory === cat ? 'active' : ''}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group">
            <h3>Price Range</h3>
            <div className="price-filter">
              <input type="range" min="0" max="100" />
              <div className="price-labels">
                <span>$0</span>
                <span>$100</span>
              </div>
            </div>
          </div>

          <div className="filter-group">
            <h3>Spice Level</h3>
            <div className="spice-lvl-filter">
              {[1, 2, 3, 4, 5].map(lvl => (
                <label key={lvl} className="checkbox-container">
                  Level {lvl}
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <main className="shop-main">
          <div className="shop-controls">
            <div className="search-bar">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Search spices..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="sort-dropdown">
              <span>Sort by: Popularity</span>
              <ChevronDown size={16} />
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="no-results">
              <p>No spices found matching your criteria.</p>
              <button className="btn-link" onClick={() => {setSearchQuery(''); setSelectedCategory('All');}}>Clear Filters</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListing;
