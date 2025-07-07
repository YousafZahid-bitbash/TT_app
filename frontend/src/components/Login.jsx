import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HARDCODED_USER = {
  username: "yousaf",
  email: "yousaf@example.com",
  password: "123456"
};

const Login = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (
      form.username === HARDCODED_USER.username &&
      form.email === HARDCODED_USER.email &&
      form.password === HARDCODED_USER.password
    ) {
      navigate('/tiktoklogin');
    } else {
      setError('Invalid credentials. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(120deg, #25f4ee 0%, #fe2c55 50%, #fff1f7 100%)',
      backgroundAttachment: 'fixed',
      overflow: 'hidden',
    }}>
      <style>{`
        @media (max-width: 1200px) {
          .login-flex-wrap {
            flex-direction: column !important;
            gap: 32px !important;
          }
        }
        @media (max-width: 700px) {
          .login-flex-wrap > div {
            min-width: 90vw !important;
            max-width: 98vw !important;
            min-height: 320px !important;
          }
        }
      `}</style>
      <div className="login-flex-wrap" style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 1200,
        gap: 56,
        flexWrap: 'wrap',
      }}>
        {/* Left side image container */}
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
            padding: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 630,
            minWidth: 1100,
            maxWidth: 1000000,
          }}>
            <img
              src={process.env.PUBLIC_URL + '/dash.png'}
              alt="Dashboard Visual"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '24px',
                boxShadow: '0 4px 24px rgba(31,38,135,0.10)',
                objectFit: 'cover',
              }}
            />
            <div style={{
              marginTop: 24,
              textAlign: 'center',
              fontSize: '1.25rem',
              color: '#222',
              fontWeight: 600,
              letterSpacing: '0.5px',
              opacity: 0.85,
              textShadow: '0 2px 8px rgba(31,38,135,0.06)',
            }}>
              Your Dashboard, Visualized
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
              background: 'linear-gradient(90deg, #25f4ee 0%, #010101 40%, #fe2c55 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Welcome Back
            </h1>
            {error && (
              <div style={{ backgroundColor: '#fee', border: '1px solid #fcc', padding: '10px', borderRadius: '6px', marginBottom: '20px', color: '#c00', fontWeight: 500 }}>
                <strong>Error:</strong> {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
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
                  marginBottom: 22,
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
                  padding: '16px 0',
                  borderRadius: '12px',
                  background: 'linear-gradient(90deg, #25f4ee 0%, #010101 60%, #fe2c55 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.15rem',
                  border: 'none',
                  boxShadow: '0 2px 12px rgba(31,38,135,0.10)',
                  letterSpacing: '0.5px',
                  marginTop: 8,
                  marginBottom: 8,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.12s',
                  outline: 'none',
                }}
              >
                {loading ? 'Processing...' : 'Login'}
              </button>
            </form>
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
