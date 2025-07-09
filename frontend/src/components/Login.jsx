import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/api';


const Login = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Query the users table for a user with the entered email
    const { data, error: supabaseError } = await supabase
      .from('users')
      .select('*')
      .eq('email', form.email)
      .single();

    if (supabaseError || !data) {
      setError('Invalid credentials. Please try again.');
      setLoading(false);
      return;
    }

    // For demo: compare plain password (in production, use hash compare)
    if (form.password === data.password_hash) {
      navigate('/tiktoklogin');
    } else {
      setError('Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      minHeight: '100vh',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(120deg, #25f4ee 0%, #fe2c55 50%, #fff1f7 100%)',
      backgroundAttachment: 'fixed',
      overflow: 'hidden',
      margin: 0,
      padding: 0,
    }}>
      <style>{`
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        @media (max-width: 1200px) {
          .login-flex-wrap {
            flex-direction: column !important;
            gap: 24px !important;
          }
        }
        @media (max-width: 700px) {
          .login-flex-wrap > div {
            min-width: 90vw !important;
            max-width: 98vw !important;
            min-height: 320px !important;
            padding: 32px 16px !important;
          }
        }
      `}</style>
      <div className="login-flex-wrap" style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
        gap: 56,
        flexWrap: 'wrap',
      }}>
        {/* Left side slogan container (replaces image) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.25)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            borderRadius: '32px',
            padding: '48px 36px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 300,
            minWidth: 400,
            maxWidth: 600,
            border: '1.5px solid #e0e0e0',
          }}>
            <div style={{
              fontSize: '2rem',
              fontWeight: 800,
              color: '#000', // pure black for maximum readability
              textAlign: 'center',
              letterSpacing: '0.5px',
              lineHeight: 1.2,
              background: 'none',
              WebkitBackgroundClip: 'unset',
              WebkitTextFillColor: 'unset',
              marginBottom: 12,
            }}>
              Empowering Brands & Creators<br />with Data-Driven Insights
            </div>
            <div style={{
              fontSize: '1.1rem',
              color: '#000', // pure black for maximum readability
              opacity: 1,
              textAlign: 'center',
              marginTop: 8,
              fontWeight: 500,
            }}>
              Unlock your growth potential with our unified dashboard for performance, inventory, and more.
            </div>
          </div>
        </div>
        {/* Right side login form container */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.25)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: '32px',
            border: '1.5px solid rgba(255,255,255,0.25)',
            padding: '48px 36px',
            minWidth: 340,
            maxWidth: 400,
            textAlign: 'center',
            animation: 'fadeIn 1.2s cubic-bezier(.39,.575,.565,1) both',
          }}>
            <style>{`
              @keyframes fadeIn {
                0% { opacity: 0; transform: translateY(40px) scale(0.98); }
                100% { opacity: 1; transform: translateY(0) scale(1); }
              }
            `}</style>
            <h1 style={{
              marginBottom: 28,
              fontWeight: 800,
              fontSize: '2.2rem',
              letterSpacing: '-1px',
              color: '#111',
              background: 'none',
              WebkitBackgroundClip: 'unset',
              WebkitTextFillColor: 'unset',
              textShadow: '0 2px 8px rgba(31,38,135,0.06)',
            }}>
              Login Page
            </h1>
            {error && (
              <div style={{ backgroundColor: '#fee', border: '1px solid #fcc', padding: '10px', borderRadius: '6px', marginBottom: '20px', color: '#c00', fontWeight: 500 }}>
                <strong>Error:</strong> {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  marginBottom: 14,
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: '1.5px solid #e0e0e0',
                  fontSize: 16,
                  background: 'rgba(255,255,255,0.7)',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  marginBottom: 24,
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: '1.5px solid #e0e0e0',
                  fontSize: 16,
                  background: 'rgba(255,255,255,0.7)',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  borderRadius: 8,
                  border: 'none',
                  background: 'linear-gradient(90deg, #25f4ee 0%, #fe2c55 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: 12,
                  boxShadow: '0 2px 8px rgba(31,38,135,0.10)',
                  transition: 'background 0.2s',
                }}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <div style={{ marginTop: 16, fontSize: 15 }}>
              Don't have an account? <a href="/signup" style={{ color: '#fe2c55', fontWeight: 700, textDecoration: 'underline', fontSize: 16 }}>Sign up</a>
            </div>
            <div style={{ marginTop: 32, color: '#222', fontSize: '1rem', opacity: 0.7, fontWeight: 400 }}>
              Please enter your credentials to continue
            </div>
          </div>
        </div>
      </div>
      {/* Decorative floating shapes */}
      <div style={{
        position: 'fixed',
        top: 0, left: 0, width: '100vw', height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        <svg width="100vw" height="100vh" style={{ position: 'absolute', top: 0, left: 0 }}>
          <circle cx="12%" cy="18%" r="60" fill="#25f4ee" fillOpacity="0.18" />
          <circle cx="90%" cy="80%" r="80" fill="#fe2c55" fillOpacity="0.13" />
          <circle cx="80%" cy="10%" r="40" fill="#010101" fillOpacity="0.10" />
        </svg>
      </div>
    </div>
  );
};

export default Login;
