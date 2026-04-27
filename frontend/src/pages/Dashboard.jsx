import React, { useState } from 'react';
import { Package, Heart, User, Settings, LogOut, Clock, Trash2, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const { wishlist, toggleWishlist, addToCart } = useShop();

  const menuItems = [
    { id: 'orders', name: 'My Orders', icon: <Package size={18} /> },
    { id: 'wishlist', name: 'Wishlist', icon: <Heart size={18} /> },
    { id: 'profile', name: 'Profile Details', icon: <User size={18} /> },
    { id: 'history', name: 'Order History', icon: <Clock size={18} /> },
    { id: 'settings', name: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <div className="dashboard-page">
      <div className="container dashboard-container">
        <aside className="dashboard-nav">
          <div className="user-profile">
            <img src="https://i.pravatar.cc/150?u=user" alt="Profile" />
            <h3>Alexander Smith</h3>
            <span>Gold Member</span>
          </div>
          <ul>
            {menuItems.map(item => (
              <li 
                key={item.id} 
                className={activeTab === item.id ? 'active' : ''}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon} {item.name}
              </li>
            ))}
            <li className="logout"><LogOut size={18} /> Logout</li>
          </ul>
        </aside>

        <main className="dashboard-main">
          {activeTab === 'orders' && (
            <>
              <div className="dashboard-header">
                <h2>Active Orders</h2>
                <span>2 orders in progress</span>
              </div>
              <div className="order-cards">
                <div className="order-card">
                  <div className="order-top">
                    <div>
                      <span className="order-id">Order #RS-9982</span>
                      <span className="order-date">Placed on Oct 24, 2023</span>
                    </div>
                    <div className="order-status shipped">Shipped</div>
                  </div>
                  <div className="order-items-preview">
                    <img src="https://images.unsplash.com/photo-1599390725350-255d6100790d?q=80&w=100" alt="item" />
                    <img src="https://images.unsplash.com/photo-1594911771141-944a95e0c521?q=80&w=100" alt="item" />
                  </div>
                  <div className="order-bottom">
                    <div className="order-total">Total: $54.20</div>
                    <button className="btn-outline btn-sm">Track Order</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'wishlist' && (
            <div className="wishlist-view">
              <div className="dashboard-header">
                <h2>My Wishlist</h2>
                <span>{wishlist.length} saved items</span>
              </div>
              <div className="wishlist-grid">
                {wishlist.length === 0 ? (
                  <div className="empty-state">
                    <Heart size={48} />
                    <p>Your wishlist is empty.</p>
                    <Link to="/shop" className="btn-premium">Explore Spices</Link>
                  </div>
                ) : (
                  wishlist.map(item => (
                    <div key={item.id} className="wishlist-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>${item.price.toFixed(2)}</p>
                      </div>
                      <div className="item-actions">
                        <button className="action-icon" onClick={() => addToCart(item)}><ShoppingBag size={18} /></button>
                        <button className="action-icon remove" onClick={() => toggleWishlist(item)}><Trash2 size={18} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-view">
              <div className="dashboard-header">
                <h2>Account Settings</h2>
              </div>
              <div className="settings-form">
                <div className="form-group">
                  <label>Email Notifications</label>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="form-group">
                  <label>SMS Alerts</label>
                  <label className="switch">
                    <input type="checkbox" />
                    <span className="slider round"></span>
                  </label>
                </div>
                <div className="form-group">
                  <label>Preferred Currency</label>
                  <select>
                    <option>USD ($)</option>
                    <option>LKR (Rs)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
                <button className="btn-premium">Save Preferences</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
