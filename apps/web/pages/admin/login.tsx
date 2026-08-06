import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';
import { TwoFactorAuth } from '../../components/Auth/TwoFactorAuth';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { glassmorphismDark, glassmorphismLight } from '../../styles/glassmorphism';
import { premiumDark, premiumLight } from '../../styles/premium';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';

const Login = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('light');
  const { register, handleSubmit, errors } = useForm();

  useEffect(() => {
    if (session) {
      router.push('/admin/dashboard');
    }
  }, [session, router]);

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', data);
      if (response.status === 200) {
        await signIn('credentials', { username: data.username, password: data.password, redirect: false });
        router.push('/admin/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorAuth = async (data) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/2fa', data);
      if (response.status === 200) {
        await signIn('credentials', { username: data.username, password: data.password, redirect: false });
        router.push('/admin/dashboard');
      } else {
        setError('Invalid 2FA code');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ErrorBoundary>
      <div className={theme === 'light' ? premiumLight : premiumDark}>
        <div className={theme === 'light' ? glassmorphismLight : glassmorphismDark}>
          <h1>Login</h1>
          <form onSubmit={handleSubmit(handleLogin)}>
            <label>Username:</label>
            <input type="text" {...register('username')} />
            {errors.username && <p>{errors.username.message}</p>}
            <label>Password:</label>
            <input type="password" {...register('password')} />
            {errors.password && <p>{errors.password.message}</p>}
            <button type="submit" disabled={loading}>
              {loading ? <Oval width="20" height="20" color="#fff" /> : 'Login'}
            </button>
          </form>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <TwoFactorAuth handleTwoFactorAuth={handleTwoFactorAuth} />
          <button type="button" onClick={handleThemeChange}>
            Switch to {theme === 'light' ? 'Dark' : 'Light'} theme
          </button>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {},
  };
};

export default Login;