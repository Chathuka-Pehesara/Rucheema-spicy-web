import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, User, Users, Briefcase, Sparkles } from 'lucide-react';
import './Login.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [role, setRole] = useState('user'); // user, admin, owner
  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
          <div className="brand-logo-anim">
            <Sparkles className="sparkle-icon" size={24} />
            <ShieldCheck size={48} className="main-logo" />
          </div>
          <h1>Rucheema <span>Executive</span></h1>
          <p>Access your premium catalog and dashboard</p>
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

        <form className="login-form-premium" onSubmit={handleSubmit}>
          {error && <div className="login-error-premium">{error}</div>}
          {successMessage && <div className="login-success-premium">{successMessage}</div>}
          
          <div className="form-group-premium">
            <label>Professional Email</label>
            <div className="input-wrapper-premium">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                placeholder={role === 'admin' ? 'admin@rucheema.com' : 'your@email.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
