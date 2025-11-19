// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// IMPORT BOTH ROUTES — THIS WAS MISSING!
import contactRoutes from './routes/contact.js';
import hireRouter from './routes/hire.js';   // THIS LINE WAS MISSING!!!

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// MOUNT ROUTES — BOTH MUST BE HERE
app.use('/api/contact', contactRoutes);
app.use('/api/hire', hireRouter);   // NOW IT WORKS!

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'GetFix Academy Backend is LIVE!' });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Backend RUNNING → http://localhost:${PORT}`);
  console.log(`Hire Form URL → http://localhost:${PORT}/api/hire`);
});