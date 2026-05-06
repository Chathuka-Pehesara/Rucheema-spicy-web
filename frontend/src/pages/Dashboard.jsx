import React, { useState, useEffect } from 'react';
import { Package, Heart, User, Settings, LogOut, Clock, Trash2, ShoppingBag, Edit2, Shield, CreditCard, Bell, ChevronRight, Award, Home, BarChart3, FileText, Globe, Layers, Users, DollarSign, Plus, Search, Download, Trash, TrendingUp, TrendingDown, MapPin } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, Legend
} from 'recharts';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { GoogleMap, MarkerF, useJsApiLoader, InfoWindowF, OverlayViewF } from '@react-google-maps/api';
import './Dashboard.css';

const CITY_COORDS = {
  'Colombo': { lat: 6.9271, lng: 79.8612 },
  'Dehiwala': { lat: 6.8485, lng: 79.8732 },
  'Kotte': { lat: 6.9061, lng: 79.9197 },
  'Kandy': { lat: 7.2906, lng: 80.6337 },
  'Galle': { lat: 6.0535, lng: 80.2210 },
  'Jaffna': { lat: 9.6615, lng: 80.0255 },
  'Negombo': { lat: 7.2089, lng: 79.8351 },
  'Anuradhapura': { lat: 8.3114, lng: 80.4037 },
  'Ratnapura': { lat: 6.6828, lng: 80.3992 },
  'Matara': { lat: 5.9549, lng: 80.5550 },
  'Kurunegala': { lat: 7.4863, lng: 80.3647 },
  'Trincomalee': { lat: 8.5873, lng: 81.2152 },
  'Batticaloa': { lat: 7.7307, lng: 81.6747 },
  'Nuwara Eliya': { lat: 6.9497, lng: 80.7891 },
  'Badulla': { lat: 6.9934, lng: 81.0550 }
};

const UserIntelligenceTab = ({ userStats, currentUser }) => {
  const cityBreakdown = userStats.cityBreakdown || {};
  const [selectedCity, setSelectedCity] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    styles: [
      {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#7c93a3" }, { "lightness": "-10" }]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#f0f4f8" }]
      },
      {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{ "color": "#ffffff" }]
      }
    ]
  };
  const maxCount = Math.max(1, ...Object.values(cityBreakdown).length ? Object.values(cityBreakdown) : [1]);

  return (
    <div className="tab-view">
      <div className="view-header">
        <div>
          <h2>User <span>Intelligence</span></h2>
          <p>Live user distribution across Sri Lanka and global accounts</p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="ui-stat-row">
        <div className="ui-stat-card">
          <div className="ui-stat-icon total"><Users size={28} /></div>
          <div className="ui-stat-info">
            <span>Total Accounts</span>
            <h3>{userStats.totalUsers.toLocaleString()}</h3>
          </div>
        </div>
        <div className="ui-stat-card">
          <div className="ui-stat-icon sl"><Globe size={28} /></div>
          <div className="ui-stat-info">
            <span>Sri Lanka Users</span>
            <h3>{userStats.slUsers.toLocaleString()}</h3>
          </div>
        </div>
        <div className="ui-stat-card">
          <div className="ui-stat-icon session"><Shield size={28} /></div>
          <div className="ui-stat-info">
            <span>Live Active Users</span>
            <h3>{userStats.liveUsers || 0} <small style={{fontSize:'0.75rem', color:'#00c853'}}>● Live</small></h3>
          </div>
        </div>
        <div className="ui-stat-card">
          <div className="ui-stat-icon cities"><Award size={28} /></div>
          <div className="ui-stat-info">
            <span>Active Cities</span>
            <h3>{Object.keys(cityBreakdown).length}</h3>
          </div>
        </div>
      </div>

      {/* ── SL Map + Breakdown ── */}
      <div className="ui-map-section">
        <div className="ui-map-card">
          <div className="ui-map-header">
            <span className="ui-map-badge">🟢 Live</span>
            <h3>Sri Lanka — User Distribution Map</h3>
            <p>Green pulsing indicators show registered user city locations</p>
          </div>
          <div className="ui-map-wrapper" style={{ height: '500px', width: '100%', padding: '0' }}>
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={{ lat: 7.8731, lng: 80.7718 }}
                zoom={7}
                options={mapOptions}
              >
                {Object.entries(cityBreakdown).map(([city, count]) => {
                  const position = CITY_COORDS[city];
                  if (!position) return null;

                  // Animated SVG pulsing icon for MarkerF
                  const pulseSvg = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="6" fill="#00c853" stroke="white" stroke-width="2" />
                      <circle cx="20" cy="20" r="6" fill="none" stroke="#00c853" stroke-width="2">
                        <animate attributeName="r" from="6" to="18" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                  `;

                  return (
                    <MarkerF
                      key={city}
                      position={position}
                      title={`${city}: ${count} active users`}
                      onClick={() => setSelectedCity({ city, count, position })}
                      icon={{
                        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(pulseSvg)}`,
                        scaledSize: { width: 40, height: 40 },
                        anchor: { x: 20, y: 20 }
                      }}
                    />
                  );
                })}

                {selectedCity && (
                  <InfoWindowF
                    position={selectedCity.position}
                    onCloseClick={() => setSelectedCity(null)}
                  >
                    <div className="map-tooltip">
                      <h4 style={{ margin: '0 0 5px 0', color: '#1a0f0a' }}>{selectedCity.city}</h4>
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>{selectedCity.count} Active Users</p>
                    </div>
                  </InfoWindowF>
                )}
              </GoogleMap>
            ) : (
              <div className="map-loading-placeholder">Initializing Executive Map Service...</div>
            )}
          </div>
        </div>

        {/* City Breakdown Table */}
        <div className="ui-city-breakdown">
          <h3>City Breakdown</h3>
          {Object.keys(cityBreakdown).length === 0 ? (
            <p className="no-data-note">
              No city data yet. Users must select their city during registration or profile setup.
            </p>
          ) : (
            <div className="city-table">
              {Object.entries(cityBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([city, count]) => (
                  <div key={city} className="city-row">
                    <span className="city-name"><span className="pulse-mini">●</span> {city}</span>
                    <div className="city-bar-track">
                      <div className="city-bar-fill" style={{ width: `${(count / maxCount) * 100}%` }} />
                    </div>
                    <span className="city-count">{count} user{count !== 1 ? 's' : ''}</span>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────── */

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
  const [userStats, setUserStats] = useState({ 
    totalUsers: 0, 
    slUsers: 0, 
    liveUsers: 0,
    cityBreakdown: {} 
  });

  // Fetch live user stats (owner/admin only)
  useEffect(() => {
    if (user?.token) {
      fetch('http://localhost:5000/api/users/stats', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then(r => r.json())
        .then(data => { if (data.totalUsers !== undefined) setUserStats(data); })
        .catch(() => {});
    }
  }, [user]);

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

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error('Fetch products error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const reportTypes = [
    { id: 'sales', title: 'Sales Performance', description: 'Monthly and weekly revenue breakdowns', icon: <BarChart3 size={24} /> },
    { id: 'inventory', title: 'Inventory Health', description: 'Stock levels and procurement needs', icon: <Package size={24} /> },
    { id: 'users', title: 'User Engagement', description: 'Login frequency and traffic sources', icon: <Users size={24} /> },
    { id: 'financial', title: 'Financial Audit', description: 'Detailed P&L and expense logs', icon: <DollarSign size={24} /> },
  ];

  const menuItems = [
    { id: 'analytics',  name: 'Analytics',         icon: <BarChart3 size={20} /> },
    { id: 'livemap',    name: 'User Intelligence',  icon: <Globe size={20} /> },
    { id: 'collections',name: 'Collections',        icon: <Layers size={20} /> },
    { id: 'reports',    name: 'Executive Reports',  icon: <FileText size={20} /> },
    { id: 'financials', name: 'Financials',          icon: <CreditCard size={20} /> },
    { id: 'insights',   name: 'Insights',            icon: <Globe size={20} /> },
    { id: 'orders',     name: 'Active Orders',       icon: <Package size={20} /> },
    { id: 'profile',    name: 'Profile Identity',    icon: <User size={20} /> },
    { id: 'settings',   name: 'Preferences',         icon: <Settings size={20} /> },
  ];

  const handleOpenModal = (product = null) => {
    if (product) {
      setCurrentProduct(product);
      setFormData({ 
        name: product.name, 
        category: product.category, 
        price: product.price, 
        stock: product.countInStock, 
        status: product.countInStock > 10 ? 'active' : (product.countInStock > 0 ? 'stock-low' : 'out-of-stock'), 
        image: product.image,
        description: product.description || '',
        origin: product.origin || 'Sri Lanka',
        spiceLevel: product.spiceLevel || 1
      });
    } else {
      setCurrentProduct(null);
      setFormData({ 
        name: '', 
        category: 'Whole Spices', 
        price: '', 
        stock: '', 
        status: 'active', 
        image: '',
        description: '',
        origin: 'Sri Lanka',
        spiceLevel: 1
      });
    }
    setShowProductModal(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    const productData = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      countInStock: Number(formData.stock),
      image: formData.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800',
      description: formData.description,
      origin: formData.origin,
      spiceLevel: Number(formData.spiceLevel)
    };

    try {
      const url = currentProduct 
        ? `http://localhost:5000/api/products/${currentProduct._id}` 
        : 'http://localhost:5000/api/products';
      
      const method = currentProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        alert('Item successfully added to your collection!');
        fetchProducts();
        setShowProductModal(false);
        setFormData({ name: '', category: 'Whole Spices', price: '', stock: '', status: 'active', image: '', description: '', origin: 'Sri Lanka', spiceLevel: 1 });
      } else {
        const errData = await res.json();
        alert(errData.message || 'Failed to sync with collection');
      }
    } catch (err) {
      console.error('Save product error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this artisanal masterpiece?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (res.ok) {
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error('Delete product error:', err);
    }
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
                  <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
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
                  <span>Total Accounts</span>
                  <h3>{userStats.totalUsers.toLocaleString()} <small style={{fontSize: '0.8rem', color: '#d4af37'}}>users</small></h3>
                </div>
                <div className="metric-card-dash">
                  <span>SL Users</span>
                  <h3>{userStats.slUsers.toLocaleString()} <small style={{fontSize: '0.8rem', color: '#00c853'}}>local</small></h3>
                </div>
              </div>
            </div>
          )}

          {/* User Intelligence / Live Map Tab */}
          {activeTab === 'livemap' && (
            <UserIntelligenceTab userStats={userStats} currentUser={user} />
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
                    {loading ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '4rem' }}>
                          <div className="loading-spinner-executive" style={{ margin: '0 auto 1rem' }}></div>
                          <p style={{ color: '#666', fontWeight: 600 }}>Fetching your artisanal catalog...</p>
                        </td>
                      </tr>
                    ) : products.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '5rem' }}>
                          <div style={{ opacity: 0.3, marginBottom: '1.5rem' }}>
                            <Layers size={64} style={{ margin: '0 auto' }} />
                          </div>
                          <h3 style={{ color: '#1a0f0a', marginBottom: '0.5rem' }}>No items in collection</h3>
                          <p style={{ color: '#666' }}>Your luxury spice catalog is currently empty. Click "Add New Item" to start.</p>
                        </td>
                      </tr>
                    ) : (
                      products.map(p => {
                        const status = p.countInStock > 10 ? 'active' : (p.countInStock > 0 ? 'stock-low' : 'out-of-stock');
                        return (
                          <tr key={p._id}>
                            <td className="product-cell-dash">
                              <img src={p.image} alt={p.name} />
                              <div>
                                <strong>{p.name}</strong>
                                <small style={{ display: 'block', color: '#888', fontSize: '0.7rem' }}>{p.origin}</small>
                              </div>
                            </td>
                            <td>{p.category}</td>
                            <td className="price-text">${Number(p.price).toFixed(2)}</td>
                            <td>{p.countInStock} units</td>
                            <td>
                              <span className={`status-pill ${status}`}>
                                {status.replace('-', ' ')}
                              </span>
                            </td>
                            <td className="action-buttons">
                              <button className="icon-btn-dash edit" onClick={() => handleOpenModal(p)} title="Edit Product"><Edit2 size={16} /></button>
                              <button className="icon-btn-dash delete" onClick={() => handleDeleteProduct(p._id)} title="Delete Product"><Trash size={16} /></button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (No Horizontal Scroll) */}
              <div className="collection-mobile-grid mobile-only">
                {products.map(p => {
                  const status = p.countInStock > 10 ? 'active' : (p.countInStock > 0 ? 'stock-low' : 'out-of-stock');
                  return (
                    <div key={p._id} className="collection-mobile-card">
                      <div className="card-top">
                        <img src={p.image} alt={p.name} />
                        <div className="name-cat">
                          <h4>{p.name}</h4>
                          <span>{p.category}</span>
                        </div>
                        <span className={`status-pill ${status}`}>{status.replace('-', ' ')}</span>
                      </div>
                      <div className="card-details">
                        <div className="detail-item">
                          <label>Price</label>
                          <p>${Number(p.price).toFixed(2)}</p>
                        </div>
                        <div className="detail-item">
                          <label>Stock</label>
                          <p>{p.countInStock} units</p>
                        </div>
                      </div>
                      <div className="card-actions">
                        <button className="btn-mobile-action edit" onClick={() => handleOpenModal(p)}>
                          <Edit2 size={16} /> Edit
                        </button>
                        <button className="btn-mobile-action delete" onClick={() => handleDeleteProduct(p._id)}>
                          <Trash size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
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
            <form onSubmit={handleSaveProduct} className="modal-form-wrapper-dash">
              <div className="modal-body-dash">
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
                  <div className="form-group-dash full-width">
                    <label>Description</label>
                    <textarea 
                      value={formData.description} 
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                      placeholder="Describe your artisanal spice masterpiece..."
                      required
                      style={{ 
                        width: '100%', 
                        padding: '15px', 
                        borderRadius: '15px', 
                        border: '1px solid #e0e0e0', 
                        minHeight: '120px', 
                        fontFamily: 'inherit',
                        background: '#fafafa',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  <div className="form-group-dash">
                    <label>Origin</label>
                    <input 
                      type="text" 
                      value={formData.origin} 
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })} 
                      placeholder="e.g. Matale, Sri Lanka"
                    />
                  </div>
                  <div className="form-group-dash">
                    <label>Spice Level (1-5)</label>
                    <input 
                      type="number" 
                      min="1" max="5"
                      value={formData.spiceLevel} 
                      onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value })} 
                    />
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


