import express from 'express';
import axios from 'axios';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Helper function to get GitHub access token
const getGitHubToken = async (userId) => {
  if (!userId) {
    return process.env.GITHUB_TOKEN || null;
  }

  const result = await pool.query(
    'SELECT access_token FROM users WHERE id = $1',
    [userId]
  );

  return result.rows[0]?.access_token || process.env.GITHUB_TOKEN || null;
};

// Helper function to make GitHub API calls
const githubAPI = async (endpoint, token, method = 'GET', data = null) => {
  const config = {
    method,
    url: `https://api.github.com${endpoint}`,
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (data) {
    config.data = data;
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    throw {
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.message,
    };
  }
};

// Get repository info
router.get('/repos/:owner/:repo', optionalAuth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const token = await getGitHubToken(req.user?.id);

    const data = await githubAPI(`/repos/${owner}/${repo}`, token);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Get repository contents/files
router.get('/repos/:owner/:repo/contents/*', optionalAuth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const path = req.params[0] || '';
    const token = await getGitHubToken(req.user?.id);

    const data = await githubAPI(`/repos/${owner}/${repo}/contents/${path}`, token);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Get commits
router.get('/repos/:owner/:repo/commits', optionalAuth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { page = 1, per_page = 30, sha } = req.query;
    const token = await getGitHubToken(req.user?.id);

    let endpoint = `/repos/${owner}/${repo}/commits?page=${page}&per_page=${per_page}`;
    if (sha) endpoint += `&sha=${sha}`;

    const data = await githubAPI(endpoint, token);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Get single commit
router.get('/repos/:owner/:repo/commits/:sha', optionalAuth, async (req, res) => {
  try {
    const { owner, repo, sha } = req.params;
    const token = await getGitHubToken(req.user?.id);

    const data = await githubAPI(`/repos/${owner}/${repo}/commits/${sha}`, token);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Get issues
router.get('/repos/:owner/:repo/issues', optionalAuth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { state = 'open', page = 1, per_page = 30 } = req.query;
    const token = await getGitHubToken(req.user?.id);

    const data = await githubAPI(
      `/repos/${owner}/${repo}/issues?state=${state}&page=${page}&per_page=${per_page}`,
      token
    );
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Get single issue
router.get('/repos/:owner/:repo/issues/:issue_number', optionalAuth, async (req, res) => {
  try {
    const { owner, repo, issue_number } = req.params;
    const token = await getGitHubToken(req.user?.id);

    const data = await githubAPI(`/repos/${owner}/${repo}/issues/${issue_number}`, token);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Create issue (requires auth)
router.post('/repos/:owner/:repo/issues', authenticateToken, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const token = await getGitHubToken(req.user.id);

    if (!token) {
      return res.status(401).json({ error: 'GitHub authentication required' });
    }

    const data = await githubAPI(`/repos/${owner}/${repo}/issues`, token, 'POST', req.body);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Get pull requests
router.get('/repos/:owner/:repo/pulls', optionalAuth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const { state = 'open', page = 1, per_page = 30 } = req.query;
    const token = await getGitHubToken(req.user?.id);

    const data = await githubAPI(
      `/repos/${owner}/${repo}/pulls?state=${state}&page=${page}&per_page=${per_page}`,
      token
    );
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Get single pull request
router.get('/repos/:owner/:repo/pulls/:pull_number', optionalAuth, async (req, res) => {
  try {
    const { owner, repo, pull_number } = req.params;
    const token = await getGitHubToken(req.user?.id);

    const data = await githubAPI(`/repos/${owner}/${repo}/pulls/${pull_number}`, token);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Get repository contributors
router.get('/repos/:owner/:repo/contributors', optionalAuth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const token = await getGitHubToken(req.user?.id);

    const data = await githubAPI(`/repos/${owner}/${repo}/contributors`, token);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Get repository languages
router.get('/repos/:owner/:repo/languages', optionalAuth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const token = await getGitHubToken(req.user?.id);

    const data = await githubAPI(`/repos/${owner}/${repo}/languages`, token);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Get repository branches
router.get('/repos/:owner/:repo/branches', optionalAuth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const token = await getGitHubToken(req.user?.id);

    const data = await githubAPI(`/repos/${owner}/${repo}/branches`, token);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Get repository README
router.get('/repos/:owner/:repo/readme', optionalAuth, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const token = await getGitHubToken(req.user?.id);

    const data = await githubAPI(`/repos/${owner}/${repo}/readme`, token);
    res.json(data);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
});

// Favorite/Unfavorite repository (requires auth)
router.post('/repos/:owner/:repo/favorite', authenticateToken, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const repo_full_name = `${owner}/${repo}`;

    await pool.query(
      `INSERT INTO favorite_repositories (user_id, repo_full_name, repo_owner, repo_name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, repo_full_name) DO NOTHING`,
      [req.user.id, repo_full_name, owner, repo]
    );

    res.json({ message: 'Repository favorited successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/repos/:owner/:repo/favorite', authenticateToken, async (req, res) => {
  try {
    const { owner, repo } = req.params;
    const repo_full_name = `${owner}/${repo}`;

    await pool.query(
      'DELETE FROM favorite_repositories WHERE user_id = $1 AND repo_full_name = $2',
      [req.user.id, repo_full_name]
    );

    res.json({ message: 'Repository unfavorited successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's favorite repositories
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM favorite_repositories WHERE user_id = $1 ORDER BY added_at DESC',
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
