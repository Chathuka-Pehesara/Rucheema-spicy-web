import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, Globe, Truck, MapPin, DollarSign, Info } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`);
        const data = await response.json();
        setSettings(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        setMessage('Settings updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="settings-loading">Loading Executive Settings...</div>;

  return (
    <div className="settings-page">
      <div className="settings-container">
        <header className="settings-header">
          <h1>Global <span>Configuration</span></h1>
          <p>Manage shipping logistics, base location, and financial parameters.</p>
        </header>

        {message && <div className="settings-success">{message}</div>}

        <form onSubmit={handleUpdate} className="settings-form">
          <section className="settings-section">
            <div className="section-title">
              <Truck size={24} />
              <h2>Shipping Logistics</h2>
            </div>
            <div className="settings-grid">
              <div className="input-group">
                <label>International Base Fee ($)</label>
                <div className="input-wrapper">
                  <DollarSign size={18} />
                  <input 
                    type="number" 
                    value={settings.shippingRates.internationalBase}
                    onChange={(e) => setSettings({
                      ...settings, 
                      shippingRates: { ...settings.shippingRates, internationalBase: Number(e.target.value) }
                    })}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>International Per Km ($)</label>
                <div className="input-wrapper">
                  <Globe size={18} />
                  <input 
                    type="number" 
                    step="0.01"
                    value={settings.shippingRates.internationalPerKm}
                    onChange={(e) => setSettings({
                      ...settings, 
                      shippingRates: { ...settings.shippingRates, internationalPerKm: Number(e.target.value) }
                    })}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Local Per Km ($)</label>
                <div className="input-wrapper">
                  <Truck size={18} />
                  <input 
                    type="number" 
                    step="0.01"
                    value={settings.shippingRates.localPerKm}
                    onChange={(e) => setSettings({
                      ...settings, 
                      shippingRates: { ...settings.shippingRates, localPerKm: Number(e.target.value) }
                    })}
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Local Base Fee ($)</label>
                <div className="input-wrapper">
                  <MapPin size={18} />
                  <input 
                    type="number" 
                    value={settings.shippingRates.localBase}
                    onChange={(e) => setSettings({
                      ...settings, 
                      shippingRates: { ...settings.shippingRates, localBase: Number(e.target.value) }
                    })}
                  />
                  <div className="info-tip"><Info size={12} /> User requested Free for Sri Lanka (set to 0)</div>
                </div>
              </div>
            </div>
          </section>

          <section className="settings-section">
            <div className="section-title">
              <MapPin size={24} />
              <h2>Dispatch Base Location</h2>
            </div>
            <div className="settings-grid">
              <div className="input-group">
                <label>Base City</label>
                <input 
                  type="text" 
                  value={settings.baseLocation.city}
                  onChange={(e) => setSettings({
                    ...settings, 
                    baseLocation: { ...settings.baseLocation, city: e.target.value }
                  })}
                />
              </div>
              <div className="input-group">
                <label>Base Country</label>
                <input 
                  type="text" 
                  value={settings.baseLocation.country}
                  onChange={(e) => setSettings({
                    ...settings, 
                    baseLocation: { ...settings.baseLocation, country: e.target.value }
                  })}
                />
              </div>
            </div>
          </section>

          <button type="submit" className="save-settings-btn">
            <Save size={20} /> Save Executive Configuration
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
