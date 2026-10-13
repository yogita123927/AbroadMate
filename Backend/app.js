
import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.js';
import universityRoutes from './routes/universities.js';
import shortlistRoutes from './routes/shortlist.js';
import preferenceRoutes from './routes/preferences.js';
import recommendationRoutes from './routes/recommendations.js';
import { notFound, errorHandler } from './middleware/errors.js';
import cors from 'cors';

const app = express();

app.disable('x-powered-by');

// Allow requests from the deployed Netlify frontend
app.use(cors({
  origin: 'https://abroadmate.netlify.app',
  credentials: true
}));


app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'AbroadMate API'
  });
});

// Rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests. Please try again later.'
  }
});

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/shortlist', shortlistRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
