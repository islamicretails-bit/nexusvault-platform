import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { verify } from 'jsonwebtoken';
import { compare } from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findFirst({
          where: { username: credentials.username },
        });

        if (!user) {
          return null;
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    jwt: async (token, user, account, profile, isNewUser) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async (session, token) => {
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  secret: process.env.SECRET,
  jwt: {
    secret: process.env.SECRET,
    encryption: true,
  },
  debug: process.env.NODE_ENV === 'development',
});

export const authenticate = async (req, res) => {
  const token = req.cookies['auth-token'];

  if (!token) {
    return { authenticated: false, user: null };
  }

  try {
    const decoded = verify(token, process.env.SECRET);
    const user = await prisma.user.findFirst({
      where: { id: decoded.id },
    });

    if (!user) {
      return { authenticated: false, user: null };
    }

    return { authenticated: true, user };
  } catch (error) {
    return { authenticated: false, user: null };
  }
};

export const requireAuth = async (req, res, next) => {
  const { authenticated, user } = await authenticate(req, res);

  if (!authenticated) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  req.user = user;
  next();
};