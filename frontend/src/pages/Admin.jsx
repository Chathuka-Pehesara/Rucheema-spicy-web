import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart3, Users, ShoppingBag, DollarSign, Plus, Search, 
  Bell, LogOut, ChevronRight, Package, LayoutDashboard, 
  Layers, Settings, FileText, Download, TrendingUp, UserCheck,
  Home, PieChart as PieIcon, TrendingDown, Activity, Globe, Briefcase, Trash, User, Edit2, Shield
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, Legend
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

const Admin = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || 'admin';
  const [activeView, setActiveView] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.avatar || "https://i.pravatar.cc/150?u=admin");
  const [profileData, setProfileData] = useState({ name: user?.name || 'Admin Manager', email: user?.email || 'admin@rucheema.com' });

  // Mock Data
  const salesData = [
    { name: 'Mon', revenue: 4500, orders: 120, profit: 3200 },
    { name: 'Tue', revenue: 5200, orders: 145, profit: 3800 },
    { name: 'Wed', revenue: 4800, orders: 130, profit: 3500 },
    { name: 'Thu', revenue: 6100, orders: 160, profit: 4600 },
    { name: 'Fri', revenue: 5900, orders: 155, profit: 4200 },
    { name: 'Sat', revenue: 7200, orders: 190, profit: 5400 },
    { name: 'Sun', revenue: 6800, orders: 180, profit: 5100 },
  ];

  const financialData = [
    { month: 'Jan', income: 45000, expenses: 32000 },
    { month: 'Feb', income: 52000, expenses: 34000 },
    { month: 'Mar', income: 48000, expenses: 31000 },
    { month: 'Apr', income: 61000, expenses: 38000 },
    { month: 'May', income: 59000, expenses: 36000 },
    { month: 'Jun', income: 72000, expenses: 42000 },
  ];

  const categoryData = [
    { name: 'Whole Spices', value: 45 },
    { name: 'Powders', value: 30 },
    { name: 'Rare Blends', value: 15 },
    { name: 'Gift Sets', value: 10 },
  ];

  const COLORS = ['#8b0000', '#d4af37', '#1a0f0a', '#606060'];

  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const data = await res.json();
      setProductList(data);
      setLoading(false);
    } catch (err) {
      console.error('Admin fetch products error:', err);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const [orderList, setOrderList] = useState([
    { id: 'RS-1024', customer: 'Johnatan Doe', email: 'j.doe@premium.com', date: 'Oct 28, 2023', total: 124.50, status: 'active' },
    { id: 'RS-1025', customer: 'Sarah Miller', email: 's.miller@web.com', date: 'Oct 29, 2023', total: 89.90, status: 'pending' },
    { id: 'RS-1026', customer: 'Michael Chen', email: 'm.chen@service.net', date: 'Oct 30, 2023', total: 210.00, status: 'active' },
  ]);

  const [userList, setUserList] = useState([
    { id: 1, name: 'Elena Rodriguez', email: 'elena.r@artisanal.com', role: 'Premium Buyer', joinDate: 'Jan 12, 2023', status: 'active' },
    { id: 2, name: 'Marcus Thorne', email: 'm.thorne@spice.com', role: 'Standard Customer', joinDate: 'Feb 05, 2023', status: 'active' },
    { id: 3, name: 'Aria Song', email: 'aria.s@lifestyle.org', role: 'VIP Member', joinDate: 'Mar 20, 2023', status: 'pending' },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [modalTarget, setModalTarget] = useState('product'); // 'product', 'user', 'order'
  const [formData, setFormData] = useState({});

  const handleOpenModal = (target, mode, data = {}) => {
    setModalTarget(target);
    setModalMode(mode);
    setFormData(data);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (modalTarget === 'product') {
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
        const url = modalMode === 'edit' 
          ? `${import.meta.env.VITE_API_URL}/api/products/${formData._id}` 
          : `${import.meta.env.VITE_API_URL}/api/products`;
        
        const method = modalMode === 'edit' ? 'PUT' : 'POST';

        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(productData),
        });

        if (res.ok) {
          alert('Collection updated successfully!');
          fetchProducts();
          setShowModal(false);
          setFormData({});
        } else {
          const errData = await res.json();
          alert(errData.message || 'Failed to save product');
        }
      } catch (err) {
        console.error('Admin save error:', err);
      }
    } else {
      // Handle other targets locally for now
      setShowModal(false);
    }
  };

  const handleDeleteProductReal = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.ok) fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleDeleteProduct = (id) => {
    setProductList(productList.filter(p => p.id !== id));
  };

  const handleDeleteOrder = (id) => {
    setOrderList(orderList.filter(o => o.id !== id));
  };

  const handleDeleteUser = (id) => {
    setUserList(userList.filter(u => u.id !== id));
  };

  const renderKPIs = () => {
    if (role === 'owner') {
      return (
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon" style={{background: '#fff4e5', color: '#ff9800'}}><TrendingUp size={28} /></div>
            <div className="kpi-info">
              <span>Total Revenue</span>
              <h3>$142,500 <small className="growth">+12.5%</small></h3>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon" style={{background: '#e8f5e9', color: '#4caf50'}}><UserCheck size={28} /></div>
            <div className="kpi-info">
              <span>Customer Retention</span>
              <h3>68% <small className="growth">+4.2%</small></h3>
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon" style={{background: '#f3e5f5', color: '#9c27b0'}}><ShoppingBag size={28} /></div>
            <div className="kpi-info">
              <span>Average Order Value</span>
              <h3>$45.80 <small className="growth">+2.1%</small></h3>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon" style={{background: '#e3f2fd', color: '#2196f3'}}><ShoppingBag size={28} /></div>
          <div className="kpi-info">
            <span>Today's Orders</span>
            <h3>145</h3>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{background: '#fff3e0', color: '#ff9800'}}><Users size={28} /></div>
          <div className="kpi-info">
            <span>Active Users</span>
            <h3>1,240</h3>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{background: '#fce4ec', color: '#e91e63'}}><Package size={28} /></div>
          <div className="kpi-info">
            <span>Pending Stock</span>
            <h3>24 SKUs</h3>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-logo">
          <h2>Rucheema</h2>
          <span>{role.toUpperCase()} PANEL</span>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <label>General</label>
            <button className={`nav-item ${activeView === 'overview' ? 'active' : ''}`} onClick={() => setActiveView('overview')}>
              <LayoutDashboard size={20} /> <span>Dashboard</span>
            </button>
            <Link to="/" className="nav-item home-link">
              <span className="icon-box"><Home size={20} /></span> <span>Go to Home</span>
            </Link>
          </div>

          {role === 'admin' ? (
            <div className="nav-section">
              <label>Operations</label>
              <button className={`nav-item ${activeView === 'products' ? 'active' : ''}`} onClick={() => setActiveView('products')}>
                <Package size={20} /> <span>Products</span>
              </button>
              <button className={`nav-item ${activeView === 'orders' ? 'active' : ''}`} onClick={() => setActiveView('orders')}>
                <ShoppingBag size={20} /> <span>Orders</span>
              </button>
              <button className={`nav-item ${activeView === 'users' ? 'active' : ''}`} onClick={() => setActiveView('users')}>
                <Users size={20} /> <span>User Management</span>
              </button>
            </div>
          ) : (
            <div className="nav-section">
              <label>Executive Reports</label>
              <button className={`nav-item ${activeView === 'analytics' ? 'active' : ''}`} onClick={() => setActiveView('analytics')}>
                <BarChart3 size={20} /> <span>Analytics</span>
              </button>
              <button className={`nav-item ${activeView === 'financials' ? 'active' : ''}`} onClick={() => setActiveView('financials')}>
                <FileText size={20} /> <span>Financials</span>
              </button>
              <button className={`nav-item ${activeView === 'insights' ? 'active' : ''}`} onClick={() => setActiveView('insights')}>
                <Globe size={20} /> <span>Market Insights</span>
              </button>
            </div>
          )}

          <div className="nav-section">
            <label>System</label>
            <button 
              className={`nav-item ${activeView === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveView('settings')}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>
            <button 
              className={`nav-item ${activeView === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveView('profile')}
            >
              <User size={20} />
              <span>Profile</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout" onClick={logout}>
            <LogOut size={20} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <h1>{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h1>
          </div>
          <div className="topbar-right">
            <button className="icon-btn">
              <Bell size={22} />
              <span className="badge">4</span>
            </button>
            <div className="user-profile">
              <img src={user?.avatar || "https://i.pravatar.cc/150?u=admin"} alt="Admin" />
              <div className="user-text">
                <strong>{user?.name || 'Alex Smith'}</strong>
                <p>{role === 'owner' ? 'Business Owner' : 'Operations Manager'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-view">
          
          {activeView === 'overview' && (
            <>
              {renderKPIs()}
              
              <div className="charts-grid">
                <div className="chart-card">
                  <h4>Weekly Revenue Trend</h4>
                  <div style={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer>
                      <AreaChart data={salesData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b0000" stopOpacity={0.2}/>
                            <stop offset="95%" stopColor="#8b0000" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#8b0000" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="chart-card">
                  <h4>Sales by Category</h4>
                  <div style={{ width: '100%', height: 280 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={8}
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pie-legend">
                      {categoryData.map((item, i) => (
                        <div key={i} className="legend-item" style={{animationDelay: `${i * 0.1}s`}}>
                          <span className="dot" style={{background: COLORS[i]}}></span>
                          <span className="name">{item.name}</span>
                          <span className="val">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {role === 'owner' && (
                <div className="executive-actions">
                   <button className="btn-export"><Download size={18} /> Export Full Quarterly Report (PDF)</button>
                   <button className="btn-export"><Download size={18} /> Export Sales Data (CSV)</button>
                </div>
              )}
            </>
          )}

          {activeView === 'analytics' && (
            <div className="analytics-view">
              <div className="charts-grid full-width">
                <div className="chart-card">
                  <h4>Revenue vs Profit Analysis</h4>
                  <div style={{ width: '100%', height: 320 }}>
                    <ResponsiveContainer>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#999'}} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" fill="#8b0000" name="Revenue" />
                        <Bar dataKey="profit" fill="#d4af37" name="Net Profit" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div className="metrics-row">
                <div className="metric-box">
                  <span>Conversion Rate</span>
                  <h4>4.8%</h4>
                </div>
                <div className="metric-box">
                  <span>Avg. Session Duration</span>
                  <h4>3m 42s</h4>
                </div>
                <div className="metric-box">
                  <span>Bounce Rate</span>
                  <h4>22.5%</h4>
                </div>
              </div>
            </div>
          )}

          {activeView === 'financials' && (
            <div className="financials-view">
              <div className="admin-table-card">
                <div className="card-header">
                  <h3>Profit & Loss Statement</h3>
                  <button className="btn-export"><Download size={16} /> Export Statement</button>
                </div>
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Total Income</th>
                      <th>Total Expenses</th>
                      <th>Net Profit</th>
                      <th>Margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financialData.map(f => (
                      <tr key={f.month}>
                        <td>{f.month}</td>
                        <td>${f.income.toLocaleString()}</td>
                        <td style={{color: '#e91e63'}}>- ${f.expenses.toLocaleString()}</td>
                        <td style={{fontWeight: 700, color: '#4caf50'}}>${(f.income - f.expenses).toLocaleString()}</td>
                        <td>{(((f.income - f.expenses)/f.income)*100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'insights' && (
            <div className="insights-view">
              <div className="insights-grid">
                <div className="insight-card-premium">
                  <div className="insight-header">
                    <Globe size={24} />
                    <h3>Global Market Trends</h3>
                  </div>
                  <p>Cinnamon prices are expected to rise by 15% in the next quarter due to harvest conditions in South Asia.</p>
                  <div className="trend-indicator up">Market Opportunity: High</div>
                </div>
                <div className="insight-card-premium">
                  <div className="insight-header">
                    <Users size={24} />
                    <h3>Customer Behavior</h3>
                  </div>
                  <p>70% of premium spice buyers prefer gift packaging during festive seasons.</p>
                  <div className="trend-indicator">Action: Expand Gift Sets</div>
                </div>
                <div className="insight-card-premium">
                  <div className="insight-header">
                    <Briefcase size={24} />
                    <h3>B2B Growth</h3>
                  </div>
                  <p>Inquiries from high-end restaurants have increased by 40% this month.</p>
                  <div className="trend-indicator up">Growth Potential: Strong</div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'products' && (
            <div className="admin-table-card">
              <div className="card-header">
                <h3>Spice Catalog</h3>
                <div className="table-controls">
                  <input type="text" placeholder="Search spices..." className="search-input" />
                  <button className="btn-admin-premium" onClick={() => handleOpenModal('product', 'add')}><Plus size={18} /> Add New Spice</button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Spice Product</th>
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
                        <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                          <p>Synchronizing with vault...</p>
                        </td>
                      </tr>
                    ) : productList.length === 0 ? (
                      <tr>
                        <td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                          <p>Your luxury collection is currently empty.</p>
                        </td>
                      </tr>
                    ) : (
                      productList.map(p => (
                        <tr key={p._id}>
                          <td>
                            <div className="product-cell">
                              <img src={p.image || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=100'} alt={p.name} />
                              <span>{p.name}</span>
                            </div>
                          </td>
                          <td>{p.category}</td>
                          <td>${Number(p.price).toFixed(2)}</td>
                          <td>{p.countInStock} Units</td>
                          <td>
                            <span className={`status-tag ${p.countInStock > 10 ? 'active' : (p.countInStock > 0 ? 'stock-low' : 'out-of-stock')}`}>
                              {p.countInStock > 10 ? 'Active' : (p.countInStock > 0 ? 'Stock Low' : 'Out of Stock')}
                            </span>
                          </td>
                          <td>
                            <div style={{display: 'flex', gap: '10px'}}>
                              <button className="btn-details-link" onClick={() => handleOpenModal('product', 'edit', p)}>Edit</button>
                              <button className="btn-details-link delete" onClick={() => handleDeleteProductReal(p._id)}><Trash size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'orders' && (
             <div className="admin-table-card">
                <div className="card-header">
                  <h3>Recent Orders</h3>
                  <div className="table-controls">
                    <select className="premium-select" style={{padding: '10px', width: 'auto'}}>
                      <option>All Statuses</option>
                      <option>Pending</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                  </div>
                </div>
                <div className="table-responsive">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderList.map(o => (
                        <tr key={o.id} className="row-entrance">
                          <td>#{o.id}</td>
                          <td><strong>{o.customer}</strong><br/><small>{o.email}</small></td>
                          <td>{o.date}</td>
                          <td>${o.total.toFixed(2)}</td>
                          <td><span className={`status-tag ${o.status}`}>{o.status === 'active' ? 'Delivered' : o.status}</span></td>
                          <td>
                            <div style={{display: 'flex', gap: '10px'}}>
                              <button className="btn-details-link" onClick={() => handleOpenModal('order', 'edit', o)}>Manage</button>
                              <button className="btn-details-link delete" onClick={() => handleDeleteOrder(o.id)}><Trash size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          )}

          {activeView === 'users' && (
            <div className="admin-table-card">
              <div className="card-header">
                <h3>User Accounts</h3>
                <div className="table-controls">
                   <button className="btn-admin-premium" onClick={() => handleOpenModal('user', 'add')}><Plus size={16} /> Invite Executive</button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>User Identity</th>
                      <th>Role</th>
                      <th>Email Address</th>
                      <th>Join Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map(u => (
                      <tr key={u.id} className="row-entrance">
                        <td>
                          <div className="product-cell">
                            <img src={`https://i.pravatar.cc/150?u=${u.id}`} alt="user" />
                            <span>{u.name}</span>
                          </div>
                        </td>
                        <td><span className="role-badge">{u.role}</span></td>
                        <td>{u.email}</td>
                        <td>{u.joinDate}</td>
                        <td><span className={`status-tag ${u.status}`}>{u.status}</span></td>
                        <td>
                          <div style={{display: 'flex', gap: '10px'}}>
                            <button className="btn-details-link" onClick={() => handleOpenModal('user', 'edit', u)}>Edit</button>
                            <button className="btn-details-link delete" onClick={() => handleDeleteUser(u.id)}><Trash size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'settings' && (
            <div className="settings-view-executive">
              <div className="view-header-premium">
                <div className="header-text">
                  <h2>System <span>Configuration</span></h2>
                  <p>Global parameters and operational security (Auto-saving active)</p>
                </div>
              </div>

              <div className="settings-grid-executive">
                <div className="setting-card-premium animate-delay-1">
                  <div className="card-icon-header">
                    <div className="icon-circle"><ShoppingBag size={20} /></div>
                    <h4>Business Identity</h4>
                  </div>
                  <div className="card-body-compact">
                    <div className="form-group-dash">
                      <label>Artisanal Store Name</label>
                      <input type="text" defaultValue="Rucheema Spicy Shop" />
                    </div>
                    <div className="form-group-dash">
                      <label>Support Correspondence</label>
                      <input type="email" defaultValue="concierge@spice.com" />
                    </div>
                    <div className="form-group-dash">
                      <label>Currency Designation</label>
                      <select>
                        <option>USD ($) - US Dollar</option>
                        <option>LKR (Rs) - Sri Lankan Rupee</option>
                        <option>EUR (€) - Euro</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="setting-card-premium animate-delay-2">
                  <div className="card-icon-header">
                    <div className="icon-circle"><Shield size={20} /></div>
                    <h4>Security Protocols</h4>
                  </div>
                  <div className="card-body-compact">
                    <div className="toggle-row-premium">
                      <div className="toggle-text">
                        <h5>Two-Factor Authentication</h5>
                        <p>Require verification for all admin entries</p>
                      </div>
                      <label className="premium-toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="toggle-row-premium">
                      <div className="toggle-text">
                        <h5>Encryption Logs</h5>
                        <p>Track all database decryption events</p>
                      </div>
                      <label className="premium-toggle">
                        <input type="checkbox" />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="setting-card-premium animate-delay-3">
                  <div className="card-icon-header">
                    <div className="icon-circle"><Bell size={20} /></div>
                    <h4>Dispatch Alerts</h4>
                  </div>
                  <div className="card-body-compact">
                    <div className="toggle-row-premium">
                      <div className="toggle-text">
                        <h5>Inventory Thresholds</h5>
                        <p>Alert when stock falls below 10 units</p>
                      </div>
                      <label className="premium-toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                    <div className="toggle-row-premium">
                      <div className="toggle-text">
                        <h5>Dispatch Confirmation</h5>
                        <p>Email customers upon artisanal shipping</p>
                      </div>
                      <label className="premium-toggle">
                        <input type="checkbox" defaultChecked />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile Section */}
          {activeView === 'profile' && (
            <div className="view-content profile-view-executive">
              <div className="view-header-premium">
                <div className="header-text">
                  <h2>Executive <span>Identity</span></h2>
                  <p>Manage your professional credentials and presence</p>
                </div>
                <button className={`btn-edit-luxury ${isEditingProfile ? 'active' : ''}`} onClick={() => setIsEditingProfile(!isEditingProfile)}>
                  {isEditingProfile ? 'Cancel' : <><Edit2 size={16} /> Edit Account</>}
                </button>
              </div>

              <div className="profile-hero-card">
                <div className="profile-image-edit">
                  <div className="avatar-preview-large">
                    <img src={profileImage} alt="Profile" />
                    {isEditingProfile && (
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
                    {isEditingProfile ? (
                      <input 
                        type="text" 
                        value={profileData.name} 
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    ) : <p>{profileData.name}</p>}
                  </div>
                  <div className="card-section-compact">
                    <label>Corporate Correspondence</label>
                    {isEditingProfile ? (
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
                    <p className="gold-text-executive">System Administrator / {user?.role}</p>
                  </div>
                  <div className="card-section-compact">
                    <label>Account Security</label>
                    <p>Enhanced Encryption Enabled</p>
                  </div>
                </div>
              </div>
              {isEditingProfile && (
                <div className="profile-actions-footer">
                  <button className="btn-save-executive" onClick={() => setIsEditingProfile(false)}>
                    Confirm Profile Updates
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Functional Unified CRUD Modal */}
      {showModal && (
        <div className="owner-modal-overlay">
          <div className="owner-modal-content">
            <div className="modal-header-dash">
              <h3>{modalMode === 'add' ? 'Create New' : 'Refine'} {modalTarget.charAt(0).toUpperCase() + modalTarget.slice(1)}</h3>
              <button className="btn-close-modal" onClick={() => setShowModal(false)}><Plus size={24} style={{ transform: 'rotate(45deg)' }} /></button>
            </div>
            
            <div className="modal-body-dash">
               {modalTarget === 'product' && (
                 <div className="form-grid-dash">
                    <div className="form-group-dash">
                      <label>Spice Name</label>
                      <input type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Ceylon Cinnamon" />
                    </div>
                    <div className="form-group-dash">
                      <label>Category</label>
                      <select value={formData.category || 'Whole Spices'} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                        <option value="Whole Spices">Whole Spices</option>
                        <option value="Powders">Powders</option>
                        <option value="Rare Blends">Rare Blends</option>
                        <option value="Gift Sets">Gift Sets</option>
                      </select>
                    </div>
                    <div className="form-group-dash">
                      <label>Price ($)</label>
                      <input type="number" value={formData.price || ''} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="29.99" />
                    </div>
                    <div className="form-group-dash">
                      <label>Stock Units</label>
                      <input type="number" value={formData.stock || ''} onChange={(e) => setFormData({...formData, stock: e.target.value})} placeholder="100" />
                    </div>
                    <div className="form-group-dash full-width">
                      <label>Description</label>
                      <textarea 
                        value={formData.description || ''} 
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                        placeholder="Describe the artisanal masterpiece..."
                        style={{ 
                          width: '100%', padding: '15px', borderRadius: '15px', 
                          border: '1px solid #e0e0e0', minHeight: '100px', background: '#fafafa', fontFamily: 'inherit'
                        }}
                      />
                    </div>
                    <div className="form-group-dash">
                      <label>Origin</label>
                      <input type="text" value={formData.origin || ''} onChange={(e) => setFormData({ ...formData, origin: e.target.value })} placeholder="e.g. Sri Lanka" />
                    </div>
                    <div className="form-group-dash">
                      <label>Spice Level</label>
                      <input type="number" min="1" max="5" value={formData.spiceLevel || 1} onChange={(e) => setFormData({ ...formData, spiceLevel: e.target.value })} />
                    </div>
                    <div className="form-group-dash full-width">
                      <label>Image URL</label>
                      <input type="text" value={formData.image || ''} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
                    </div>
                 </div>
               )}

               {modalTarget === 'user' && (
                 <div className="form-grid-dash">
                    <div className="form-group-dash">
                      <label>Full Name</label>
                      <input type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="form-group-dash">
                      <label>Email Address</label>
                      <input type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                 </div>
               )}
            </div>
            
            <div className="modal-footer-dash">
              <button className="btn-cancel-dash" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save-dash" onClick={handleSave}>
                {modalMode === 'add' ? 'Confirm Action' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
