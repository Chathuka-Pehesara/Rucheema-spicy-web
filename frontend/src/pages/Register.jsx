import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, User, Users, Briefcase, Sparkles, MapPin, Phone } from 'lucide-react';
import './Register.css';

const Register = () => {
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
  const [isLoading, setIsLoading] = useState(false);

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
              <label>City</label>
              <div className="input-wrapper-premium">
                <MapPin className="input-icon" size={18} />
                <input
                  type="text"
                  placeholder="Colombo"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-premium">
              <label>Town</label>
              <div className="input-wrapper-premium">
                <MapPin className="input-icon" size={18} />
                <input
                  type="text"
                  placeholder="Dehiwala"
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group-premium">
              <label>Country</label>
              <div className="input-wrapper-premium">
                <MapPin className="input-icon" size={18} />
                <input
                  type="text"
                  placeholder="Sri Lanka"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
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
    </div>
  );
};

export default Register;
