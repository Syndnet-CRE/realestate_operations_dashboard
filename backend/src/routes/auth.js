import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

const router = express.Router();

// Step 1: Redirect to GitHub OAuth
router.get('/github', (req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}&scope=repo,user,read:org`;
  res.json({ authUrl: githubAuthUrl });
});

// Step 2: GitHub OAuth callback
router.get('/github/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'No code provided' });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      }
    );

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      throw new Error('Failed to get access token');
    }

    // Get user info from GitHub
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const githubUser = userResponse.data;

    // Save or update user in database
    const result = await pool.query(
      `INSERT INTO users (github_id, username, email, avatar_url, access_token, last_login_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       ON CONFLICT (github_id)
       DO UPDATE SET
         username = $2,
         email = $3,
         avatar_url = $4,
         access_token = $5,
         last_login_at = CURRENT_TIMESTAMP
       RETURNING id, github_id, username, email, avatar_url`,
      [
        String(githubUser.id),
        githubUser.login,
        githubUser.email,
        githubUser.avatar_url,
        access_token,
      ]
    );

    const user = result.rows[0];

    // Generate JWT token
    const jwtToken = jwt.sign(
      {
        id: user.id,
        github_id: user.github_id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${jwtToken}&user=${encodeURIComponent(JSON.stringify(user))}`);
  } catch (error) {
    console.error('OAuth error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Authentication failed', details: error.message });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query(
      'SELECT id, github_id, username, email, avatar_url, created_at FROM users WHERE id = $1',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  // With JWT, logout is handled client-side by removing the token
  res.json({ message: 'Logged out successfully' });
});

export default router;
