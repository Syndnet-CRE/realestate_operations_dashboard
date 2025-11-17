# 🚀 Deployment Guide

Complete guide to deploy your Real Estate Operations Dashboard with GitHub integration.

## Architecture

```
Frontend (Netlify) ←→ Backend (Render) ←→ Database (Neon PostgreSQL)
                              ↓
                    GitHub API + Claude AI
```

---

## Prerequisites

1. **GitHub Account** - For OAuth app registration
2. **Netlify Account** - Frontend hosting (free tier)
3. **Render Account** - Backend hosting (free tier)
4. **Neon Account** - PostgreSQL database (free tier)
5. **Anthropic API Key** - Claude AI integration

---

## Step 1: Set Up Neon PostgreSQL Database

### 1.1 Create Database

1. Go to [Neon.tech](https://neon.tech)
2. Sign up / Log in
3. Create a new project
4. Copy the connection string (starts with `postgresql://`)

### 1.2 Run Migrations

```bash
cd backend
npm install
# Create .env file with DATABASE_URL
echo "DATABASE_URL=your_neon_connection_string_here" > .env
npm run db:migrate
```

---

## Step 2: Register GitHub OAuth App

### 2.1 Create OAuth App

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: Real Estate Operations Dashboard
   - **Homepage URL**: `https://your-app-name.netlify.app`
   - **Authorization callback URL**: `https://your-backend.onrender.com/auth/github/callback`
4. Click "Register application"
5. Copy **Client ID** and generate **Client Secret**

---

## Step 3: Deploy Backend to Render

### 3.1 Deploy

1. Go to [Render.com](https://render.com)
2. Sign up / Log in with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository: `Syndnet-CRE/realestate_operations_dashboard`
5. Configure:
   - **Name**: `realestate-operations-backend`
   - **Region**: Oregon (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3.2 Environment Variables

Add these in Render dashboard (Environment tab):

```
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://your-app-name.netlify.app
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=https://your-backend.onrender.com/auth/github/callback
SESSION_SECRET=generate_random_string_here
JWT_SECRET=generate_random_string_here
DATABASE_URL=your_neon_connection_string
ANTHROPIC_API_KEY=your_anthropic_api_key
GITHUB_TOKEN=optional_github_personal_access_token
```

### 3.3 Verify Deployment

Visit: `https://your-backend.onrender.com/health`

Should return: `{"status":"healthy"}`

---

## Step 4: Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up / Log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key (starts with `sk-ant-...`)
6. Add to Render environment variables as `ANTHROPIC_API_KEY`

---

## Step 5: Deploy Frontend to Netlify

### 5.1 Deploy

1. Go to [Netlify.com](https://netlify.com)
2. Sign up / Log in with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and authorize
5. Select repository: `Syndnet-CRE/realestate_operations_dashboard`
6. Configure:
   - **Branch**: `main`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
7. Click "Deploy site"

### 5.2 Environment Variables

In Netlify dashboard (Site settings → Environment variables):

```
VITE_API_URL=https://your-backend.onrender.com
```

### 5.3 Custom Domain (Optional)

1. Go to Domain settings
2. Add custom domain or use Netlify subdomain
3. Update GitHub OAuth callback URL if using custom domain

---

## Step 6: Update GitHub OAuth URLs

Go back to your GitHub OAuth App settings and update:

1. **Homepage URL**: Your Netlify URL
2. **Authorization callback URL**: Your Render backend URL + `/auth/github/callback`

---

## Step 7: Test the Application

### 7.1 Frontend

Visit your Netlify URL: `https://your-app.netlify.app/github-repository`

### 7.2 Authentication Flow

1. Click "Login with GitHub"
2. Authorize the app
3. You should be redirected back logged in

### 7.3 Features to Test

- ✅ View any public GitHub repository
- ✅ Browse files and folders
- ✅ View commit history
- ✅ See issues and pull requests
- ✅ Chat with Claude AI about code
- ✅ Favorite repositories

---

## 🔐 Security Checklist

- [ ] All secrets stored as environment variables (not in code)
- [ ] HTTPS enabled on all services
- [ ] GitHub OAuth callback URL matches exactly
- [ ] Database connection uses SSL
- [ ] CORS configured to allow only your frontend URL
- [ ] Rate limiting enabled
- [ ] Helmet.js security headers configured

---

## 🐛 Troubleshooting

### Backend won't start
- Check Render logs for errors
- Verify DATABASE_URL is correct
- Ensure all required env vars are set

### OAuth fails
- Verify GitHub OAuth URLs match exactly
- Check CLIENT_ID and CLIENT_SECRET
- Ensure callback URL includes `/auth/github/callback`

### Database connection fails
- Verify Neon connection string format
- Check SSL mode is enabled
- Run migrations: `npm run db:migrate`

### Frontend can't reach backend
- Verify VITE_API_URL is correct
- Check CORS settings in backend
- Inspect browser console for errors

---

## 📊 Monitoring

### Render

- **Logs**: View in Render dashboard
- **Metrics**: CPU, Memory, Response times
- **Health Check**: `/health` endpoint

### Netlify

- **Deploy logs**: Build and deploy status
- **Analytics**: Page views, performance
- **Functions**: Serverless function logs

### Neon

- **Queries**: Slow query log
- **Connections**: Active connections
- **Storage**: Database size

---

## 🔄 Continuous Deployment

Both Netlify and Render auto-deploy when you push to `main` branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

- Netlify rebuilds frontend automatically
- Render rebuilds backend automatically

---

## 💰 Cost Breakdown (Free Tier Limits)

- **Netlify**: 100GB bandwidth/month, 300 build minutes/month
- **Render**: 750 hours/month (1 free service)
- **Neon**: 3GB storage, 1 project
- **Anthropic**: Pay-as-you-go (free tier available)

---

## 🎉 You're Done!

Your full-stack GitHub repository viewer is now live!

**Frontend**: `https://your-app.netlify.app/github-repository`
**Backend**: `https://your-backend.onrender.com`
**Database**: Neon PostgreSQL

Need help? Check the logs or open an issue on GitHub!
