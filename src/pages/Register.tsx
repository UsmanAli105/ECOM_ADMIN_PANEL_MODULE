import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import validator from 'validator';
import '../App.css'; // Ensure custom styles are loaded

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    phone: '',
    displayName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
    email?: string;
    phone?: string;
    displayName?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');

  const validateFields = () => {
    const errors: typeof fieldErrors = {};
    if (!form.username || form.username.length < 3) {
      errors.username = 'Username must be at least 3 characters.';
    }
    if (!form.password) {
      errors.password = 'Password is required.';
    } else if (
      !validator.isStrongPassword(form.password, {
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
    if (!form.email) {
      errors.email = 'Email is required.';
    } else if (!validator.isEmail(form.email)) {
      errors.email = 'Invalid email address.';
    }
    if (!form.phone) {
      errors.phone = 'Phone is required.';
    } else if (!validator.isMobilePhone(form.phone, undefined, { strictMode: false })) {
      errors.phone = 'Invalid phone number.';
    }
    if (!form.displayName || form.displayName.length < 3) {
      errors.displayName = 'Display name must be at least 3 characters.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowToast(false);
    if (!validateFields()) return;
    setLoading(true);
    try {
      await register(
        form.username,
        form.password,
        form.email,
        form.phone,
        form.displayName
      );
      setSuccess('Registration successful! Please login.');
      setToastType('success');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate('/login');
      }, 1500);
    } catch (err: unknown) {
      let errorMsg = 'Registration failed';
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
      <div className="login-card card shadow-lg border-0 p-4 p-md-5" style={{ maxWidth: 500, width: '100%', borderRadius: 24 }}>
        <div className="text-center mb-4">
          <div className="login-logo mb-2">
            <i className="bi bi-person-plus" style={{ fontSize: 48, color: '#6f42c1' }}></i>
          </div>
          <h2 className="fw-bold mb-0" style={{ letterSpacing: 1 }}>Create Account</h2>
          <p className="text-muted small mt-1 mb-0">Join us! Please fill in your details.</p>
        </div>
        {success && <div className="alert alert-success">{success}</div>}
        <form onSubmit={handleSubmit} noValidate>
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control${fieldErrors.displayName ? ' is-invalid' : ''}`}
              id="registerDisplayName"
              name="displayName"
              placeholder="Display Name"
              value={form.displayName}
              onChange={handleChange}
              required
              autoFocus
            />
            <label htmlFor="registerDisplayName">Display Name</label>
            {fieldErrors.displayName && <div className="invalid-feedback">{fieldErrors.displayName}</div>}
          </div>
          <div className="form-floating mb-3">
            <input
              type="text"
              className={`form-control${fieldErrors.username ? ' is-invalid' : ''}`}
              id="registerUsername"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
            <label htmlFor="registerUsername">Username</label>
            {fieldErrors.username && <div className="invalid-feedback">{fieldErrors.username}</div>}
          </div>
          <div className={`form-floating mb-3 position-relative${fieldErrors.password ? ' has-feedback' : ''}`}>
            <input
              type={showPassword ? 'text' : 'password'}
              className={`form-control${fieldErrors.password ? ' is-invalid' : ''}`}
              id="registerPassword"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="registerPassword">Password</label>
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
          <div className="form-floating mb-3">
            <input
              type="email"
              className={`form-control${fieldErrors.email ? ' is-invalid' : ''}`}
              id="registerEmail"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="registerEmail">Email</label>
            {fieldErrors.email && <div className="invalid-feedback">{fieldErrors.email}</div>}
          </div>
          <div className="form-floating mb-3">
            <input
              type="tel"
              className={`form-control${fieldErrors.phone ? ' is-invalid' : ''}`}
              id="registerPhone"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <label htmlFor="registerPhone">Phone</label>
            {fieldErrors.phone && <div className="invalid-feedback">{fieldErrors.phone}</div>}
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2 mt-2" disabled={loading} style={{ borderRadius: 8, fontWeight: 600, fontSize: 18 }}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="mt-3 text-center">
          <span className="text-muted">Already have an account? </span>
          <Link to="/login" className="fw-semibold">Login</Link>
        </div>
      </div>
      {/* Toast for error or success message */}
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

export default Register; 