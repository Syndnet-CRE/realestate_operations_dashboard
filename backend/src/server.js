import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth.js';
import githubRoutes from './routes/github.js';
import aiRoutes from './routes/ai.js';

// Import database
import pool from './config/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});

app.use('/api/', limiter);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await pool.query('SELECT NOW()');
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
    });
  }
});

// API routes
app.use('/auth', authRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/ai', aiRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Real Estate Operations Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        github: '/auth/github',
        callback: '/auth/github/callback',
        me: '/auth/me',
        logout: '/auth/logout',
      },
      github: {
        repo: '/api/github/repos/:owner/:repo',
        contents: '/api/github/repos/:owner/:repo/contents/*',
        commits: '/api/github/repos/:owner/:repo/commits',
        issues: '/api/github/repos/:owner/:repo/issues',
        pulls: '/api/github/repos/:owner/:repo/pulls',
        contributors: '/api/github/repos/:owner/:repo/contributors',
        readme: '/api/github/repos/:owner/:repo/readme',
        favorites: '/api/github/favorites',
      },
      ai: {
        chat: '/api/ai/chat',
        analyzeCode: '/api/ai/analyze-code',
        summarizeCommits: '/api/ai/summarize-commits',
        reviewPR: '/api/ai/review-pr',
        conversations: '/api/ai/conversations',
      },
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Server started successfully!');
  console.log(`📡 API running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`\n📚 API Documentation available at: http://localhost:${PORT}/`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  app.close(() => {
    console.log('HTTP server closed');
    pool.end();
  });
});
