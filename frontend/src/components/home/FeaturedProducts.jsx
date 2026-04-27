import React from 'react';
import ProductCard from '../product/ProductCard';
import { SPICES_DATA } from '../../utils/mockData';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  return (
    <section className="featured-products">
      <div className="container">
        <div className="section-header">
          <h2>Premium Selection</h2>
          <p>Hand-picked spices from around the globe, curated for the discerning palate.</p>
        </div>
        <div className="products-grid">
          {SPICES_DATA.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="view-all">
          <button className="btn-outline">View All Products</button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
