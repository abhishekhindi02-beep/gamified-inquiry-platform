import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import apiRoutes from './routes/api.js';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    error: 'A server error occurred. Please try again.'
  });
});

app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(` Scientific Inquiry Platform Backend Service Listening `);
  console.log(` Port: ${config.port}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` AI Provider API Key Present: ${!!config.geminiApiKey || !!config.openaiApiKey}`);
  console.log(`=======================================================`);
});
