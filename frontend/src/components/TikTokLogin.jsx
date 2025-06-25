// import React from 'react';
// import axios from 'axios';

// const TikTokLogin = () => {




  
//   const handleLoginClick = async () => {
//     try {
//       // Redirect to the backend to start TikTok OAuth process
//       const response = await axios.get('/api/tiktok/login');
//       // This will redirect the user to TikTok's OAuth page
//       window.location.href = response.data.redirect_url; // Get the URL to redirect to TikTok OAuth page
//     } catch (error) {
//       console.error("Error redirecting to TikTok OAuth:", error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={handleLoginClick}>Login with TikTok</button>
//     </div>
//   );
// };

// export default TikTokLogin;


import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TikTokShopOAuth = () => {
  const [authUrl, setAuthUrl] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [tokenData, setTokenData] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE = '/api';

  // Get authorization URL
  const getAuthUrl = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE}/tiktok/auth_url`);
      setAuthUrl(response.data.authorization_url);
    } catch (err) {
      setError(`Error getting auth URL: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Start OAuth flow by redirecting to TikTok Shop
  const startOAuthFlow = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE}/tiktok/login`);
      // Redirect to TikTok Shop authorization page
      window.location.href = response.data.redirect_url;
    } catch (err) {
      setError(`Error starting OAuth flow: ${err.response?.data?.detail || err.message}`);
      setLoading(false);
    }
  };

  // Exchange authorization code for tokens
  const exchangeCode = async () => {
    if (!authCode.trim()) {
      setError('Please enter an authorization code');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${API_BASE}/tiktok/exchange_code?auth_code=${encodeURIComponent(authCode)}`);
      setTokenData(response.data.token_data);
      setAccessToken(response.data.token_data.access_token);
    } catch (err) {
      setError(`Error exchanging code: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test the access token
  const testToken = async () => {
    if (!accessToken.trim()) {
      setError('Please enter an access token');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${API_BASE}/tiktok/test_token?access_token=${encodeURIComponent(accessToken)}`);
      setTestResult(response.data);
    } catch (err) {
      setError(`Error testing token: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Refresh access token
  const refreshToken = async () => {
    if (!tokenData?.refresh_token) {
      setError('No refresh token available');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.post(`${API_BASE}/tiktok/refresh_token?refresh_token=${encodeURIComponent(tokenData.refresh_token)}`);
      setTokenData(response.data);
      setAccessToken(response.data.access_token);
    } catch (err) {
      setError(`Error refreshing token: ${err.response?.data?.detail || err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Check URL for auth code on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      setAuthCode(code);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>TikTok Shop OAuth Integration</h1>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fee', 
          border: '1px solid #fcc', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px',
          color: '#c00'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Step 1: Get Authorization URL */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Step 1: Get Authorization URL</h2>
        <p>First, get the TikTok Shop authorization URL:</p>
        <button 
          onClick={getAuthUrl} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#ff0050', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Loading...' : 'Get Authorization URL'}
        </button>
        
        {authUrl && (
          <div style={{ marginTop: '15px' }}>
            <p><strong>Authorization URL:</strong></p>
            <input 
              type="text" 
              value={authUrl} 
              readOnly 
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
            <button 
              onClick={() => window.open(authUrl, '_blank')}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: '#4CAF50', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Open in New Tab
            </button>
          </div>
        )}
      </div>

      {/* Step 2: Start OAuth Flow */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Step 2: Start OAuth Flow (Automatic Redirect)</h2>
        <p>Click this button to automatically redirect to TikTok Shop authorization:</p>
        <button 
          onClick={startOAuthFlow} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#ff0050', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Redirecting...' : 'Start TikTok Shop OAuth'}
        </button>
      </div>

      {/* Step 3: Exchange Code for Token */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Step 3: Exchange Authorization Code</h2>
        <p>After authorizing, paste the authorization code here:</p>
        <input 
          type="text" 
          placeholder="Enter authorization code from TikTok Shop redirect"
          value={authCode}
          onChange={(e) => setAuthCode(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <button 
          onClick={exchangeCode} 
          disabled={loading || !authCode.trim()}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#2196F3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading || !authCode.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Exchanging...' : 'Exchange Code for Token'}
        </button>

        {tokenData && (
          <div style={{ marginTop: '15px', backgroundColor: '#f0f8ff', padding: '15px', borderRadius: '4px' }}>
            <h3>Token Data:</h3>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(tokenData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Step 4: Test Access Token */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2>Step 4: Test Access Token</h2>
        <p>Test if your access token is working:</p>
        <input 
          type="text" 
          placeholder="Enter access token to test"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <button 
          onClick={testToken} 
          disabled={loading || !accessToken.trim()}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading || !accessToken.trim() ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Testing...' : 'Test Token'}
        </button>

        {tokenData?.refresh_token && (
          <button 
            onClick={refreshToken} 
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: '#FF9800', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Refreshing...' : 'Refresh Token'}
          </button>
        )}

        {testResult && (
          <div style={{ 
            marginTop: '15px', 
            backgroundColor: testResult.status === 'valid' ? '#e8f5e8' : '#ffe8e8', 
            padding: '15px', 
            borderRadius: '4px' 
          }}>
            <h3>Token Test Result:</h3>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h2>Instructions:</h2>
        <ol>
          <li><strong>Prerequisites:</strong> Make sure you have:
            <ul>
              <li>TikTok Shop Partner Center account</li>
              <li>Created an app in the Partner Center</li>
              <li>APP_KEY, APP_SECRET, and SERVICE_ID configured in your .env file</li>
              <li>Redirect URI set to: http://localhost:8000/tiktok/callback</li>
            </ul>
          </li>
          <li><strong>Get Auth URL:</strong> Click "Get Authorization URL" to generate the authorization link</li>
          <li><strong>Authorize:</strong> Open the URL and login with your TikTok Shop seller account</li>
          <li><strong>Get Code:</strong> After authorization, you'll be redirected with a code parameter</li>
          <li><strong>Exchange:</strong> Paste the code and click "Exchange Code for Token"</li>
          <li><strong>Test:</strong> Use the access token to test API calls</li>
        </ol>
      </div>

      {/* Environment Setup */}
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff8e1' }}>
        <h2>Environment Setup (.env file):</h2>
        <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
{`APP_KEY=your_app_key_from_tiktok_shop
APP_SECRET=your_app_secret_from_tiktok_shop
SERVICE_ID=your_service_id_from_tiktok_shop
Redirect_URI=http://localhost:8000/tiktok/callback`}
        </pre>
      </div>
    </div>
  );
};

export default TikTokShopOAuth;