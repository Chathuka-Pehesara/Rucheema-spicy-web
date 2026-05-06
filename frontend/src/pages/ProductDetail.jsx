import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, MapPin, Flame, Leaf } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleWishlist, wishlist } = useShop();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch product detail error:', err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const isWishlisted = product && wishlist.find(item => item._id === product._id);

  const handleAction = (action, ...args) => {
    if (!user) {
      navigate('/login');
      return;
    }
    action(...args);
  };

  if (loading) return <div className="container" style={{padding: '10rem 0', textAlign: 'center'}}><h2>Consulting the spice masters...</h2></div>;
  if (!product) return <div className="container" style={{padding: '10rem 0', textAlign: 'center'}}><h2>This spice has vanished from our archives.</h2></div>;

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="detail-grid">
          {/* Image Gallery */}
          <div className="detail-gallery">
            <div className="main-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="thumb-grid">
              <img src={product.image} alt="thumb" className="active" />
              <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=200" alt="thumb" />
              <img src="https://images.unsplash.com/photo-1532336414038-cf19250c5757?q=80&w=200" alt="thumb" />
            </div>
          </div>

          {/* Info Section */}
          <div className="detail-info">
            <span className="detail-cat">{product.category}</span>
            <h1>{product.name}</h1>
            <div className="detail-meta">
              <div className="rating">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "var(--color-secondary)" : "none"} color="var(--color-secondary)" />
                ))}
                <span>({product.rating} / 5.0)</span>
              </div>
              <div className="origin">
                <MapPin size={16} />
                <span>Origin: {product.origin}</span>
              </div>
            </div>

            <div className="detail-price">${product.price.toFixed(2)}</div>
            
            <p className="detail-desc">{product.description}</p>

            <div className="spice-lvl-box">
              <div className="label"><Flame size={18} /> Spice Level:</div>
              <div className="lvl-bars">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`bar ${i < product.spiceLevel ? 'active' : ''}`}></div>
                ))}
              </div>
              <span>{product.spiceLevel === 1 ? 'Mild' : product.spiceLevel === 3 ? 'Medium' : 'Hot'}</span>
            </div>

            <div className="purchase-actions">
              <div className="qty-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <button 
                className="btn-premium add-to-cart" 
                onClick={() => handleAction(addToCart, product, quantity)}
              >
                <ShoppingBag size={20} /> Add to Cart
              </button>
              <button 
                className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
                onClick={() => handleAction(toggleWishlist, product)}
              >
                <Heart size={24} fill={isWishlisted ? 'var(--color-primary)' : 'none'} />
              </button>
            </div>

            <div className="recipe-tease">
              <h3><Leaf size={20} /> Perfect for:</h3>
              <p>Traditional Curries, Roasted Vegetables, and Infused Oils.</p>
            </div>
          </div>
        </div>

        {/* Recipes Section */}
        <section className="product-recipes">
          <div className="section-header">
            <h2>Recipes using this spice</h2>
          </div>
          <div className="recipes-grid">
            <div className="recipe-card">
              <img src="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=600" alt="Recipe" />
              <div className="recipe-info">
                <h4>Signature {product.name} Roast</h4>
                <button className="btn-link">View Recipe</button>
              </div>
            </div>
            <div className="recipe-card">
              <img src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=600" alt="Recipe" />
              <div className="recipe-info">
                <h4>Infused Herbal Tea</h4>
                <button className="btn-link">View Recipe</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;
