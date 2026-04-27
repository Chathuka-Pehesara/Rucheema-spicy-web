import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const isWishlisted = wishlist.find(item => item.id === product.id);

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <div className="product-actions">
          <button 
            className={`action-icon ${isWishlisted ? 'active' : ''}`} 
            onClick={() => toggleWishlist(product)}
            aria-label="Add to Wishlist"
          >
            <Heart size={18} fill={isWishlisted ? 'var(--color-primary)' : 'none'} />
          </button>
          <button 
            className="action-icon" 
            onClick={() => addToCart(product)}
            aria-label="Add to Cart"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
        <div className="spice-badge">Spice Lvl: {product.spiceLevel}</div>
      </div>
      <div className="product-info">
        <span className="product-cat">{product.category}</span>
        <h3 className="product-name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="product-meta">
          <div className="product-rating">
            <Star size={14} fill="var(--color-secondary)" color="var(--color-secondary)" />
            <span>{product.rating}</span>
          </div>
          <div className="product-price">${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
