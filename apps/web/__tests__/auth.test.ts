import axios from 'axios';
import { describe, expect, it, beforeEach, afterEach } from '@jest/globals';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { API_URL } from '../../pages/api/checkout/session';
import { errorHandler } from '../../components/ErrorBoundary';
import { TwoFactorAuth } from '../../components/Auth/TwoFactorAuth';

const server = setupServer(
  rest.post(`${API_URL}/login`, (req, res, ctx) => {
    return res(ctx.json({ token: 'mock-token' }));
  }),
  rest.post(`${API_URL}/2fa`, (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  }),
  rest.get(`${API_URL}/user`, (req, res, ctx) => {
    return res(ctx.json({ id: 1, email: 'user@example.com' }));
  }),
  rest.get(`${API_URL}/error`, (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ message: 'Internal Server Error' }));
  }),
);

describe('Authentication Endpoints', () => {
  beforeEach(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should login successfully', async () => {
    const response = await axios.post(`${API_URL}/login`, {
      email: 'user@example.com',
      password: 'password',
    });
    expect(response.data.token).toBe('mock-token');
  });

  it('should handle 2FA authentication', async () => {
    const response = await axios.post(`${API_URL}/2fa`, {
      code: '123456',
    });
    expect(response.data.success).toBe(true);
  });

  it('should fetch user data', async () => {
    const response = await axios.get(`${API_URL}/user`);
    expect(response.data.id).toBe(1);
    expect(response.data.email).toBe('user@example.com');
  });

  it('should handle error response', async () => {
    try {
      await axios.get(`${API_URL}/error`);
    } catch (error) {
      expect(errorHandler(error)).toBe('Internal Server Error');
    }
  });

  it('should render TwoFactorAuth component', () => {
    const component = new TwoFactorAuth();
    expect(component).toBeDefined();
  });
});