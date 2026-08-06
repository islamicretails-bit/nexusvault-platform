import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext';
import TwoFactorAuth from '../components/Auth/TwoFactorAuth';
import ErrorBoundary from '../components/ErrorBoundary';
import { OAuth2Login } from '../components/OAuth2Login';
import { GlassmorphismContainer } from '../components/GlassmorphismContainer';
import { PremiumDarkTheme, PremiumLightTheme } from '../components/PremiumTheme';
import { getTheme } from '../utils/theme';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(getTheme() === 'dark');
  const [is2FATokenSent, setIs2FATokenSent] = useState(false);
  const [twoFAToken, setTwoFAToken] = useState('');

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login(username, password);
      if (isAuthenticated) {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handle2FATokenSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login(username, password, twoFAToken);
      if (isAuthenticated) {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'light' : 'dark');
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <ErrorBoundary>
      <GlassmorphismContainer>
        {isDarkMode ? <PremiumDarkTheme /> : <PremiumLightTheme />}
        <div className="login-container">
          <h1>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <label>
              Username:
              <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
            </label>
            <label>
              Password:
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Login'}
            </button>
          </form>
          {is2FATokenSent && (
            <form onSubmit={handle2FATokenSubmit}>
              <label>
                2FA Token:
                <input type="text" value={twoFAToken} onChange={(event) => setTwoFAToken(event.target.value)} />
              </label>
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Submit 2FA Token'}
              </button>
            </form>
          )}
          <OAuth2Login />
          <TwoFactorAuth on2FATokenSent={() => setIs2FATokenSent(true)} />
          <button className="theme-toggle" onClick={handleThemeToggle}>
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>
      </GlassmorphismContainer>
    </ErrorBoundary>
  );
};

export default Login;