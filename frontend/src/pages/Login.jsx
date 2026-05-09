import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, User, Users, Briefcase, Sparkles } from 'lucide-react';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      setIsLoading(false);

      if (result.success) {
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else if (result.user.role === 'owner') {
          navigate('/dashboard');
        } else {
          navigate(from, { replace: true });
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setIsLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-overlay"></div>
      
      <div className="login-card">
        <div className="login-brand-luxury">
          <div className="mascot-container">
            <svg 
              className="chili-mascot"
              width="120" height="120" 
              viewBox="0 0 100 100"
              style={{ transition: 'all 0.4s ease' }}
            >
              {/* Stem */}
              <path 
                d="M 50 15 Q 50 0 65 5" 
                stroke="#15803d" 
                strokeWidth="6" 
                strokeLinecap="round" 
                fill="none" 
              />
              {/* Body */}
              <path 
                d="M 50 15 C 75 15 85 55 70 85 C 60 100 40 100 30 85 C 15 55 25 15 50 15 Z" 
                fill={focusedField === 'password' ? '#22c55e' : '#ef4444'} 
                style={{ transition: 'fill 0.5s ease' }}
              />
              
              {/* Eyes */}
              {focusedField === 'password' ? (
                <>
                  <path d="M 35 45 Q 40 38 45 45" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <path d="M 55 45 Q 60 38 65 45" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
                </>
              ) : (
                <>
                  <circle 
                    cx={focusedField === 'email' ? 38 : 40} 
                    cy={focusedField === 'email' ? 48 : 42} 
                    r="4" fill="#fff" 
                    style={{ transition: 'all 0.2s ease' }}
                  />
                  <circle 
                    cx={focusedField === 'email' ? 58 : 60} 
                    cy={focusedField === 'email' ? 48 : 42} 
                    r="4" fill="#fff" 
                    style={{ transition: 'all 0.2s ease' }}
                  />
                </>
              )}

              {/* Mouth */}
              {focusedField === 'password' ? (
                <circle cx="50" cy="58" r="3" fill="#fff" />
              ) : focusedField === 'email' ? (
                <path d="M 45 60 Q 50 65 55 60" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
              ) : (
                <path d="M 40 55 Q 50 65 60 55" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
              )}
            </svg>
          </div>
          <h1>Rucheema <span>Login</span></h1>
          <p>Access your premium account</p>
        </div>


        <form className="login-form-premium" onSubmit={handleSubmit}>
          {error && <div className="login-error-premium">{error}</div>}
          {successMessage && <div className="login-success-premium">{successMessage}</div>}
          
          <div className="form-group-premium">
            <label>Professional Email</label>
            <div className="input-wrapper-premium">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
              />
            </div>
          </div>

          <div className="form-group-premium">
            <label>Secure Password</label>
            <div className="input-wrapper-premium">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
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

          <div className="form-extras">
            <label className="remember-me">
              <input type="checkbox" /> <span>Remember Me</span>
            </label>
            <button type="button" className="forgot-password">Forgot Password?</button>
          </div>

          <button type="submit" className="btn-submit-premium" disabled={isLoading}>
            {isLoading ? (
              <div className="loader-premium"></div>
            ) : (
              <>
                Authenticate Access 
                <ArrowRight size={20} className="btn-arrow" />
              </>
            )}
          </button>
        </form>

        <div className="login-footer-premium">
          <p>
            New to our platform?
            <Link to="/register" className="toggle-mode-btn">Register Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
