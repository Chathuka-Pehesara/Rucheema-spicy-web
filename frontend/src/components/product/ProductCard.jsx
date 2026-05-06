import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, Heart, Flame } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isWishlisted = wishlist.find(item => item._id === product._id);

  const handleAction = (action, e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    action(product);
  };

  const renderSpiceLevel = (level) => {
    if (!level || level === 0) return null;
    
    return (
      <div className="spice-badge" title={`Spice Level: ${level}`}>
        {[...Array(level)].map((_, i) => (
          <Flame 
            key={i} 
            size={16} 
            className="spice-flame-icon" 
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={product.image} alt={product.name} />
        <div className="product-actions">
          <button 
            className={`action-icon ${isWishlisted ? 'active' : ''}`} 
            onClick={(e) => handleAction(toggleWishlist, e)}
            aria-label="Add to Wishlist"
          >
            <Heart size={18} fill={isWishlisted ? 'var(--color-primary)' : 'none'} />
          </button>
          <button 
            className="action-icon" 
            onClick={(e) => handleAction(addToCart, e)}
            aria-label="Add to Cart"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
        {renderSpiceLevel(product.spiceLevel)}
      </div>
      <div className="product-info">
        <span className="product-cat">{product.category}</span>
        <h3 className="product-name" title={product.name}>
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>
        <div className="product-meta">
          <div className="product-rating">
            <Star size={14} fill="var(--color-secondary)" color="var(--color-secondary)" />
            <span>{product.rating || 0}</span>
          </div>
          <div className="product-price">${Number(product.price).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
