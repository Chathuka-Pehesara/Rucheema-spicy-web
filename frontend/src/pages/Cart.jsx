import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, ShieldCheck, Package } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { calculateDistance, calculateDeliveryFee, calculateShipmentFee } from '../utils/shippingUtils';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' | 'success'
  const [settings, setSettings] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`);
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
      // Fallback: if country missing from old session token, default to Sri Lanka
      const userCountry = (user.country || 'Sri Lanka').trim();
      const userCity    = (user.city    || 'Colombo').trim();
      const isLocal = userCountry.toLowerCase() === 'sri lanka';

      const distance = calculateDistance(
        settings.baseLocation.city,
        settings.baseLocation.country,
        userCity,
        userCountry
      );
      const fee = isLocal
        ? calculateDeliveryFee(distance, settings.shippingRates)
        : calculateShipmentFee(distance, settings.shippingRates);
      setShippingFee(fee);
    } else if (settings && !user) {
      setShippingFee(0);
    }
  }, [settings, user]);

  const subtotal = cartTotal;
  const shipping = shippingFee;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleProceedToPayment = () => {
    navigate('/payment', {
      state: {
        total,
        subtotal,
        tax,
        shipping,
        orderItems: cart.map(item => ({
          name: item.name,
          qty: item.quantity,
          price: item.price,
          image: item.image,
          product: item.id
        }))
      }
    });
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
                  
                  {(() => {
                    const userCountry = (user?.country || 'Sri Lanka').trim();
                    const userCity    = (user?.city    || 'Colombo').trim();
                    const isLocal = userCountry.toLowerCase() === 'sri lanka';
                    const distance = settings && user
                      ? calculateDistance(
                          settings.baseLocation.city,
                          settings.baseLocation.country,
                          userCity,
                          userCountry
                        )
                      : null;
                    const rate = settings
                      ? (isLocal ? settings.shippingRates.localPerKm : settings.shippingRates.internationalPerKm)
                      : null;

                    return (
                      <>
                        {/* Sri Lanka: show Delivery Fee only */}
                        {isLocal && (
                          <div className="summary-line">
                            <span>Delivery Fee</span>
                            <span>${shipping.toFixed(2)}</span>
                          </div>
                        )}
                        {/* International: show Shipment Fee only */}
                        {!isLocal && (
                          <div className="summary-line">
                            <span>Shipment Fee</span>
                            <span>${shipping.toFixed(2)}</span>
                          </div>
                        )}
                        {/* Breakdown detail box */}
                        {settings && user && distance !== null && (
                          <div className="shipping-detail-box">
                            <div className="detail-label">
                              <Package size={12} /> Logistics Breakdown
                            </div>
                            <span className="detail-calc">
                              {userCity} → {settings.baseLocation.city} &nbsp;|&nbsp; {distance} km
                            </span>
                            <span className="detail-calc">
                              Rate: ${rate}/km{isLocal ? ' (Local)' : ' (International)'}
                            </span>
                          </div>
                        )}
                      </>
                    );
                  })()}

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
                <button className="btn-checkout-gold" onClick={handleProceedToPayment}>
                  Proceed to Secure Checkout
                </button>
                <div className="secure-footer">
                  <ShieldCheck size={14} /> <span>Secured by Tier-1 Encryption</span>
                </div>
              </aside>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
