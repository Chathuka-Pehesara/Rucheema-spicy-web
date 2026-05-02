import React, { useState, useEffect } from 'react';
import { Package, Heart, User, Settings, LogOut, Clock, Trash2, ShoppingBag, Edit2, Shield, CreditCard, Bell, ChevronRight, Award, Home, BarChart3, FileText, Globe, Layers, Users, DollarSign, Plus, Search, Download, Trash, TrendingUp, TrendingDown } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, Legend
} from 'recharts';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');
  const { wishlist, toggleWishlist, addToCart } = useShop();
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: 'Whole Spices', price: '', stock: '', status: 'active', image: '' });
  const [profileImage, setProfileImage] = useState(user?.avatar || "https://i.pravatar.cc/150?u=owner");
  const [profileData, setProfileData] = useState({ name: user?.name || 'Alexander Smith', email: user?.email || 'alexander@rucheema.com' });

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Mock Data for Owner
  const salesData = [
    { name: 'Mon', revenue: 4500, profit: 3200 },
    { name: 'Tue', revenue: 5200, profit: 3800 },
    { name: 'Wed', revenue: 4800, profit: 3500 },
    { name: 'Thu', revenue: 6100, profit: 4600 },
    { name: 'Fri', revenue: 5900, profit: 4200 },
    { name: 'Sat', revenue: 7200, profit: 5400 },
    { name: 'Sun', revenue: 6800, profit: 5100 },
  ];

  const financialData = [
    { month: 'Jan', income: 45000, expenses: 32000 },
    { month: 'Feb', income: 52000, expenses: 34000 },
    { month: 'Mar', income: 48000, expenses: 31000 },
    { month: 'Apr', income: 61000, expenses: 38000 },
    { month: 'May', income: 59000, expenses: 36000 },
    { month: 'Jun', income: 72000, expenses: 42000 },
  ];

  const [products, setProducts] = useState([
    { id: 1, name: 'Ceylon Cinnamon Sticks', category: 'Whole Spices', price: 24.90, stock: 45, status: 'active' },
    { id: 2, name: 'Premium Kashmiri Saffron', category: 'Rare Blends', price: 89.50, stock: 12, status: 'stock-low' },
    { id: 3, name: 'Smoked Paprika Powder', category: 'Powders', price: 15.20, stock: 88, status: 'active' },
    { id: 4, name: 'Artisanal Curry Blend', category: 'Rare Blends', price: 22.00, stock: 0, status: 'out-of-stock' },
  ]);

  const reportTypes = [
    { id: 'sales', title: 'Sales Performance', description: 'Monthly and weekly revenue breakdowns', icon: <BarChart3 size={24} /> },
    { id: 'inventory', title: 'Inventory Health', description: 'Stock levels and procurement needs', icon: <Package size={24} /> },
    { id: 'users', title: 'User Engagement', description: 'Login frequency and traffic sources', icon: <Users size={24} /> },
    { id: 'financial', title: 'Financial Audit', description: 'Detailed P&L and expense logs', icon: <DollarSign size={24} /> },
  ];

  const menuItems = [
    { id: 'analytics', name: 'Analytics', icon: <BarChart3 size={20} /> },
    { id: 'collections', name: 'Collections', icon: <Layers size={20} /> },
    { id: 'reports', name: 'Executive Reports', icon: <FileText size={20} /> },
    { id: 'financials', name: 'Financials', icon: <CreditCard size={20} /> },
    { id: 'insights', name: 'Insights', icon: <Globe size={20} /> },
    { id: 'orders', name: 'Active Orders', icon: <Package size={20} /> },
    { id: 'profile', name: 'Profile Identity', icon: <User size={20} /> },
    { id: 'settings', name: 'Preferences', icon: <Settings size={20} /> },
  ];

  const handleOpenModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({ ...product });
    } else {
      setCurrentProduct(null);
      setFormData({ name: '', category: 'Whole Spices', price: '', stock: '', status: 'active', image: '' });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (currentProduct) {
      setProducts(products.map(p => p.id === currentProduct.id ? { ...formData, id: p.id } : p));
    } else {
      setProducts([...products, { ...formData, id: Date.now() }]);
    }
    setShowProductModal(false);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-hero-bg"></div>
      <div className="container dashboard-container">
        
        {/* Mobile Toggle Button */}
        <button className="mobile-sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          <ChevronRight size={24} style={{ transform: isSidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
        </button>

        {/* Sidebar Navigation */}
        <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="profile-header-card">
            <div className="avatar-wrapper">
              <img src={user?.avatar || "https://i.pravatar.cc/150?u=owner"} alt="Profile" />
              <div className="status-indicator"></div>
            </div>
            <div className="user-info">
              <h3>{user?.name || 'Alexander Smith'}</h3>
              <div className="member-badge">
                <Shield size={12} /> {user?.role?.toUpperCase()}
              </div>
            </div>
          </div>

          <nav className="dashboard-menu">
            <Link to="/" className="menu-item home-link">
              <span className="icon-box"><Home size={20} /></span>
              <span className="item-name">Go to Home</span>
            </Link>
            <div className="menu-divider"></div>
            
            {menuItems.map((item, index) => (
              <button 
                key={item.id} 
                className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false); // Close sidebar on mobile after selection
                }}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <span className="icon-box">{item.icon}</span>
                <span className="item-name">{item.name}</span>
              </button>
            ))}
            <button className="menu-item logout" onClick={logout}>
              <span className="icon-box"><LogOut size={20} /></span>
              <span className="item-name">Logout</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="dashboard-content">
          
          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="tab-view">
              <div className="view-header">
                <div>
                  <h2>Executive <span>Analytics</span></h2>
                  <p>Performance overview and growth metrics</p>
                </div>
              </div>
              
              <div className="charts-grid-dash">
                <div className="chart-card-dash">
                  <h4>Revenue vs Profit Analysis</h4>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#8b0000" name="Revenue" />
                        <Bar dataKey="profit" fill="#d4af37" name="Profit" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="metrics-row-dash">
                <div className="metric-card-dash">
                  <span>Growth</span>
                  <h3>+18.5%</h3>
                </div>
                <div className="metric-card-dash">
                  <span>Efficiency</span>
                  <h3>92%</h3>
                </div>
                <div className="metric-card-dash">
                  <span>Logged Users</span>
                  <h3>1,240 <small style={{fontSize: '0.8rem', color: '#00c853'}}>Online</small></h3>
                </div>
                <div className="metric-card-dash">
                  <span>Market Share</span>
                  <h3>12%</h3>
                </div>
              </div>
            </div>
          )}

          {/* Collections Management Tab */}
          {activeTab === 'collections' && (
            <div className="tab-view">
              <div className="view-header">
                <div>
                  <h2>Collection <span>Management</span></h2>
                  <p>Add, edit, and manage your artisanal spice catalog</p>
                </div>
                <div className="header-actions">
                   <button 
                     className="btn-edit active" 
                     style={{display: 'flex', alignItems: 'center', gap: '8px'}}
                     onClick={() => handleOpenModal()}
                   >
                     <Plus size={18} /> Add New Item
                   </button>
                </div>
              </div>

              <div className="collection-controls">
                <div className="search-bar-dash">
                  <Search size={18} />
                  <input type="text" placeholder="Search your collection..." />
                </div>
                <div className="filter-group-dash">
                  <button className="btn-filter-dash"><Plus size={16} rotate={45} /> All Categories</button>
                  <button className="btn-filter-dash">Status: All</button>
                  <button className="btn-filter-dash sort">Sort: Stock Low</button>
                </div>
              </div>
              
              {/* Desktop Table View */}
              <div className="history-table-container premium-table-card desktop-only">
                <table className="history-table premium-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td className="product-cell-dash">
                          <img src={`https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=100&u=${p.id}`} alt={p.name} />
                          <span>{p.name}</span>
                        </td>
                        <td>{p.category}</td>
                        <td className="price-text">${Number(p.price).toFixed(2)}</td>
                        <td>{p.stock} units</td>
                        <td>
                          <span className={`status-pill ${p.status}`}>
                            {p.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="action-buttons">
                          <button className="icon-btn-dash edit" onClick={() => handleOpenModal(p)}><Edit2 size={16} /></button>
                          <button className="icon-btn-dash delete" onClick={() => setProducts(products.filter(item => item.id !== p.id))}><Trash size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (No Horizontal Scroll) */}
              <div className="collection-mobile-grid mobile-only">
                {products.map(p => (
                  <div key={p.id} className="collection-mobile-card">
                    <div className="card-top">
                      <img src={`https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=100&u=${p.id}`} alt={p.name} />
                      <div className="name-cat">
                        <h4>{p.name}</h4>
                        <span>{p.category}</span>
                      </div>
                      <span className={`status-pill ${p.status}`}>{p.status.replace('-', ' ')}</span>
                    </div>
                    <div className="card-details">
                      <div className="detail-item">
                        <label>Price</label>
                        <p>${Number(p.price).toFixed(2)}</p>
                      </div>
                      <div className="detail-item">
                        <label>Stock</label>
                        <p>{p.stock} units</p>
                      </div>
                    </div>
                    <div className="card-actions">
                      <button className="btn-mobile-action edit" onClick={() => handleOpenModal(p)}>
                        <Edit2 size={16} /> Edit
                      </button>
                      <button className="btn-mobile-action delete" onClick={() => setProducts(products.filter(item => item.id !== p.id))}>
                        <Trash size={16} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Executive Reports Tab */}
          {activeTab === 'reports' && (
            <div className="tab-view">
              <div className="view-header">
                <div>
                  <h2>Executive <span>Reports</span></h2>
                  <p>Comprehensive business intelligence and audits</p>
                </div>
              </div>
              
              <div className="reports-grid">
                {reportTypes.map((report, idx) => (
                  <div key={report.id} className="report-card-premium" style={{animationDelay: `${idx * 0.1}s`}}>
                    <div className="report-icon-box">
                      {report.icon}
                    </div>
                    <div className="report-info">
                      <h3>{report.title}</h3>
                      <p>{report.description}</p>
                    </div>
                    <button className="btn-generate-report">
                      <Download size={18} /> Generate
                    </button>
                  </div>
                ))}
              </div>

              <div className="recent-reports-section">
                <h3>Recently Generated</h3>
                <div className="recent-report-item">
                  <div className="file-info">
                    <FileText size={20} />
                    <span>Q1_Financial_Summary.pdf</span>
                  </div>
                  <span className="date">Generated 2 hours ago</span>
                  <button className="btn-download-small">Download</button>
                </div>
                <div className="recent-report-item">
                  <div className="file-info">
                    <FileText size={20} />
                    <span>Inventory_Audit_May.csv</span>
                  </div>
                  <span className="date">Generated Yesterday</span>
                  <button className="btn-download-small">Download</button>
                </div>
              </div>
            </div>
          )}

          {/* Financials Tab */}
          {activeTab === 'financials' && (
            <div className="tab-view">
              <div className="view-header">
                <div>
                  <h2>Financial <span>Performance</span></h2>
                  <p>Detailed P&L and expense tracking</p>
                </div>
              </div>
              
              <div className="financial-summary-cards">
                <div className="f-card income">
                  <div className="f-icon"><TrendingUp size={24} /></div>
                  <div className="f-data">
                    <span>Total Income</span>
                    <h4>$346,000</h4>
                  </div>
                </div>
                <div className="f-card expenses">
                  <div className="f-icon"><TrendingDown size={24} /></div>
                  <div className="f-data">
                    <span>Total Expenses</span>
                    <h4>$213,000</h4>
                  </div>
                </div>
                <div className="f-card profit">
                  <div className="f-icon"><Award size={24} /></div>
                  <div className="f-data">
                    <span>Net Margin</span>
                    <h4>38.4%</h4>
                  </div>
                </div>
              </div>

              <div className="history-table-container premium-shadow">
                <div className="table-header-luxury">
                   <h3>Profit & Loss Analytics</h3>
                   <button className="btn-download-statement">
                     <Download size={16} /> Export Statement
                   </button>
                </div>
                <table className="history-table professional-table">
                  <thead>
                    <tr>
                      <th>Fiscal Month</th>
                      <th>Gross Income</th>
                      <th>Operating Expenses</th>
                      <th>Net Profit</th>
                      <th>Profit Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.map((f, idx) => (
                      <tr key={f.month} style={{animationDelay: `${idx * 0.05}s`}}>
                        <td>
                          <div className="month-cell">
                            <Clock size={14} /> {f.month} 2024
                          </div>
                        </td>
                        <td className="income-text">+ ${f.income.toLocaleString()}</td>
                        <td className="expense-text">- ${f.expenses.toLocaleString()}</td>
                        <td className="profit-cell">
                          <span className="profit-badge">${(f.income - f.expenses).toLocaleString()}</span>
                        </td>
                        <td>
                          <div className="margin-track">
                            <div className="margin-bar" style={{width: `${((f.income - f.expenses)/f.income)*100}%`}}></div>
                            <span>{(((f.income - f.expenses)/f.income)*100).toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Insights Tab */}
          {activeTab === 'insights' && (
            <div className="tab-view">
              <div className="view-header">
                <div>
                  <h2>Market <span>Insights</span></h2>
                  <p>Strategic data for future growth</p>
                </div>
              </div>
              
              <div className="insights-grid-dash">
                <div className="insight-item">
                  <Globe size={32} />
                  <h4>Global Trends</h4>
                  <p>Rising demand for organic turmeric in European markets. Opportunity for expansion.</p>
                </div>
                <div className="insight-item">
                  <Award size={32} />
                  <h4>Quality Benchmark</h4>
                  <p>Richeema Spicy maintains a 98% quality rating compared to industry average of 85%.</p>
                </div>
              </div>
            </div>
          )}

          {/* Active Orders Tab */}
          {activeTab === 'orders' && (
            <div className="tab-view">
              <div className="view-header">
                <div>
                  <h2>Recent <span>Activity</span></h2>
                  <p>High-priority business operations</p>
                </div>
              </div>
              
              <div className="order-grid">
                <div className="order-item-card">
                  <div className="card-top">
                    <div className="order-meta">
                      <span className="id">Business Shipment #RS-9982</span>
                      <span className="date">Oct 24, 2023 • Bulk Order</span>
                    </div>
                    <div className="status-chip in-transit">In Transit</div>
                  </div>
                  <div className="card-body">
                    <p>Shipment of 500kg Premium Cinnamon to Export Terminal.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Identity Tab */}
          {activeTab === 'profile' && (
            <div className="tab-view profile-view-executive">
              <div className="view-header">
                <div>
                  <h2>Executive <span>Identity</span></h2>
                  <p>Manage your professional credentials and presence</p>
                </div>
                <button className={`btn-edit ${isEditing ? 'active' : ''}`} onClick={() => setIsEditing(!isEditing)}>
                  {isEditing ? 'Cancel' : <><Edit2 size={16} /> Edit Account</>}
                </button>
              </div>

              <div className="profile-hero-card">
                <div className="profile-image-edit">
                  <div className="avatar-preview-large">
                    <img src={profileImage} alt="Profile" />
                    {isEditing && (
                      <div className="image-overlay-edit">
                        <Plus size={24} />
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) setProfileImage(URL.createObjectURL(file));
                          }} 
                        />
                      </div>
                    )}
                  </div>
                  <div className="profile-titles">
                    <h3>{profileData.name}</h3>
                    <p className="role-badge">{user?.role?.toUpperCase()}</p>
                  </div>
                </div>
              </div>

              <div className="profile-details-grid compact">
                <div className="info-card-premium">
                  <div className="card-section-compact">
                    <label>Personal Designation</label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={profileData.name} 
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    ) : <p>{profileData.name}</p>}
                  </div>
                  <div className="card-section-compact">
                    <label>Corporate Correspondence</label>
                    {isEditing ? (
                      <input 
                        type="email" 
                        value={profileData.email} 
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    ) : <p>{profileData.email}</p>}
                  </div>
                </div>
                <div className="info-card-premium">
                  <div className="card-section-compact">
                    <label>Privilege Tier</label>
                    <p className="gold-text-executive">System Administrator / Owner</p>
                  </div>
                  <div className="card-section-compact">
                    <label>Account Security</label>
                    <p>Enhanced Encryption Enabled</p>
                  </div>
                </div>
              </div>
              {isEditing && (
                <div className="profile-actions-footer">
                  <button className="btn-save-executive" onClick={() => setIsEditing(false)}>
                    Confirm Profile Updates
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'settings' && (
            <div className="tab-view">
              <div className="view-header">
                <div>
                  <h2>System <span>Preferences</span></h2>
                  <p>Customize your reporting experience</p>
                </div>
              </div>

              <div className="settings-grid-premium">
                <div className="settings-card-luxury">
                  <div className="card-icon-header">
                    <Bell size={20} />
                    <h3>Reporting Alerts</h3>
                  </div>
                  <div className="setting-row">
                    <div className="text">
                      <h4>Daily Summary</h4>
                      <p>Receive EOD performance reports</p>
                    </div>
                    <label className="ios-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
      {/* Product Add/Edit Modal */}
      {showProductModal && (
        <div className="owner-modal-overlay">
          <div className="owner-modal-content">
            <div className="modal-header-dash">
              <h3>{currentProduct ? 'Edit Collection Item' : 'Add New Item'}</h3>
              <button className="btn-close-modal" onClick={() => setShowProductModal(false)}><Plus size={24} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            <form onSubmit={handleSaveProduct} className="modal-form-dash">
              <div className="form-grid-dash">
                <div className="form-group-dash">
                  <label>Product Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="e.g. Ceylon Cinnamon"
                    required 
                  />
                </div>
                <div className="form-group-dash">
                  <label>Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                    <option>Whole Spices</option>
                    <option>Powders</option>
                    <option>Rare Blends</option>
                    <option>Gift Sets</option>
                  </select>
                </div>
                <div className="form-group-dash">
                  <label>Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                    placeholder="24.99"
                    required 
                  />
                </div>
                <div className="form-group-dash">
                  <label>Stock Units</label>
                  <input 
                    type="number" 
                    value={formData.stock} 
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })} 
                    placeholder="100"
                    required 
                  />
                </div>
                <div className="form-group-dash">
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="active">Active</option>
                    <option value="stock-low">Stock Low</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>
                <div className="form-group-dash full-width">
                  <label>Image URL</label>
                  <input 
                    type="text" 
                    value={formData.image} 
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })} 
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>
              <div className="modal-footer-dash">
                <button type="button" className="btn-cancel-dash" onClick={() => setShowProductModal(false)}>Cancel</button>
                <button type="submit" className="btn-save-dash">
                  {currentProduct ? 'Save Changes' : 'Add to Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;


