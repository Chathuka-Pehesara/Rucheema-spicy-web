import React, { useState } from 'react';
import { Package, Heart, User, Settings, LogOut, Clock, Trash2, ShoppingBag, Edit2, Shield, CreditCard, Bell, ChevronRight, Award } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const [isEditing, setIsEditing] = useState(false);

  const menuItems = [
    { id: 'orders', name: 'Active Orders', icon: <Package size={20} /> },
    { id: 'wishlist', name: 'Saved Treasures', icon: <Heart size={20} /> },
    { id: 'profile', name: 'Profile Identity', icon: <User size={20} /> },
    { id: 'history', name: 'Past Journeys', icon: <Clock size={20} /> },
    { id: 'settings', name: 'Preferences', icon: <Settings size={20} /> },
  ];

  const orderHistory = [
    { id: 'RS-8821', date: 'Sept 12, 2023', total: 124.50, status: 'Delivered', items: 4, type: 'Premium Selection' },
    { id: 'RS-7742', date: 'Aug 05, 2023', total: 45.00, status: 'Delivered', items: 1, type: 'Single Origin' },
    { id: 'RS-6610', date: 'July 20, 2023', total: 89.20, status: 'Delivered', items: 3, type: 'Artisanal Blend' },
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero-bg"></div>
      <div className="container dashboard-container">
        
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <div className="profile-header-card">
            <div className="avatar-wrapper">
              <img src="https://i.pravatar.cc/150?u=alex" alt="Profile" />
              <div className="status-indicator"></div>
            </div>
            <div className="user-info">
              <h3>Alexander Smith</h3>
              <div className="member-badge">
                <Award size={12} /> Gold Member
              </div>
            </div>
          </div>

          <nav className="dashboard-menu">
            {menuItems.map((item, index) => (
              <button 
                key={item.id} 
                className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="icon-box">{item.icon}</span>
                <span className="item-name">{item.name}</span>
                {item.id === 'wishlist' && wishlist.length > 0 && (
                  <span className="badge-count">{wishlist.length}</span>
                )}
              </button>
            ))}
            <button className="menu-item logout">
              <span className="icon-box"><LogOut size={20} /></span>
              <span className="item-name">Logout</span>
            </button>
          </nav>

          <div className="loyalty-card">
            <h4>Spice Points</h4>
            <div className="points-display">
              <span className="points">2,450</span>
              <span className="unit">pts</span>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: '75%' }}></div>
            </div>
            <p>550 pts until Platinum</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-content">
          
          {/* Active Orders Tab */}
          {activeTab === 'orders' && (
            <div className="tab-view">
              <div className="view-header">
                <div>
                  <h2>Active <span>Orders</span></h2>
                  <p>Tracking your latest artisanal discoveries</p>
                </div>
              </div>
              
              <div className="order-grid">
                <div className="order-item-card">
                  <div className="card-top">
                    <div className="order-meta">
                      <span className="id">Order #RS-9982</span>
                      <span className="date">Oct 24, 2023 • Expected by Oct 28</span>
                    </div>
                    <div className="status-chip in-transit">In Transit</div>
                  </div>
                  <div className="card-body">
                    <div className="previews">
                      <img src="https://images.unsplash.com/photo-1599390725350-255d6100790d?q=80&w=100" alt="item" />
                      <img src="https://images.unsplash.com/photo-1594911771141-944a95e0c521?q=80&w=100" alt="item" />
                      <div className="more-items">+1</div>
                    </div>
                    <div className="pricing">
                      <span className="label">Total Value</span>
                      <span className="value">$54.20</span>
                    </div>
                  </div>
                  <div className="card-footer">
                    <button className="btn-track">Track Shipment</button>
                    <button className="btn-details-link">Order Details</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="tab-view">
              <div className="view-header">
                <div>
                  <h2>Saved <span>Treasures</span></h2>
                  <p>{wishlist.length} rare finds awaiting your kitchen</p>
                </div>
              </div>
              
              <div className="wishlist-premium-grid">
                {wishlist.length === 0 ? (
                  <div className="empty-state-luxury">
                    <div className="icon-circle"><Heart size={40} /></div>
                    <h3>Your collection is empty</h3>
                    <p>Start your journey by exploring our signature collections.</p>
                    <Link to="/collections" className="btn-premium">Explore Collections</Link>
                  </div>
                ) : (
                  wishlist.map((item, index) => (
                    <div key={item.id} className="wishlist-premium-card" style={{ animationDelay: `${index * 0.05}s` }}>
                      <div className="image-box">
                        <img src={item.image} alt={item.name} />
                        <button className="btn-remove" onClick={() => toggleWishlist(item)}><Trash2 size={16} /></button>
                      </div>
                      <div className="info-box">
                        <h4>{item.name}</h4>
                        <span className="price">${item.price.toFixed(2)}</span>
                        <button className="btn-add-cart" onClick={() => addToCart(item)}>
                          <ShoppingBag size={14} /> Add to Cart
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Profile Identity Tab */}
          {activeTab === 'profile' && (
            <div className="tab-view">
              <div className="view-header">
                <div>
                  <h2>Profile <span>Identity</span></h2>
                  <p>Manage your account and shipping details</p>
                </div>
                <button className={`btn-edit ${isEditing ? 'active' : ''}`} onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? 'Cancel' : <><Edit2 size={16} /> Edit Identity</>}
                </button>
              </div>

              <div className="profile-details-grid">
                <div className="info-card">
                  <div className="card-section">
                    <label>Full Name</label>
                    {isEditing ? <input type="text" defaultValue="Alexander Smith" /> : <p>Alexander Smith</p>}
                  </div>
                  <div className="card-section">
                    <label>Email Address</label>
                    {isEditing ? <input type="email" defaultValue="alex.smith@premium.com" /> : <p>alex.smith@premium.com</p>}
                  </div>
                  <div className="card-section">
                    <label>Flavor Profile</label>
                    {isEditing ? (
                      <select className="premium-select">
                        <option>Extra Spicy</option>
                        <option>Medium / Balanced</option>
                        <option>Mild / Aromatic</option>
                        <option>Experimental</option>
                      </select>
                    ) : (
                      <p className="gold-text-small">Medium / Balanced</p>
                    )}
                  </div>
                </div>

                <div className="info-card">
                  <div className="card-section">
                    <label>Primary Shipping Address</label>
                    {isEditing ? (
                      <textarea defaultValue="123 Gourmet Lane, Spice District, NY 10001, USA" />
                    ) : (
                      <p>123 Gourmet Lane, Spice District, NY 10001, USA</p>
                    )}
                  </div>
                  <div className="card-section">
                    <label>Security Status</label>
                    <div className="tier-info">
                      <span className="status-tag delivered" style={{ width: 'fit-content' }}>Verified Account</span>
                      <span className="since">Member since May 2022</span>
                    </div>
                  </div>
                </div>
              </div>
              {isEditing && <button className="btn-save-profile">Save Changes</button>}
            </div>
          )}

          {/* Past Journeys (History) Tab */}
          {activeTab === 'history' && (
            <div className="tab-view">
              <div className="view-header">
                <div>
                  <h2>Past <span>Journeys</span></h2>
                  <p>A history of your exceptional flavors</p>
                </div>
              </div>

              <div className="history-table-container">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Order Reference</th>
                      <th>Date</th>
                      <th>Selection</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderHistory.map((order, index) => (
                      <tr key={order.id} style={{ animationDelay: `${index * 0.05}s` }}>
                        <td className="order-id-cell">{order.id}</td>
                        <td>{order.date}</td>
                        <td><span className="type-tag">{order.type}</span></td>
                        <td className="total-cell">${order.total.toFixed(2)}</td>
                        <td><span className="status-tag delivered">Delivered</span></td>
                        <td><button className="btn-reorder">Reorder <ChevronRight size={14} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'settings' && (
            <div className="tab-view">
              <div className="view-header">
                <div>
                  <h2>Preferences <span>& Safety</span></h2>
                  <p>Customize your digital experience</p>
                </div>
              </div>

              <div className="settings-grid-premium">
                <div className="settings-card-luxury">
                  <div className="card-icon-header">
                    <Bell size={20} />
                    <h3>Notifications</h3>
                  </div>
                  <div className="setting-row">
                    <div className="text">
                      <h4>New Harvest Alerts</h4>
                      <p>Be the first to know about new arrivals</p>
                    </div>
                    <label className="ios-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="setting-row">
                    <div className="text">
                      <h4>Newsletter</h4>
                      <p>Monthly artisanal recipes and tips</p>
                    </div>
                    <label className="ios-switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>

                <div className="settings-card-luxury">
                  <div className="card-icon-header">
                    <CreditCard size={20} />
                    <h3>Experience</h3>
                  </div>
                  <div className="setting-row">
                    <div className="text">
                      <h4>Currency</h4>
                      <p>Set your primary payment unit</p>
                    </div>
                    <select className="premium-select">
                      <option>USD ($)</option>
                      <option>LKR (Rs)</option>
                      <option>EUR (€)</option>
                    </select>
                  </div>
                  <div className="setting-row">
                    <div className="text">
                      <h4>Language</h4>
                      <p>Default interface language</p>
                    </div>
                    <select className="premium-select">
                      <option>English</option>
                      <option>Sinhala</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;


