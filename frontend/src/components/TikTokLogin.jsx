import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// TikTok SVG Icon
const TikTokIcon = () => (
  <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 10, verticalAlign: 'middle' }}>
    <circle cx="24" cy="24" r="24" fill="#fff"/>
    <path d="M32.5 14.5c-1.1 0-2-.9-2-2V10h-4v18.5c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.3 0 .7 0 1 .1v-4.1c-.3 0-.7-.1-1-.1-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8V22.7c1.2.5 2.6.8 4 .8v-4c-1.1 0-2-.9-2-2v-3z" fill="#010101"/>
    <path d="M32.5 14.5c-1.1 0-2-.9-2-2V10h-4v18.5c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.3 0 .7 0 1 .1v-4.1c-.3 0-.7-.1-1-.1-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8V22.7c1.2.5 2.6.8 4 .8v-4c-1.1 0-2-.9-2-2v-3z" fill="#25F4EE"/>
    <path d="M32.5 14.5c-1.1 0-2-.9-2-2V10h-4v18.5c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.3 0 .7 0 1 .1v-4.1c-.3 0-.7-.1-1-.1-4.4 0-8 3.6-8 8s3.6 8 8 8 8-3.6 8-8V22.7c1.2.5 2.6.8 4 .8v-4c-1.1 0-2-.9-2-2v-3z" fill="#FE2C55" fillOpacity=".7"/>
  </svg>
);

const TikTokShopOAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // Start OAuth flow by getting the auth URL and redirecting
  const startOAuthFlow = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.get('/tiktok/auth_url');
      window.location.href = response.data.authorization_url;
    } catch (err) {
      setError(`Error starting OAuth flow: ${err.response?.data?.detail || err.message}`);
      setLoading(false);
    }
  };

  // Exchange authorization code for tokens
  const exchangeCode = useCallback(async (authCode) => {
    if (!authCode) return;
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      const response = await apiClient.post('/tiktok/exchange_code?auth_code=' + encodeURIComponent(authCode));
      const newTokenData = response.data.token_data;
      login(newTokenData);
      setSuccess(`✅ Login successful! Welcome ${newTokenData.seller_name}. Redirecting to dashboard...`);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(`Error exchanging code: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  }, [login, navigate]);

  // Check URL for auth code on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      exchangeCode(code);
    }
  }, [exchangeCode]);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(120deg, #25f4ee 0%, #fe2c55 50%, #fff1f7 100%)',
      backgroundAttachment: 'fixed',
      overflow: 'hidden',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.25)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: '24px',
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
          Welcome to TikTok Shop
        </h1>
        {error && (
          <div style={{ backgroundColor: '#fee', border: '1px solid #fcc', padding: '10px', borderRadius: '6px', marginBottom: '20px', color: '#c00', fontWeight: 500 }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        {success && (
          <div style={{ backgroundColor: '#e8f5e8', border: '1px solid #d3e3d3', padding: '10px', borderRadius: '6px', marginBottom: '20px', color: '#006400', fontWeight: 500 }}>
            <strong>Success:</strong> {success}
          </div>
        )}
        <button
          onClick={startOAuthFlow}
          disabled={loading}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '16px 0',
            background: 'linear-gradient(90deg, #25f4ee 0%, #010101 60%, #fe2c55 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1.15rem',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 12px rgba(31,38,135,0.10)',
            marginTop: 8,
            marginBottom: 8,
            letterSpacing: '0.5px',
            transition: 'transform 0.12s',
            outline: 'none',
            gap: 8,
          }}
        >
          <TikTokIcon />
          {loading ? 'Processing...' : 'Login with TikTok Shop'}
        </button>
        <div style={{ marginTop: 32, color: '#222', fontSize: '1rem', opacity: 0.7, fontWeight: 400 }}>
          Secure TikTok Shop authentication for creators & sellers
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

export default TikTokShopOAuth;