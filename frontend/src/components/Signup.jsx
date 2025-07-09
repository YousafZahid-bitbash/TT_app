import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../api/api';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', form.email)
      .single();
    if (existingUser) {
      setError('A user with this email already exists.');
      setLoading(false);
      return;
    }

    // Insert new user
    const { error: insertError } = await supabase
      .from('users')
      .insert([
        {
          name: form.name,
          email: form.email,
          password_hash: form.password, // In production, hash the password!
          role: 'brand_admin', // Default role
          brand_id: null,
        },
      ]);
    if (insertError) {
      setError('Failed to sign up. Please try again.');
      setLoading(false);
      return;
    }
    setSuccess('Signup successful! You can now log in.');
    setLoading(false);
    setTimeout(() => navigate('/'), 1500);
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
      `}</style>
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
      }}>
        <h1 style={{
          marginBottom: 28,
          fontWeight: 800,
          fontSize: '2.2rem',
          letterSpacing: '-1px',
          background: 'linear-gradient(90deg, #25f4ee 0%, #010101 40%, #fe2c55 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Sign Up
        </h1>
        {error && (
          <div style={{ backgroundColor: '#fee', border: '1px solid #fcc', padding: '10px', borderRadius: '6px', marginBottom: '20px', color: '#c00', fontWeight: 500 }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        {success && (
          <div style={{ backgroundColor: '#e6ffe6', border: '1px solid #b2ffb2', padding: '10px', borderRadius: '6px', marginBottom: '20px', color: '#008000', fontWeight: 500 }}>
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Username"
            value={form.name}
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
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <div style={{ marginTop: 16, fontSize: 15 }}>
          Already have an account? <a href="/" style={{ color: '#25f4ee', fontWeight: 700, textDecoration: 'underline', fontSize: 16 }}>Log in</a>
        </div>
      </div>
    </div>
  );
};

export default Signup; 