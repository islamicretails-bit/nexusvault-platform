import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Login from '../pages/admin/login';
import TwoFactorAuth from '../components/Auth/TwoFactorAuth';
import ErrorBoundary from '../components/ErrorBoundary';

const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(ctx.json({ token: 'mock-token' }));
  }),
  rest.post('/api/auth/2fa', (req, res, ctx) => {
    return res(ctx.json({ token: 'mock-2fa-token' }));
  }),
  rest.get('/api/auth/error', (req, res, ctx) => {
    return res(ctx.status(401), ctx.json({ error: 'Invalid credentials' }));
  }),
);

describe('Auth Test Suite', () => {
  beforeEach(() => {
    server.listen();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it('should render login page', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router location={history.location} navigator={history}>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </Router>,
    );
    expect(getByText('Login')).toBeInTheDocument();
  });

  it('should handle successful login', async () => {
    const history = createMemoryHistory();
    const { getByText, getByPlaceholderText } = render(
      <Router location={history.location} navigator={history}>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </Router>,
    );
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Login');
    fireEvent.change(usernameInput, { target: { value: 'test-username' } });
    fireEvent.change(passwordInput, { target: { value: 'test-password' } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(history.location.pathname).toBe('/admin'));
  });

  it('should handle failed login', async () => {
    const history = createMemoryHistory();
    const { getByText, getByPlaceholderText } = render(
      <Router location={history.location} navigator={history}>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </Router>,
    );
    const usernameInput = getByPlaceholderText('Username');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Login');
    fireEvent.change(usernameInput, { target: { value: 'invalid-username' } });
    fireEvent.change(passwordInput, { target: { value: 'invalid-password' } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(getByText('Invalid credentials')).toBeInTheDocument());
  });

  it('should render 2fa page', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router location={history.location} navigator={history}>
        <AuthProvider>
          <TwoFactorAuth />
        </AuthProvider>
      </Router>,
    );
    expect(getByText('2FA')).toBeInTheDocument();
  });

  it('should handle successful 2fa', async () => {
    const history = createMemoryHistory();
    const { getByText, getByPlaceholderText } = render(
      <Router location={history.location} navigator={history}>
        <AuthProvider>
          <TwoFactorAuth />
        </AuthProvider>
      </Router>,
    );
    const codeInput = getByPlaceholderText('2FA Code');
    const submitButton = getByText('Verify');
    fireEvent.change(codeInput, { target: { value: '123456' } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(history.location.pathname).toBe('/admin'));
  });

  it('should handle failed 2fa', async () => {
    const history = createMemoryHistory();
    const { getByText, getByPlaceholderText } = render(
      <Router location={history.location} navigator={history}>
        <AuthProvider>
          <TwoFactorAuth />
        </AuthProvider>
      </Router>,
    );
    const codeInput = getByPlaceholderText('2FA Code');
    const submitButton = getByText('Verify');
    fireEvent.change(codeInput, { target: { value: 'invalid-code' } });
    fireEvent.click(submitButton);
    await waitFor(() => expect(getByText('Invalid 2FA code')).toBeInTheDocument());
  });

  it('should catch and render error boundary', async () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router location={history.location} navigator={history}>
        <ErrorBoundary>
          <div>
            <button onClick={() => {
              throw new Error('Test error');
            }}>
              Throw error
            </button>
          </div>
        </ErrorBoundary>
      </Router>,
    );
    const button = getByText('Throw error');
    fireEvent.click(button);
    await waitFor(() => expect(getByText('An error occurred')).toBeInTheDocument());
  });
});