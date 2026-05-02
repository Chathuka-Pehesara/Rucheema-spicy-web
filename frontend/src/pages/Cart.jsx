import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CreditCard, ShieldCheck, CheckCircle, Package } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { calculateDistance, calculateShippingFee } from '../utils/shippingUtils';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useShop();
  const { user } = useAuth();
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart', 'payment', 'success'
  const [settings, setSettings] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/settings');
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        console.error('Failed to fetch settings', err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings && user) {
      const isLocal = user.country === 'Sri Lanka';
      const distance = calculateDistance(
        settings.baseLocation.city, 
        settings.baseLocation.country,
        user.city,
        user.country
      );
      const fee = calculateShippingFee(distance, settings.shippingRates, isLocal);
      setShippingFee(fee);
    } else if (settings && !user) {
      // Default for guests or if user location not set
      setShippingFee(10); 
    }
  }, [settings, user]);

  const subtotal = cartTotal;
  const shipping = shippingFee;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleProcessPayment = async () => {
    setCheckoutStep('processing');
    
    try {
      const orderData = {
        orderItems: cart.map(item => ({
          name: item.name,
          qty: item.quantity,
          image: item.image,
          price: item.price,
          product: item.id
        })),
        shippingAddress: {
          address: user.town,
          city: user.city,
          country: user.country,
          postalCode: '00000'
        },
        paymentMethod: 'Credit Card',
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total,
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setTimeout(() => {
          setCheckoutStep('success');
          clearCart();
        }, 1500);
      } else {
        const error = await response.json();
        alert(`Order failed: ${error.message}`);
        setCheckoutStep('payment');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred during payment processing.');
      setCheckoutStep('payment');
    }
  };

  if (cart.length === 0 && checkoutStep !== 'success') {
    return (
      <div className="cart-page">
        <div className="container empty-cart-luxury">
          <div className="empty-icon-glow">
            <ShoppingBag size={80} />
          </div>
          <h1>Your Artisanal Basket is Empty</h1>
          <p>Explore our rare spice collections and curate your personal blend.</p>
          <Link to="/shop" className="btn-luxury-gold">Discover Collections</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        {checkoutStep === 'cart' && (
          <div className="cart-view-container animate-slide-up">
            <h1 className="luxury-title">Artisanal <span>Basket</span></h1>
            <div className="cart-layout">
              <div className="cart-items-section">
                {cart.map((item, idx) => (
                  <div key={item.id} className="luxury-cart-item" style={{animationDelay: `${idx * 0.1}s`}}>
                    <div className="item-img-luxury">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="item-info-luxury">
                      <div className="header-row">
                        <h3>{item.name}</h3>
                        <button className="remove-icon-btn" onClick={() => removeFromCart(item.id)}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="origin-tag">{item.origin || 'Ceylon Coast'}</p>
                      <div className="item-controls-luxury">
                        <div className="qty-picker">
                          <button onClick={() => updateQuantity(item.id, -1)}><Minus size={14} /></button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}><Plus size={14} /></button>
                        </div>
                        <div className="item-total-price">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Link to="/shop" className="btn-back-link">
                  <ArrowLeft size={18} /> Return to Boutique
                </Link>
              </div>

              <aside className="summary-card-executive">
                <h3>Order Insight</h3>
                <div className="summary-list">
                  <div className="summary-line">
                    <span>Curation Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-line">
                    <span>Artisanal Shipping</span>
                    <span>{shipping === 0 ? <span className="free-tag">Complimentary</span> : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="summary-line">
                    <span>Luxury Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="summary-divider"></div>
                  <div className="summary-total-luxury">
                    <span>Total Investment</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button className="btn-checkout-gold" onClick={() => setCheckoutStep('payment')}>
                  Proceed to Secure Checkout
                </button>
                <div className="secure-footer">
                  <ShieldCheck size={16} /> <span>Secured by Tier-1 Encryption</span>
                </div>
              </aside>
            </div>
          </div>
        )}

        {checkoutStep === 'payment' && (
          <div className="payment-gateway-luxury animate-scale-in">
             <div className="payment-modal-card">
                <div className="payment-header">
                   <h2>Secure <span>Vault</span></h2>
                   <p>Enter your payment credentials for secure processing</p>
                </div>
                <div className="payment-form-grid">
                   <div className="card-preview-glass">
                      <div className="chip"></div>
                      <div className="card-number">•••• •••• •••• 4242</div>
                      <div className="card-info">
                         <div>
                            <small>Card Holder</small>
                            <p>EXECUTIVE CLIENT</p>
                         </div>
                         <div>
                            <small>Expires</small>
                            <p>12/28</p>
                         </div>
                      </div>
                   </div>
                   <div className="payment-inputs">
                      <div className="input-group-luxury">
                         <label>Cardholder Designation</label>
                         <input type="text" placeholder="Johnathan Doe" />
                      </div>
                      <div className="input-group-luxury">
                         <label>Secure Card Number</label>
                         <input type="text" placeholder="XXXX XXXX XXXX XXXX" />
                      </div>
                      <div className="input-row-luxury">
                         <div className="input-group-luxury">
                            <label>Expiry</label>
                            <input type="text" placeholder="MM/YY" />
                         </div>
                         <div className="input-group-luxury">
                            <label>CVV/CVC</label>
                            <input type="password" placeholder="•••" />
                         </div>
                      </div>
                      <button className="btn-pay-now" onClick={handleProcessPayment}>
                        Authorize ${total.toFixed(2)} Payment
                      </button>
                      <button className="btn-cancel-payment" onClick={() => setCheckoutStep('cart')}>
                        Discard & Return to Basket
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

        {checkoutStep === 'processing' && (
          <div className="processing-overlay">
             <div className="spinner-luxury"></div>
             <h3>Verifying with Global Banks...</h3>
             <p>Securing your artisanal transaction</p>
          </div>
        )}

        {checkoutStep === 'success' && (
          <div className="success-view-luxury animate-slide-up">
             <div className="success-card-gold">
                <div className="success-icon-wrapper">
                   <CheckCircle size={80} className="check-gold" />
                </div>
                <h1>Order <span>Sanctified</span></h1>
                <p>Your artisanal spices are being prepared for dispatch. A confirmation has been sent to your executive email.</p>
                <div className="success-actions">
                   <Link to="/dashboard" className="btn-luxury-outline"><Package size={18} /> Track Dispatch</Link>
                   <Link to="/" className="btn-luxury-gold">Return to Home</Link>
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
