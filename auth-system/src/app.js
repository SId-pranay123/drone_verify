import express from 'express';
import dotenv from 'dotenv';
import { connectDB, connectRedis } from './config/index.js';
import droneRoutes from './routes/droneRoutes.js';
import logger from './utils/logger.js'; // optional

dotenv.config();

const app = express();
app.use(express.json());

// Connect to DB and Redis
connectDB();
// connectRedis();

// Register routes
app.use('/drone', droneRoutes);

// Health check
app.get('/health', (req, res) => {
  res.send('OK');
});

// Global error handler (example)
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ message: 'Server Error', error: err });
});

export default app;
