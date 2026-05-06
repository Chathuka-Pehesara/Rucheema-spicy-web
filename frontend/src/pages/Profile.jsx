import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Camera, Save, LogOut, Shield, ShoppingBag, Lock, Edit2, X, ChevronRight, Package, Clock, MapPin } from 'lucide-react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import './Profile.css';

/* ── Location data (mirrors Register.jsx) ─────────────────────────────── */
const CITY_TOWNS = {
  'Colombo':      ['Kollupitiya', 'Bambalapitiya', 'Fort', 'Cinnamon Gardens', 'Borella', 'Slave Island', 'Maradana'],
  'Dehiwala':     ['Mount Lavinia', 'Ratmalana', 'Kalubowila', 'Nedimala'],
  'Kotte':        ['Nugegoda', 'Battaramulla', 'Rajagiriya', 'Pita Kotte', 'Etul Kotte'],
  'Kandy':        ['Peradeniya', 'Katugastota', 'Gampola', 'Digana', 'Kundasale'],
  'Galle':        ['Unawatuna', 'Hikkaduwa', 'Karapitiya', 'Dadalla'],
  'Jaffna':       ['Nallur', 'Chavakachcheri', 'Point Pedro', 'Kopay'],
  'Negombo':      ['Kochchikade', 'Katunayake', 'Seeduwa'],
  'Anuradhapura': ['New Town', 'Old Town', 'Mihintale'],
  'Ratnapura':    ['Eheliyagoda', 'Pelmadulla', 'Kuruwita'],
  'Matara':       ['Weligama', 'Mirissa', 'Dikwella', 'Gandara'],
};
const CITY_COORDS = {
  'Colombo':      { lat: 6.9271, lng: 79.8612 },
  'Dehiwala':     { lat: 6.8485, lng: 79.8732 },
  'Kotte':        { lat: 6.9061, lng: 79.9197 },
  'Kandy':        { lat: 7.2906, lng: 80.6337 },
  'Galle':        { lat: 6.0535, lng: 80.2210 },
  'Jaffna':       { lat: 9.6615, lng: 80.0255 },
  'Negombo':      { lat: 7.2089, lng: 79.8351 },
  'Anuradhapura': { lat: 8.3114, lng: 80.4037 },
  'Ratnapura':    { lat: 6.6828, lng: 80.3992 },
  'Matara':       { lat: 5.9549, lng: 80.5550 },
};
const SL_CITIES = Object.keys(CITY_TOWNS);
const COUNTRIES = ['Sri Lanka', 'United Kingdom', 'United States', 'Australia', 'Canada', 'Other'];
const MAP_STYLE = { width: '100%', height: '380px', borderRadius: '12px' };

/* ──────────────────────────────────────────────────────────────────────── */

const Profile = () => {
  const { user, logout, updateUser } = useAuth();

  const [name,            setName]            = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar,          setAvatar]          = useState('');
  const [city,            setCity]            = useState('');
  const [town,            setTown]            = useState('');
  const [country,         setCountry]         = useState('Sri Lanka');
  const [uploading,       setUploading]       = useState(false);
  const [message,         setMessage]         = useState(null);
  const [error,           setError]           = useState(null);
  const [isEditing,       setIsEditing]       = useState(false);
  const [activeTab,       setActiveTab]       = useState('profile');
  const [orders,          setOrders]          = useState([]);
  const [loadingOrders,   setLoadingOrders]   = useState(false);
  const [isMapOpen,       setIsMapOpen]       = useState(false);
  const [mapCenter,       setMapCenter]       = useState({ lat: 6.9271, lng: 79.8612 });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  /* Populate form from user object */
  useEffect(() => {
    if (user) {
      setName(user.name      || '');
      setEmail(user.email    || '');
      setAvatar(user.avatar  || '');
      setCity(user.city      || '');
      setTown(user.town      || '');
      setCountry(user.country || 'Sri Lanka');
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'orders' && user) fetchOrders();
  }, [activeTab, user]);

  /* Center map when city changes in edit mode */
  useEffect(() => {
    if (city && CITY_COORDS[city]) setMapCenter(CITY_COORDS[city]);
  }, [city]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const res  = await fetch('http://localhost:5000/api/orders/myorders', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) setOrders(data);
    } catch (err) { console.error(err); }
    finally { setLoadingOrders(false); }
  };

  const uploadFileHandler = async (e) => {
    const file     = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const res      = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: formData });
      const data     = await res.text();
      const fullPath = `http://localhost:5000${data}`;
      setAvatar(fullPath);
      const updateRes = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ avatar: fullPath }),
      });
      const updated = await updateRes.json();
      if (updateRes.ok) { updateUser(updated); setMessage('Profile photo updated!'); }
    } catch (err) { console.error(err); }
    finally { setUploading(false); }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setMessage(null); setError(null);
    if (password && password !== confirmPassword) { setError('Passwords do not match'); return; }
    try {
      const res  = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ name, email, password: password || undefined, avatar, city, town, country }),
      });
      const data = await res.json();
      if (res.ok) {
        updateUser(data);
        setMessage('Profile Updated Successfully');
        setIsEditing(false);
        setPassword(''); setConfirmPassword('');
      } else { setError(data.message || 'Update failed'); }
    } catch (err) { setError('Server error'); }
  };

  /* Nominatim reverse geocode on map click */
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMapCenter({ lat, lng });

    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`, {
      headers: { 'Accept-Language': 'en' },
    })
      .then(r => r.json())
      .then(data => {
        const addr         = data.address || {};
        const foundCountry = addr.country || '';
        const foundCity    = addr.city || addr.town || addr.village || addr.municipality || '';
        const foundTown    = addr.suburb || addr.neighbourhood || addr.quarter || '';

        if (foundCountry === 'Sri Lanka') {
          setCountry('Sri Lanka');
          const matchedCity = SL_CITIES.find(c =>
            foundCity.toLowerCase().includes(c.toLowerCase()) ||
            c.toLowerCase().includes(foundCity.toLowerCase())
          );
          if (matchedCity) {
            setCity(matchedCity);
            const towns       = CITY_TOWNS[matchedCity] || [];
            const matchedTown = towns.find(t =>
              foundTown.toLowerCase().includes(t.toLowerCase()) ||
              t.toLowerCase().includes(foundTown.toLowerCase())
            );
            setTown(matchedTown || foundTown);
          } else {
            setCity(foundCity);
            setTown(foundTown);
          }
        } else if (foundCountry) {
          const matched = COUNTRIES.find(c => c.toLowerCase() === foundCountry.toLowerCase());
          setCountry(matched || 'Other');
          setCity(foundCity);
          setTown(foundTown);
        }
      })
      .catch(() => {});
  };

  if (!user) return <div className="profile-loading">Loading...</div>;

  const isSL = country.trim().toLowerCase() === 'sri lanka';

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* ── Sidebar ─────────────────────────────────── */}
        <aside className="profile-sidebar">
          <div className="sidebar-user-info">
            <div className="avatar-upload-container">
              <img src={avatar || user.avatar} alt={name} className="profile-avatar-large" />
              <label htmlFor="avatar-upload" className="avatar-edit-badge">
                <Camera size={16} />
                <input type="file" id="avatar-upload" hidden onChange={uploadFileHandler} />
              </label>
            </div>
            <h2>{user.name}</h2>
            <p className="role-badge">{user.role}</p>

            {/* Location summary in sidebar */}
            {(user.city || user.town || user.country) && (
              <div className="sidebar-location">
                <MapPin size={13} />
                <span>{[user.town, user.city, user.country].filter(Boolean).join(', ')}</span>
              </div>
            )}
          </div>

          <nav className="profile-nav">
            <div className="nav-group">
              <h3>Account</h3>
              <button className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                <User size={18} /> My Profile
              </button>
              <button className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
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

        {/* ── Main Content ─────────────────────────────── */}
        <main className="profile-content">
          {activeTab === 'profile' ? (
            <>
              <div className="content-header-row">
                <div className="content-header">
                  <h1>Personal <span>Information</span></h1>
                  <p>Manage your account details and delivery location.</p>
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
                {error   && <div className="profile-error-msg">{error}</div>}

                <form className={`profile-form-luxury ${isEditing ? 'editing' : 'view-only'}`} onSubmit={submitHandler}>
                  <div className="form-grid">

                    {/* Full Name */}
                    <div className="form-group-lux">
                      <label>Full Name</label>
                      <div className="input-with-icon">
                        <User size={18} />
                        <input type="text" value={name} onChange={e => setName(e.target.value)} readOnly={!isEditing} placeholder="Your full name" />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="form-group-lux">
                      <label>Email Address</label>
                      <div className="input-with-icon">
                        <Mail size={18} />
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} readOnly={!isEditing} placeholder="your@email.com" />
                      </div>
                    </div>

                    {/* Country */}
                    <div className="form-group-lux">
                      <label>Country</label>
                      <div className="input-with-icon">
                        <MapPin size={18} />
                        {isEditing ? (
                          <select
                            value={country}
                            onChange={e => { setCountry(e.target.value); setCity(''); setTown(''); }}
                            className="profile-select"
                          >
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        ) : (
                          <input type="text" value={country || '—'} readOnly />
                        )}
                      </div>
                    </div>

                    {/* City */}
                    <div className="form-group-lux">
                      <label>City</label>
                      <div className="input-with-icon">
                        <MapPin size={18} />
                        {isEditing && isSL ? (
                          <select
                            value={city}
                            onChange={e => { setCity(e.target.value); setTown(''); }}
                            className="profile-select"
                          >
                            <option value="">Select City</option>
                            {SL_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        ) : (
                          <input type="text" value={city || '—'} onChange={e => setCity(e.target.value)} readOnly={!isEditing} placeholder="City" />
                        )}
                      </div>
                    </div>

                    {/* Town */}
                    <div className="form-group-lux">
                      <label>Town / Area</label>
                      <div className="input-with-icon">
                        <MapPin size={18} />
                        {isEditing && isSL && city ? (
                          <select
                            value={town}
                            onChange={e => setTown(e.target.value)}
                            className="profile-select"
                          >
                            <option value="">Select Town</option>
                            {(CITY_TOWNS[city] || []).map(t => <option key={t} value={t}>{t}</option>)}
                            {town && !(CITY_TOWNS[city] || []).includes(town) && (
                              <option key={town} value={town}>{town} (detected)</option>
                            )}
                          </select>
                        ) : (
                          <input type="text" value={town || '—'} onChange={e => setTown(e.target.value)} readOnly={!isEditing} placeholder="Town / Area" />
                        )}
                      </div>
                    </div>

                    {/* Map pin button — only in edit mode */}
                    {isEditing && (
                      <div className="form-group-lux map-btn-group">
                        <label>Pin on Map</label>
                        <button type="button" className="btn-open-map-profile" onClick={() => setIsMapOpen(true)}>
                          <MapPin size={15} /> Set Location on Map
                        </button>
                        {(city || town) && (
                          <p className="map-detected-note">
                            📍 {[town, city, country].filter(Boolean).join(', ')}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Passwords — edit only */}
                    {isEditing && (
                      <>
                        <div className="form-group-lux">
                          <label>New Password</label>
                          <div className="input-with-icon">
                            <Lock size={18} />
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" />
                          </div>
                        </div>
                        <div className="form-group-lux">
                          <label>Confirm Password</label>
                          <div className="input-with-icon">
                            <Lock size={18} />
                            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
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
            /* ── Orders Tab ── */
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
                          <div className="meta-item"><Clock size={14} /> {new Date(order.createdAt).toLocaleDateString()}</div>
                          <div className="meta-item"><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</div>
                        </div>
                        <div className="order-items-preview">
                          {order.orderItems.map((item, idx) => (
                            <img key={idx} src={item.image} alt={item.name} title={item.name} />
                          ))}
                        </div>
                        <button className="view-order-details">Details <ChevronRight size={16} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── Map Modal ─────────────────────────────────────────── */}
      {isMapOpen && (
        <div className="profile-map-overlay">
          <div className="profile-map-card">
            <div className="profile-map-header">
              <h3>Pin Your <span>Location</span></h3>
              <button className="close-map-btn-profile" onClick={() => setIsMapOpen(false)}>×</button>
            </div>
            <div className="profile-map-body">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={MAP_STYLE}
                  center={mapCenter}
                  zoom={13}
                  options={{ mapId: '8e199730f40d126' }}
                  onClick={handleMapClick}
                >
                  <MarkerF position={mapCenter} />
                </GoogleMap>
              ) : (
                <div className="map-loading-placeholder">Loading Map...</div>
              )}
            </div>
            <div className="profile-map-footer">
              <p>Click anywhere — city &amp; town will auto-detect via reverse geocoding.</p>
              <button className="btn-confirm-map-profile" onClick={() => setIsMapOpen(false)}>
                ✓ Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
