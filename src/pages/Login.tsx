import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, LogIn, User, Smartphone, Lock, AlertCircle } from 'lucide-react';

function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Visitor logic: Default to Sign Up for first-time visitors
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedEnterprises');
    if (!hasVisited) {
      setIsRegistering(true);
      localStorage.setItem('hasVisitedEnterprises', 'true');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    if (isRegistering && !mobileNumber) {
      setError('Please enter your mobile number.');
      return;
    }

    setLoading(true);
    let success = false;
    
    if (isRegistering) {
      success = await register(username, password, mobileNumber);
      if (!success) {
        setError('Registration failed. Username might already exist.');
      }
    } else {
      success = await login(username, password);
      if (!success) {
        setError('Invalid credentials.');
      }
    }
    
    setLoading(false);

    if (success) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal card animate-fade-in-up">
        {/* Tabs */}
        <div className="login-tabs">
          <button 
            className={`tab-btn ${!isRegistering ? 'active' : ''}`}
            onClick={() => { setIsRegistering(false); setError(''); }}
          >
            Login
          </button>
          <button 
            className={`tab-btn ${isRegistering ? 'active' : ''}`}
            onClick={() => { setIsRegistering(true); setError(''); }}
          >
            Sign Up
          </button>
        </div>

        <div className="login-content">
          <div className="text-center mb-8">
            <h2 className="login-title">Welcome Back</h2>
          </div>

          {error && (
            <div className="error-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex-col gap-4">
            <div className="input-field">
              <label className="input-label" htmlFor="username">Username</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  id="username"
                  className="login-input"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-field">
              <label className="input-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="login-input"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button 
                  type="button" 
                  className="eye-btn" 
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {isRegistering && (
              <div className="input-field">
                <label className="input-label" htmlFor="mobileNumber">Mobile Number</label>
                <div className="input-wrapper">
                  <Smartphone size={18} className="input-icon" />
                  <input
                    type="tel"
                    id="mobileNumber"
                    className="login-input"
                    placeholder="Enter your mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="login-submit-btn">
              {loading ? 'Processing...' : (isRegistering ? 'Sign Up' : 'Login')}
              {!loading && <LogIn size={18} className="ml-2" />}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .login-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          z-index: 1000;
        }
        .login-modal {
          width: 100%;
          max-width: 440px;
          background: white;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          padding: 0;
        }
        .login-tabs {
          display: flex;
          border-bottom: 1px solid #f1f5f9;
        }
        .tab-btn {
          flex: 1;
          padding: 1.25rem;
          font-weight: 700;
          font-size: 1rem;
          color: #94a3b8;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        .tab-btn.active {
          color: #1e3a8a;
        }
        .tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 20%;
          right: 20%;
          height: 3px;
          background: #3b82f6;
          border-radius: 3px 3px 0 0;
        }
        .login-content {
          padding: 2.5rem 2rem;
        }
        .login-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1e3a8a;
          letter-spacing: -0.025em;
        }
        .input-field {
          margin-bottom: 1.25rem;
        }
        .input-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 700;
          color: #1e3a8a;
          margin-bottom: 0.5rem;
        }
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-icon {
          position: absolute;
          left: 1rem;
          color: #94a3b8;
        }
        .login-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 2.75rem;
          border: 1.5px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
        }
        .login-input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .eye-btn {
          position: absolute;
          right: 1rem;
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0.25rem;
        }
        .eye-btn:hover {
          color: #1e3a8a;
        }
        .login-submit-btn {
          width: 100%;
          padding: 1rem;
          background: #059669;
          color: white;
          border: none;
          border-radius: 0.875rem;
          font-weight: 700;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 1rem;
        }
        .login-submit-btn:hover:not(:disabled) {
          background: #047857;
          transform: translateY(-1px);
        }
        .login-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .error-alert {
          background: #fef2f2;
          border-left: 4px solid #ef4444;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          color: #b91c1c;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .ml-2 { margin-left: 0.5rem; }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .login-modal {
            border-radius: 1.25rem;
          }
          .login-content {
            padding: 2rem 1.5rem;
          }
          .login-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Login;
