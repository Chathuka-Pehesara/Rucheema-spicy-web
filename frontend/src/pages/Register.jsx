import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, User, Users, Briefcase, Sparkles, MapPin, Phone } from 'lucide-react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import './Register.css';

const CITY_TOWNS = {
  'Colombo': ['Kollupitiya', 'Bambalapitiya', 'Fort', 'Cinnamon Gardens', 'Borella', 'Slave Island', 'Maradana'],
  'Dehiwala': ['Mount Lavinia', 'Ratmalana', 'Kalubowila', 'Nedimala'],
  'Kotte': ['Nugegoda', 'Battaramulla', 'Rajagiriya', 'Pita Kotte', 'Etul Kotte'],
  'Kandy': ['Peradeniya', 'Katugastota', 'Gampola', 'Digana', 'Kundasale'],
  'Galle': ['Unawatuna', 'Hikkaduwa', 'Karapitiya', 'Dadalla'],
  'Jaffna': ['Nallur', 'Chavakachcheri', 'Point Pedro', 'Kopay'],
  'Negombo': ['Kochchikade', 'Katunayake', 'Seeduwa'],
  'Anuradhapura': ['New Town', 'Old Town', 'Mihintale'],
  'Ratnapura': ['Eheliyagoda', 'Pelmadulla', 'Kuruwita'],
  'Matara': ['Weligama', 'Mirissa', 'Dikwella', 'Gandara']
};

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
  'Matara': { lat: 5.9549, lng: 80.5550 }
};

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '12px'
};

const Register = () => {
  const SL_CITIES = ['Colombo', 'Dehiwala', 'Kotte', 'Kandy', 'Galle', 'Jaffna', 'Negombo', 'Anuradhapura', 'Ratnapura', 'Matara'];
  const COUNTRIES = ['Sri Lanka', 'United Kingdom', 'United States', 'Australia', 'Canada', 'Other'];

  const [role, setRole] = useState('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('');
  const [town, setTown] = useState('');
  const [country, setCountry] = useState('Sri Lanka');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 6.9271, lng: 79.8612 });
  const [isLoading, setIsLoading] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '' 
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);

    try {
      const result = await register({ name, email, password, role, city, town, country });
      setIsLoading(false);

      if (result.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login', { state: { email } });
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setIsLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-bg-overlay"></div>
      
      <div className="register-card">
        <div className="register-brand-luxury">
          <div className="brand-logo-anim">
            <Sparkles className="sparkle-icon" size={24} />
            <ShieldCheck size={48} className="main-logo" />
          </div>
          <h1>Join <span>Rucheema</span></h1>
          <p>Create your account to start your artisanal journey</p>
        </div>

        <div className="role-selector-premium">
          <button 
            type="button"
            className={`role-btn ${role === 'user' ? 'active' : ''}`}
            onClick={() => setRole('user')}
          >
            <Users size={18} />
            <span>Customer</span>
          </button>
          <button 
            type="button"
            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => setRole('admin')}
          >
            <Briefcase size={18} />
            <span>Admin</span>
          </button>
          <button 
            type="button"
            className={`role-btn ${role === 'owner' ? 'active' : ''}`}
            onClick={() => setRole('owner')}
          >
            <User size={18} />
            <span>Owner</span>
          </button>
        </div>

        <form className="register-form-premium" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <div className="form-grid">
            <div className="form-group-premium">
              <label>Full Name</label>
              <div className="input-wrapper-premium">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-premium">
              <label>Email Address</label>
              <div className="input-wrapper-premium">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-premium">
              <label>Country</label>
              <div className="input-wrapper-premium">
                <MapPin className="input-icon" size={18} />
                <select
                  value={country}
                  onChange={(e) => {
                    setCountry(e.target.value);
                    if (e.target.value !== 'Sri Lanka') { setCity(''); setTown(''); }
                  }}
                  className="select-premium-lux"
                  required
                >
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group-premium">
              <label>City</label>
              <div className="input-wrapper-premium">
                <MapPin className="input-icon" size={18} />
                {country === 'Sri Lanka' ? (
                  <select
                    value={city}
                    onChange={(e) => { setCity(e.target.value); setTown(''); }}
                    className="select-premium-lux"
                    required
                  >
                    <option value="">Select City</option>
                    {SL_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                )}
              </div>
            </div>

            <div className="form-group-premium">
              <label>Town / Area</label>
              <div className="input-wrapper-premium">
                <MapPin className="input-icon" size={18} />
                {country === 'Sri Lanka' && city ? (
                  <select
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className="select-premium-lux"
                    required
                  >
                    <option value="">Select Town</option>
                    {(CITY_TOWNS[city] || []).map(t => <option key={t} value={t}>{t}</option>)}
                    {/* Always show detected town as an option if it's not in the list */}
                    {town && !(CITY_TOWNS[city] || []).includes(town) && (
                      <option key="detected-town" value={town}>{town} (Map Location)</option>
                    )}
                    <option value="Other">Other...</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter Town"
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    required
                  />
                )}
              </div>
              {country === 'Sri Lanka' && (
                <button 
                  type="button" 
                  className="btn-set-map"
                  onClick={() => {
                    if (city && CITY_COORDS[city]) {
                      setMapCenter(CITY_COORDS[city]);
                    }
                    setIsMapOpen(true);
                  }}
                >
                  <MapPin size={14} /> Set Location on Map
                </button>
              )}
            </div>

            <div className="form-group-premium">
              <label>Password</label>
              <div className="input-wrapper-premium">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-password-premium"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group-premium">
              <label>Confirm Password</label>
              <div className="input-wrapper-premium">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-submit-premium" disabled={isLoading}>
            {isLoading ? (
              <div className="loader-premium"></div>
            ) : (
              <>
                Create Account
                <ArrowRight size={20} className="btn-arrow" />
              </>
            )}
          </button>
        </form>

        <div className="register-footer-premium">
          <p>
            Already have an account? 
            <Link to="/login" className="toggle-mode-btn">Sign In</Link>
          </p>
        </div>
      </div>

      {isMapOpen && (
        <div className="map-modal-overlay">
          <div className="map-modal-card">
            <div className="map-modal-header">
              <h3>Select Precise <span>Location</span></h3>
              <button className="close-map-btn" onClick={() => setIsMapOpen(false)}>×</button>
            </div>
            <div className="map-container-wrapper">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={13}
                  options={{
                    mapId: '8e199730f40d126' // You can create your own Map ID in Google Console for better styling
                  }}
                  onClick={(e) => {
                    const lat = e.latLng.lat();
                    const lng = e.latLng.lng();
                    setMapCenter({ lat, lng });

                    // Use OpenStreetMap Nominatim — free, no API key, no billing needed
                    fetch(
                      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
                      { headers: { 'Accept-Language': 'en' } }
                    )
                      .then(res => res.json())
                      .then(data => {
                        const addr = data.address || {};
                        const foundCountry = addr.country || '';
                        // Nominatim uses city, town, village, or municipality
                        const foundCity = addr.city || addr.town || addr.village || addr.municipality || '';
                        // Suburb, neighbourhood, or quarter for the town/area
                        const foundTown = addr.suburb || addr.neighbourhood || addr.quarter || '';

                        if (foundCountry === 'Sri Lanka') {
                          setCountry('Sri Lanka');

                          // Fuzzy-match against predefined SL cities
                          const matchedCity = SL_CITIES.find(c =>
                            foundCity.toLowerCase().includes(c.toLowerCase()) ||
                            c.toLowerCase().includes(foundCity.toLowerCase())
                          );

                          if (matchedCity) {
                            setCity(matchedCity);
                            const towns = CITY_TOWNS[matchedCity] || [];
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
                          const matchedCountry = COUNTRIES.find(c =>
                            c.toLowerCase() === foundCountry.toLowerCase()
                          );
                          setCountry(matchedCountry || 'Other');
                          setCity(foundCity);
                          setTown(foundTown);
                        }
                      })
                      .catch(() => {
                        // Silent fail — user can still select manually
                      });
                  }}
                >
                  <MarkerF position={mapCenter} />
                </GoogleMap>
              ) : (
                <div className="map-loading-placeholder">
                  Loading Global Navigation...
                </div>
              )}
            </div>
            <div className="map-modal-footer">
              <p>Pin your location for accurate delivery logistics</p>
              <button className="btn-confirm-location" onClick={() => setIsMapOpen(false)}>
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
