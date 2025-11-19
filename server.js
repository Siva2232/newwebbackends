import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// IMPORT BOTH ROUTES
import contactRoutes from './routes/contact.js';
import hireRouter from './routes/hire.js';

dotenv.config();

const app = express();

// Middleware — allow both production and local frontend origins with a function
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://getfixwebsite.netlify.app',
      'http://localhost:5173'
    ];
    // Allow requests with no origin like Postman or curl
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json());

// MOUNT ROUTES
app.use('/api/contact', contactRoutes);
app.use('/api/hire', hireRouter);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'GetFix Academy Backend is LIVE!' });
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Backend RUNNING → http://localhost:${PORT}`);
  console.log(`Hire Form URL → http://localhost:${PORT}/api/hire`);
});
