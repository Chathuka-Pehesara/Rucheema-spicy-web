import React, { useState, useEffect } from 'react';
import ProductCard from '../product/ProductCard';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        // Show only first 4 as featured
        setProducts(data.slice(0, 4));
        setLoading(false);
      } catch (err) {
        console.error('Featured fetch error:', err);
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="featured-products">
      <div className="container">
        <div className="section-header">
          <h2>Premium Selection</h2>
          <p>Hand-picked spices from around the globe, curated for the discerning palate.</p>
        </div>
        
        {loading ? (
          <div className="products-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="product-card-skeleton" style={{ height: '350px', background: '#f5f5f5', borderRadius: '20px' }}></div>
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        
        <div className="view-all">
          <button className="btn-outline" onClick={() => window.location.href='/collections'}>View All Products</button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
