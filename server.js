import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import predefinedRoutes from './routes/predefinedRoutes.js';
import drawRoutes from './routes/drawRoutes.js';
import paymentMethodRoutes from './routes/paymentMethodRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ── Middleware ─────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    // Check if in static allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    try {
      const url = new URL(origin);
      const hostname = url.hostname;
      
      // Allow localhost, loopback, and local network IPs (e.g. 192.168.x.x, 10.x.x.x, 172.x.x.x)
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '[::1]' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.')
      ) {
        return callback(null, true);
      }
    } catch (e) {
      // URL parsing failed
    }

    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ── Routes ─────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/predefined', predefinedRoutes);
app.use('/api/draw', drawRoutes);
app.use('/api/payment-methods', paymentMethodRoutes);

// ── Health check ───────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok', service: 'CGA Reunion API' }));

// ── 404 handler ────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// ── Error handler ──────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ── Database + Server ─────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas connected');
    app.listen(PORT, () => {
      console.log(`🚀 CGA Reunion API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
