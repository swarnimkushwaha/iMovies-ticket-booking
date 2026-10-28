import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModals = ({ authMode, onClose }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(authMode === 'register');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isRegister) {
        await register(formData.name, formData.email, formData.password, formData.role);
      } else {
        await login(formData.email, formData.password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark border border-secondary text-white shadow-2xl rounded-4">
          <div className="modal-header border-secondary p-4">
            <h5 className="modal-title fw-bold">
              {isRegister ? 'Join The IMovies' : 'Sign In to Your Account'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4">
            {error && <div className="alert alert-danger py-2 small">{error}</div>}

            <form onSubmit={handleSubmit}>
              {isRegister && (
                <div className="mb-3">
                  <label className="form-label text-secondary small">Full Name</label>
                  <input 
                    type="text" 
                    className="form-control bg-secondary-subtle border-secondary text-white" 
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required 
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label text-secondary small">Email Address</label>
                <input 
                  type="email" 
                  className="form-control bg-secondary-subtle border-secondary text-white" 
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-secondary small">Password</label>
                <input 
                  type="password" 
                  className="form-control bg-secondary-subtle border-secondary text-white" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                />
              </div>

              {isRegister && (
                <div className="mb-4">
                  <label className="form-label text-secondary small">Role</label>
                  <select 
                    className="form-select bg-secondary-subtle border-secondary text-white"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="customer">Customer / Movie Goer</option>
                    <option value="admin">Cinema Administrator</option>
                  </select>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-danger w-100 py-3 fw-bold rounded-3 mb-3"
                disabled={submitting}
              >
                {submitting ? 'Please wait...' : (isRegister ? 'Create Account' : 'Sign In')}
              </button>

              <div className="text-center text-secondary small">
                {isRegister ? (
                  <span>
                    Already have an account?{' '}
                    <button 
                      type="button" 
                      className="btn btn-link text-danger p-0 align-baseline"
                      onClick={() => setIsRegister(false)}
                    >
                      Sign In
                    </button>
                  </span>
                ) : (
                  <span>
                    Don't have an account yet?{' '}
                    <button 
                      type="button" 
                      className="btn btn-link text-danger p-0 align-baseline"
                      onClick={() => setIsRegister(true)}
                    >
                      Sign Up
                    </button>
                  </span>
                )}
              </div>
            </form>

            {!isRegister && (
              <div className="mt-4 p-3 bg-secondary-subtle rounded-3 border border-secondary text-secondary small">
                <div className="fw-bold text-white mb-1">Quick Demo Credentials:</div>
                <div>Customer: <code>user@imovies.com</code> / <code>password123</code></div>
                <div>Admin: <code>admin@imovies.com</code> / <code>password123</code></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModals;
