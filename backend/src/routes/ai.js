import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { authenticateToken } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Chat with Claude about code/repository
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message, context, conversationId, repoFullName } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build conversation history
    let messages = [];

    if (conversationId) {
      const history = await pool.query(
        'SELECT role, content FROM ai_chat_history WHERE user_id = $1 AND conversation_id = $2 ORDER BY created_at ASC',
        [req.user.id, conversationId]
      );

      messages = history.rows.map(row => ({
        role: row.role,
        content: row.content,
      }));
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message,
    });

    // Build system prompt with context
    let systemPrompt = 'You are a helpful AI assistant that helps developers understand and work with code repositories. You can analyze code, explain commits, review issues, and help with pull requests.';

    if (context) {
      systemPrompt += `\n\nCurrent context:\n${JSON.stringify(context, null, 2)}`;
    }

    // Call Claude AI
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: systemPrompt,
      messages: messages,
    });

    const assistantMessage = response.content[0].text;

    // Generate or use existing conversation ID
    const convId = conversationId || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Save conversation to database
    await pool.query(
      'INSERT INTO ai_chat_history (user_id, repo_full_name, conversation_id, role, content) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, repoFullName || null, convId, 'user', message]
    );

    await pool.query(
      'INSERT INTO ai_chat_history (user_id, repo_full_name, conversation_id, role, content) VALUES ($1, $2, $3, $4, $5)',
      [req.user.id, repoFullName || null, convId, 'assistant', assistantMessage]
    );

    res.json({
      message: assistantMessage,
      conversationId: convId,
      usage: response.usage,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to process chat request' });
  }
});

// Analyze code snippet
router.post('/analyze-code', authenticateToken, async (req, res) => {
  try {
    const { code, language, question } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const prompt = question
      ? `${question}\n\nHere's the code:\n\`\`\`${language || ''}\n${code}\n\`\`\``
      : `Please analyze this code and explain what it does:\n\`\`\`${language || ''}\n${code}\n\`\`\``;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    res.json({
      analysis: response.content[0].text,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Code analysis error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze code' });
  }
});

// Summarize commits
router.post('/summarize-commits', authenticateToken, async (req, res) => {
  try {
    const { commits } = req.body;

    if (!commits || !Array.isArray(commits)) {
      return res.status(400).json({ error: 'Commits array is required' });
    }

    const commitsText = commits
      .map(
        c => `Commit ${c.sha?.substring(0, 7)}: ${c.commit?.message}\nBy ${c.commit?.author?.name}\n`
      )
      .join('\n');

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Please provide a concise summary of these commits:\n\n${commitsText}`,
        },
      ],
    });

    res.json({
      summary: response.content[0].text,
      usage: response.usage,
    });
  } catch (error) {
    console.error('Commit summary error:', error);
    res.status(500).json({ error: error.message || 'Failed to summarize commits' });
  }
});

// Review pull request
router.post('/review-pr', authenticateToken, async (req, res) => {
  try {
    const { title, body, diff } = req.body;

    if (!title || !diff) {
      return res.status(400).json({ error: 'Title and diff are required' });
    }

    const prompt = `Please review this pull request:

Title: ${title}
${body ? `Description: ${body}` : ''}

Code changes:
\`\`\`diff
${diff}
\`\`\`

Provide a constructive code review focusing on:
1. Code quality and best practices
2. Potential bugs or issues
3. Performance considerations
4. Suggestions for improvement`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    res.json({
      review: response.content[0].text,
      usage: response.usage,
    });
  } catch (error) {
    console.error('PR review error:', error);
    res.status(500).json({ error: error.message || 'Failed to review PR' });
  }
});

// Get conversation history
router.get('/conversations/:conversationId', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;

    const result = await pool.query(
      'SELECT id, role, content, created_at FROM ai_chat_history WHERE user_id = $1 AND conversation_id = $2 ORDER BY created_at ASC',
      [req.user.id, conversationId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all user conversations
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT conversation_id, repo_full_name, MIN(created_at) as started_at, MAX(created_at) as last_message_at
       FROM ai_chat_history
       WHERE user_id = $1
       GROUP BY conversation_id, repo_full_name
       ORDER BY last_message_at DESC
       LIMIT 50`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
