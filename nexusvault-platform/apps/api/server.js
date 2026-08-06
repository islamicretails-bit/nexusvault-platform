const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const auth = require('../packages/security/auth');
const aiEngine = require('../packages/ai-engine/index');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));

app.get('/healthcheck', (req, res) => {
  res.status(200).send('API is up and running');
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await prisma.user.create({
      data: {
        id: uuidv4(),
        name,
        email,
        password: await auth.hashPassword(password),
      },
    });
    res.status(201).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to register user' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }
    const isValidPassword = await auth.comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send({ message: 'Invalid email or password' });
    }
    const token = await auth.generateToken(user);
    res.status(200).send({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to login user' });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).send(products);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to retrieve products' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const product = await prisma.product.create({
      data: {
        id: uuidv4(),
        name,
        description,
        price,
      },
    });
    res.status(201).send(product);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to create product' });
  }
});

app.get('/ai/recommendations', async (req, res) => {
  try {
    const recommendations = await aiEngine.getRecommendations();
    res.status(200).send(recommendations);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Failed to retrieve recommendations' });
  }
});

app.listen(port, () => {
  console.log(`API server listening on port ${port}`);
});