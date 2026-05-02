import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Camera, Save, LogOut, Shield, ShoppingBag, Lock, Edit2, X, ChevronRight, Package, Clock, MapPin } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [city, setCity] = useState('');
  const [town, setTown] = useState('');
  const [country, setCountry] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // profile, orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatar(user.avatar);
      setCity(user.city || '');
      setTown(user.town || '');
      setCountry(user.country || '');
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders();
    }
  }, [activeTab, user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await fetch('http://localhost:5000/api/orders/myorders', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(data);
      }
      setLoadingOrders(false);
    } catch (err) {
      setLoadingOrders(false);
      console.error(err);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.text();
      const fullPath = `http://localhost:5000${data}`;
      setAvatar(fullPath);
      setUploading(false);
      
      // Auto-save the new avatar
      const updateResponse = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ avatar: fullPath }),
      });
      const updatedData = await updateResponse.json();
      if (updateResponse.ok) {
        updateUser(updatedData);
        setMessage('Profile photo updated!');
      }
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name,
          email,
          password: password || undefined,
          avatar,
          city,
          town,
          country,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        updateUser(data);
        setMessage('Profile Updated Successfully');
        setIsEditing(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Update failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  if (!user) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <aside className="profile-sidebar">
          <div className="sidebar-user-info">
            <div className="avatar-upload-container">
              <img src={avatar || user.avatar} alt={name} className="profile-avatar-large" />
              <label htmlFor="avatar-upload" className="avatar-edit-badge">
                <Camera size={16} />
                <input 
                  type="file" 
                  id="avatar-upload" 
                  hidden 
                  onChange={uploadFileHandler}
                />
              </label>
            </div>
            <h2>{user.name}</h2>
            <p className="role-badge">{user.role}</p>
          </div>

          <nav className="profile-nav">
            <div className="nav-group">
              <h3>Account</h3>
              <button 
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={18} /> My Profile
              </button>
              <button 
                className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <ShoppingBag size={18} /> My Orders
              </button>
            </div>
            
            {user.role === 'admin' && (
              <div className="nav-group">
                <h3>Management</h3>
                <button className="nav-item"><Shield size={18} /> Admin Panel</button>
              </div>
            )}

            <div className="nav-group">
              <button onClick={logout} className="nav-item logout-item">
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </nav>
        </aside>

        <main className="profile-content">
          {activeTab === 'profile' ? (
            <>
              <div className="content-header-row">
                <div className="content-header">
                  <h1>Personal <span>Information</span></h1>
                  <p>Manage your account details and security settings.</p>
                </div>
                {!isEditing ? (
                  <button className="edit-toggle-btn" onClick={() => setIsEditing(true)}>
                    <Edit2 size={16} /> Edit Profile
                  </button>
                ) : (
                  <button className="edit-toggle-btn cancel" onClick={() => setIsEditing(false)}>
                    <X size={16} /> Cancel
                  </button>
                )}
              </div>

              <div className="profile-info-display">
                {message && <div className="profile-success-msg">{message}</div>}
                {error && <div className="profile-error-msg">{error}</div>}

                <form className={`profile-form-luxury ${isEditing ? 'editing' : 'view-only'}`} onSubmit={submitHandler}>
                  <div className="form-grid">
                    <div className="form-group-lux">
                      <label>Full Name</label>
                      <div className="input-with-icon">
                        <User size={18} />
                        <input 
                          type="text" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                          readOnly={!isEditing}
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div className="form-group-lux">
                      <label>Email Address</label>
                      <div className="input-with-icon">
                        <Mail size={18} />
                        <input 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)}
                          readOnly={!isEditing}
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="form-group-lux">
                      <label>City</label>
                      <div className="input-with-icon">
                        <MapPin size={18} />
                        <input 
                          type="text" 
                          value={city} 
                          onChange={(e) => setCity(e.target.value)}
                          readOnly={!isEditing}
                          placeholder="Colombo"
                        />
                      </div>
                    </div>

                    <div className="form-group-lux">
                      <label>Town</label>
                      <div className="input-with-icon">
                        <MapPin size={18} />
                        <input 
                          type="text" 
                          value={town} 
                          onChange={(e) => setTown(e.target.value)}
                          readOnly={!isEditing}
                          placeholder="Dehiwala"
                        />
                      </div>
                    </div>

                    <div className="form-group-lux">
                      <label>Country</label>
                      <div className="input-with-icon">
                        <MapPin size={18} />
                        <input 
                          type="text" 
                          value={country} 
                          onChange={(e) => setCountry(e.target.value)}
                          readOnly={!isEditing}
                          placeholder="Sri Lanka"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <>
                        <div className="form-group-lux">
                          <label>New Password</label>
                          <div className="input-with-icon">
                            <Lock size={18} />
                            <input 
                              type="password" 
                              value={password} 
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Min. 6 characters"
                            />
                          </div>
                        </div>

                        <div className="form-group-lux">
                          <label>Confirm Password</label>
                          <div className="input-with-icon">
                            <Lock size={18} />
                            <input 
                              type="password" 
                              value={confirmPassword} 
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {isEditing && (
                    <button type="submit" className="save-profile-btn" disabled={uploading}>
                      {uploading ? 'Processing...' : <><Save size={18} /> Update Profile</>}
                    </button>
                  )}
                </form>
              </div>
            </>
          ) : (
            <div className="orders-section">
              <div className="content-header">
                <h1>My <span>Orders</span></h1>
                <p>Track your spice journeys and order history.</p>
              </div>

              {loadingOrders ? (
                <div className="orders-loading">Gathering your history...</div>
              ) : orders.length === 0 ? (
                <div className="no-orders-box">
                  <Package size={48} />
                  <h3>No orders found</h3>
                  <p>You haven't placed any orders yet. Explore our collections to start!</p>
                </div>
              ) : (
                <div className="orders-list-premium">
                  {orders.map(order => (
                    <div key={order._id} className="order-card-premium">
                      <div className="order-header-lux">
                        <div className="order-id">
                          <span className="label">Order ID:</span>
                          <span className="value">#{order._id.substring(0, 8)}</span>
                        </div>
                        <div className={`order-status ${order.isPaid ? 'paid' : 'unpaid'}`}>
                          {order.isPaid ? 'Paid' : 'Pending Payment'}
                        </div>
                      </div>
                      <div className="order-body-lux">
                        <div className="order-meta">
                          <div className="meta-item">
                            <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="meta-item">
                            <strong>Total:</strong> ${order.totalPrice.toFixed(2)}
                          </div>
                        </div>
                        <div className="order-items-preview">
                          {order.orderItems.map((item, idx) => (
                            <img key={idx} src={item.image} alt={item.name} title={item.name} />
                          ))}
                        </div>
                        <button className="view-order-details">
                          Details <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;

