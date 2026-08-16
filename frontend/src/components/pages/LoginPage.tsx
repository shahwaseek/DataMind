import React, { useState } from 'react';
import { IconBrain, IconShield } from '../ui/Icons';

interface LoginPageProps {
  onSuccess: () => void;
  onBackToLanding: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onBackToLanding }) => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0B0D10', color: '#F5F7FA', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 1rem' }}>
      {/* Header */}
      <div style={{ width: '100%', maxWidth: '440px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={onBackToLanding}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.9rem' }}
        >
          ← Back to Overview
        </button>
        <span style={{ fontSize: '0.8rem', color: '#6F7784', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <IconShield size={14} color="var(--accent-emerald)" /> Local Privacy Guaranteed
        </span>
      </div>

      {/* Login / Sign Up Card */}
      <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem 2rem', border: '1px solid #252A32', boxShadow: '0 0 40px rgba(198, 191, 255, 0.05)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #5845d9, #c6bfff)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <IconBrain size={24} color="#ffffff" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.35rem' }}>
            {isSignUp ? 'Create your workspace' : 'Welcome back'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
            {isSignUp ? 'Get started with local AI analytics.' : 'Sign in to your analytical environment.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
              Work Email
            </label>
            <input
              type="email"
              className="form-input"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', fontWeight: 600 }}>
                Password
              </label>
              {!isSignUp && (
                <a href="#" style={{ fontSize: '0.8rem', color: '#c6bfff', textDecoration: 'none' }}>
                  Forgot Password?
                </a>
              )}
            </div>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            {isSignUp ? 'Create Account →' : 'Sign In →'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: '0.75rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#252A32' }} />
          <span style={{ fontSize: '0.7rem', color: '#6F7784', textTransform: 'uppercase' }}>Or continue with</span>
          <div style={{ flex: 1, height: '1px', background: '#252A32' }} />
        </div>

        <button className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }} onClick={onSuccess}>
          <span className="material-symbols-outlined text-[18px]">vpn_key</span> Continue with Google / SSO
        </button>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
          {isSignUp ? 'Already have an account?' : 'New to DataMind?'}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'none', border: 'none', color: '#c6bfff', cursor: 'pointer', fontWeight: 600, marginLeft: '0.25rem' }}
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div style={{ fontSize: '0.8rem', color: '#6F7784' }}>
        &copy; 2026 DataMind AI Systems. All rights reserved.
      </div>
    </div>
  );
};
