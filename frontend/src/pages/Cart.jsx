import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useShop();

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container empty-cart">
          <ShoppingBag size={64} />
          <h1>Your basket is empty</h1>
          <p>Explore our premium collections and add some flavor to your life.</p>
          <Link to="/shop" className="btn-premium">Shop Now</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Your Spice Basket</h1>
        
        <div className="cart-container">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p>Origin: {item.origin}</p>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
                <div className="item-qty">
                  <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                </div>
                <div className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <Link to="/shop" className="continue-shopping">
              <ArrowLeft size={18} /> Continue Shopping
            </Link>
          </div>

          <aside className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{cartTotal > 100 ? 'FREE' : '$10.00'}</span>
            </div>
            <div className="summary-row">
              <span>Tax (8%)</span>
              <span>${(cartTotal * 0.08).toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>${(cartTotal * 1.08 + (cartTotal > 100 ? 0 : 10)).toFixed(2)}</span>
            </div>
            <button className="btn-premium checkout-btn">Proceed to Checkout</button>
            <div className="secure-payment">
              <p>Secure payment processed by Stripe</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Cart;
