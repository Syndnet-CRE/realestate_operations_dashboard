# Real Estate CRM - Complete Setup Guide

## Prerequisites

- [ ] Neon PostgreSQL database account (https://neon.tech)
- [ ] Render account for backend hosting (https://render.com)
- [ ] Netlify account for frontend hosting (https://netlify.com)
- [ ] GitHub account
- [ ] Anthropic API key (https://console.anthropic.com)

---

## STEP 1: Database Setup (Neon)

### 1.1 Create Database
1. Go to https://neon.tech
2. Create a new project (if you haven't already)
3. Copy your connection string (looks like):
   ```
   postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

### 1.2 Apply Database Schema

**Option A - Using Neon Dashboard (Recommended):**
1. Go to Neon dashboard → SQL Editor
2. Open `backend/src/config/realestate-schema.sql` from this repo
3. Copy entire file contents
4. Paste into SQL Editor and click "Run"
5. Verify: Should see "15 tables created successfully"

**Option B - Using psql CLI:**
```bash
psql "your-neon-connection-string" -f backend/src/config/realestate-schema.sql
```

### 1.3 Add Sample Data (Optional but Recommended)

This will add 5 sample properties, deals, contacts, and tasks so you can test the dashboard:

**Using Neon Dashboard:**
1. Go to Neon dashboard → SQL Editor
2. Open `backend/src/config/sample-data.sql` from this repo
3. Copy and paste contents
4. Click "Run"
5. You should see: "Sample data inserted successfully!"

**Using psql:**
```bash
psql "your-neon-connection-string" -f backend/src/config/sample-data.sql
```

---

## STEP 2: GitHub OAuth Setup

### 2.1 Create OAuth App
1. Go to https://github.com/settings/developers
2. Click "OAuth Apps" → "New OAuth App"
3. Fill in:
   ```
   Application name: Real Estate CRM
   Homepage URL: https://your-app-name.netlify.app
   Authorization callback URL: https://your-backend.onrender.com/api/auth/github/callback
   ```
   (You'll update these URLs after deployment)
4. Click "Register application"
5. **SAVE** the Client ID
6. Click "Generate a new client secret"
7. **SAVE** the Client Secret (you won't see it again!)

### 2.2 Generate JWT Secret
Run this command to generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
**SAVE** this output - you'll need it for Render

---

## STEP 3: Backend Deployment (Render)

### 3.1 Create Web Service
1. Go to https://render.com/dashboard
2. Click "New" → "Web Service"
3. Connect your GitHub repo: `Syndnet-CRE/realestate_operations_dashboard`
4. Configure:
   ```
   Name: realestate-crm-backend
   Branch: claude/create-git-frontend-011CUyigQXPSjMmqn5kuzePb
   Root Directory: backend
   Build Command: npm install
   Start Command: node src/server.js
   ```

### 3.2 Add Environment Variables

Click "Environment" and add these variables:

```bash
DATABASE_URL=postgresql://your-neon-connection-string-here
JWT_SECRET=your-generated-jwt-secret-from-step-2.2
GITHUB_CLIENT_ID=your-github-oauth-client-id-from-step-2.1
GITHUB_CLIENT_SECRET=your-github-oauth-secret-from-step-2.1
FRONTEND_URL=https://your-app-name.netlify.app
ANTHROPIC_API_KEY=your-anthropic-api-key
PORT=3000
NODE_ENV=production
```

### 3.3 Deploy
1. Click "Create Web Service"
2. Wait for deployment (usually 2-3 minutes)
3. Copy your Render URL (e.g., `https://realestate-crm-backend.onrender.com`)

### 3.4 Update GitHub OAuth Callback URL
1. Go back to GitHub OAuth app settings
2. Update "Authorization callback URL" to: `https://your-render-url.onrender.com/api/auth/github/callback`
3. Save changes

---

## STEP 4: Frontend Deployment (Netlify)

### 4.1 Connect Repository
1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub and select repo: `Syndnet-CRE/realestate_operations_dashboard`
4. Configure:
   ```
   Branch: claude/create-git-frontend-011CUyigQXPSjMmqn5kuzePb
   Build command: npm run build
   Publish directory: dist
   ```

### 4.2 Add Environment Variable
1. Go to Site configuration → Environment variables
2. Add:
   ```
   Key: VITE_API_URL
   Value: https://your-render-backend-url.onrender.com
   ```
3. Click "Deploy site"

### 4.3 Update GitHub OAuth Homepage
1. Go back to GitHub OAuth app settings
2. Update "Homepage URL" to your Netlify URL: `https://your-app.netlify.app`
3. Save changes

### 4.4 Update Render Environment
1. Go back to Render dashboard → Your service → Environment
2. Update `FRONTEND_URL` to your Netlify URL: `https://your-app.netlify.app`
3. Save (this will trigger a redeploy)

---

## STEP 5: Test the Application

### 5.1 Login Test
1. Go to your Netlify URL: `https://your-app.netlify.app`
2. You should see the Real Estate CRM homepage
3. Click "Login with GitHub"
4. Authorize the app
5. You should be redirected back and logged in ✅

### 5.2 Test Dashboard
1. Click on "Deal Pipeline Dashboard" in the sidebar
2. If you loaded sample data, you should see:
   - 5 deals in various stages
   - Metrics showing total pipeline value
   - Kanban board with deals
3. Try dragging a deal to a different stage ✅

### 5.3 Test Underwriting
1. Click on "Underwriting Analysis Center"
2. Select a property from the list
3. Enter financial data in the form
4. Click "Save Analysis"
5. Data should be saved to database ✅

### 5.4 Test Property Workflow
1. Click on "Property Acquisition Workflow"
2. You should see properties listed on the left
3. Click on a property to view details
4. Check tasks and documents tabs ✅

---

## STEP 6: Troubleshooting

### Issue: "Failed to load dashboard data"
**Fix:**
- Check Render logs for backend errors
- Verify `DATABASE_URL` is correct in Render environment
- Verify database schema was applied correctly

### Issue: "Network Error" or API calls failing
**Fix:**
- Check `VITE_API_URL` in Netlify environment variables
- Verify backend is running on Render (check logs)
- Check CORS: `FRONTEND_URL` in Render must match your Netlify URL exactly

### Issue: GitHub OAuth redirect fails
**Fix:**
- Verify callback URL in GitHub OAuth app matches: `https://your-backend.onrender.com/api/auth/github/callback`
- Check `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in Render
- Check `FRONTEND_URL` in Render matches your Netlify URL

### Issue: Empty dashboard even with sample data
**Fix:**
- Check if data was inserted: Run `SELECT COUNT(*) FROM deals;` in Neon SQL Editor
- Check browser console for errors
- Check Render logs for API errors

---

## STEP 7: Next Steps

### Add Google Integrations (Coming Next)
- Google Drive for document storage
- Google Calendar for showing schedules
- Gmail for email tracking

### Customize the Application
- Update branding/colors in `src/index.css`
- Add your company logo in `src/assets/`
- Configure custom domain in Netlify

### Production Best Practices
- [ ] Set up SSL certificates (Netlify does this automatically)
- [ ] Enable Render auto-deploy from your branch
- [ ] Set up database backups in Neon
- [ ] Configure error monitoring (e.g., Sentry)
- [ ] Set up analytics (optional)

---

## Environment Variables Summary

### Backend (Render):
```bash
DATABASE_URL=<neon-connection-string>
JWT_SECRET=<generated-secret>
GITHUB_CLIENT_ID=<from-github-oauth>
GITHUB_CLIENT_SECRET=<from-github-oauth>
FRONTEND_URL=<netlify-url>
ANTHROPIC_API_KEY=<anthropic-key>
PORT=3000
NODE_ENV=production
```

### Frontend (Netlify):
```bash
VITE_API_URL=<render-backend-url>
```

---

## Support

If you encounter issues:
1. Check Render logs: Dashboard → Your service → Logs
2. Check Netlify logs: Site overview → Deploys → [latest deploy] → Deploy log
3. Check browser console for frontend errors (F12 → Console)
4. Verify all environment variables are set correctly

---

## Success Checklist

- [ ] Database schema applied successfully in Neon
- [ ] Sample data loaded (optional)
- [ ] GitHub OAuth app created
- [ ] Backend deployed to Render with all env vars
- [ ] Frontend deployed to Netlify with API URL
- [ ] Can login with GitHub
- [ ] Dashboard loads with data
- [ ] Can create/edit deals
- [ ] Can view underwriting analysis
- [ ] Can see property workflow

🎉 **Congratulations! Your Real Estate CRM is now live!**
