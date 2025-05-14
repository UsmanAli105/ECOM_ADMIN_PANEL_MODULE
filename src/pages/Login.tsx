import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import validator from 'validator';
import '../App.css'; // Ensure custom styles are loaded

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');
  const [showToast, setShowToast] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ username?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validateFields = () => {
    const errors: { username?: string; password?: string } = {};
    if (!username || username.length < 3) {
      errors.username = 'Username must be at least 3 characters.';
    }
    if (!password) {
      errors.password = 'Password is required.';
    } else if (
      !validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      errors.password =
        'Password must be at least 6 characters, include uppercase, lowercase, number, and special character.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowToast(false);
    if (!validateFields()) return;
    setLoading(true);
    try {
      await login(username, password);
      setSuccess('Login successful!');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/dashboard');
      }, 1500);
    } catch (err: unknown) {
      let errorMsg = 'Login failed';
      if (
        typeof err === 'object' &&
        err !== null &&
        'message' in err &&
        typeof (err as { message?: unknown }).message === 'string'
      ) {
        errorMsg = (err as { message: string }).message;
      }
      setError(errorMsg);
      setToastType('error');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg-gradient min-vh-100 d-flex align-items-center justify-content-center">
      <div className="login-card card shadow-lg border-0 p-4 p-md-5" style={{ maxWidth: 400, width: '100%', borderRadius: 24 }}>
        <div className="text-center mb-4">
          <div className="login-logo mb-2">
            <i className="bi bi-shield-lock" style={{ fontSize: 48, color: '#6f42c1' }}></i>
          </div>
          <h2 className="fw-bold mb-0" style={{ letterSpacing: 1 }}>Sign In</h2>
          <p className="text-muted small mt-1 mb-0">Welcome back! Please login to your account.</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control${fieldErrors.username ? ' is-invalid' : ''}`}
              id="loginUsername"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
            <label htmlFor="loginUsername">Username</label>
            {fieldErrors.username && <div className="invalid-feedback">{fieldErrors.username}</div>}
          </div>
          <div className={`form-floating mb-3 position-relative${fieldErrors.password ? ' has-feedback' : ''}`}>
            <input
              type={showPassword ? 'text' : 'password'}
              className={`form-control${fieldErrors.password ? ' is-invalid' : ''}`}
              id="loginPassword"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <label htmlFor="loginPassword">Password</label>
            <button
              type="button"
              className="btn-eye-toggle"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
            {fieldErrors.password && <div className="invalid-feedback d-block">{fieldErrors.password}</div>}
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2 mt-2" disabled={loading} style={{ borderRadius: 8, fontWeight: 600, fontSize: 18 }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-3 text-center">
          <span className="text-muted">Don't have an account? </span>
          <Link to="/register" className="fw-semibold">Register</Link>
        </div>
      </div>
      {/* Toast for success, error, or warning message */}
      <div
        className={`toast align-items-center text-bg-${toastType === 'success' ? 'success' : toastType === 'error' ? 'danger' : 'warning'} border-0 position-fixed top-0 end-0 m-4${showToast ? ' show' : ''}`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        style={{ zIndex: 9999, minWidth: 300 }}
      >
        <div className="d-flex">
          <div className="toast-body">
            {toastType === 'success' && success}
            {toastType === 'error' && error}
            {toastType === 'warning' && !success && !error && 'Warning!'}
          </div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            onClick={() => setShowToast(false)}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default Login; 