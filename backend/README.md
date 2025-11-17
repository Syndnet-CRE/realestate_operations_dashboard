# Backend API - Real Estate Operations Dashboard

Node.js + Express backend with GitHub OAuth, PostgreSQL, and Claude AI integration.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create .env file (see .env.example)
cp .env.example .env

# Run database migrations
npm run db:migrate

# Start development server
npm run dev

# Start production server
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js      # PostgreSQL connection
│   │   ├── schema.sql        # Database schema
│   │   └── migrate.js        # Migration script
│   ├── middleware/
│   │   └── auth.js           # JWT authentication
│   ├── routes/
│   │   ├── auth.js           # GitHub OAuth routes
│   │   ├── github.js         # GitHub API proxy
│   │   └── ai.js             # Claude AI endpoints
│   ├── services/             # Business logic (future)
│   ├── models/               # Database models (future)
│   └── server.js             # Express app entry
├── package.json
└── .env.example
```

## 🔌 API Endpoints

### Authentication
- `GET /auth/github` - Get GitHub OAuth URL
- `GET /auth/github/callback` - OAuth callback
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

### GitHub API
- `GET /api/github/repos/:owner/:repo` - Get repository
- `GET /api/github/repos/:owner/:repo/contents/*` - Get files
- `GET /api/github/repos/:owner/:repo/commits` - Get commits
- `GET /api/github/repos/:owner/:repo/issues` - Get issues
- `POST /api/github/repos/:owner/:repo/issues` - Create issue
- `GET /api/github/repos/:owner/:repo/pulls` - Get PRs
- `GET /api/github/repos/:owner/:repo/contributors` - Contributors
- `POST /api/github/repos/:owner/:repo/favorite` - Favorite repo
- `GET /api/github/favorites` - Get favorites

### Claude AI
- `POST /api/ai/chat` - Chat with Claude
- `POST /api/ai/analyze-code` - Analyze code snippet
- `POST /api/ai/summarize-commits` - Summarize commits
- `POST /api/ai/review-pr` - Review pull request
- `GET /api/ai/conversations` - Get chat history

## 🔐 Environment Variables

See `.env.example` for all required variables.

Key variables:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET` - OAuth credentials
- `ANTHROPIC_API_KEY` - Claude AI API key
- `JWT_SECRET` - Token signing secret

## 🗄️ Database Schema

Tables:
- `users` - User accounts with GitHub info
- `favorite_repositories` - User's favorited repos
- `ai_chat_history` - Claude AI conversations
- `sessions` - User sessions
- `repository_cache` - API response cache

## 🚢 Deployment

See `DEPLOYMENT.md` for complete deployment guide to Render.

Quick deploy:
1. Push to GitHub
2. Connect to Render
3. Set environment variables
4. Deploy!

## 📝 License

MIT
