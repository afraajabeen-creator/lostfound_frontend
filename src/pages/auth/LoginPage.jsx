import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, PackageSearch, ShieldCheck, User } from 'lucide-react';
import { Toast } from '../../components/common/Toast';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await login({ email, password });
      if (res.success) {
        if (res.data.user.role === 'ROLE_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/student');
        }
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdmin = () => {
    setEmail('admin@campus.com');
    setPassword('Admin@123');
    setError('');
  };

  return (
    <div style={{ maxWidth: '440px', margin: '3rem auto', padding: '0 1rem' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div
            style={{
              width: '52px',
              height: '52px',
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              color: 'white',
              borderRadius: 'var(--radius-lg)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem',
              boxShadow: '0 8px 16px rgba(79, 70, 229, 0.25)',
            }}
          >
            <PackageSearch size={28} />
          </div>
          <h2>Welcome Back</h2>
          <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Sign in to the Campus Lost &amp; Found Portal
          </p>
        </div>

        {error && <Toast type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. yourname@campus.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : (
              <>
                <LogIn size={18} /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Credentials Autofill */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', marginBottom: '0.5rem', textAlign: 'center' }}>
            Testing / Viva Quick Fill
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={fillAdmin}
              className="btn btn-secondary btn-sm"
              style={{ flex: 1, fontSize: '0.8rem' }}
            >
              <ShieldCheck size={14} /> Admin Credentials
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          Don&apos;t have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Register as Student
          </Link>
        </div>
      </div>
    </div>
  );
};
