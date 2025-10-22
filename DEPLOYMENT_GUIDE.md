# Deployment Guide

This guide will walk you through deploying the Dimentia Project v2.0 to production using Vercel (frontend) and Render (backend).

## Architecture Overview

- **Frontend**: Next.js 14 application hosted on Vercel
- **Backend**: FastAPI application hosted on Render
- **Database**: MongoDB Atlas (already configured)

## Prerequisites

1. GitHub account (for code repository)
2. Vercel account (https://vercel.com)
3. Render account (https://render.com)
4. MongoDB Atlas account (already configured)

## Step 1: Prepare Your Repository

### Push to GitHub

```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit - Dimentia Project v2.0"

# Create a new repository on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/dimentia-project.git
git branch -M main
git push -u origin main
```

### Important: Create .gitignore

Make sure you have a `.gitignore` file to exclude sensitive files:

```
# Python
__pycache__/
*.py[cod]
venv/
venv311/
*.so
.Python
*.egg-info/

# Environment variables
.env
.env.local
.env.production

# Node
node_modules/
.next/
out/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo
```

## Step 2: Deploy Backend to Render

### Option A: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Web Service"**
3. **Connect GitHub Repository**: Select your `dimentia-project` repository
4. **Configure Service**:
   - **Name**: `dimentia-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

5. **Set Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   PYTHON_VERSION=3.11.9
   MONGO_URI=mongodb+srv://wannabehacker0506_db_user:HjdDyVfqrsWXdOSu@cluster0.am7ybpw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   MONGO_ENABLE_TLS=true
   SECRET_KEY=your-secret-key-here-generate-random-string
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ALLOWED_ORIGINS=http://localhost:3000,https://your-app.vercel.app
   ```

6. **Click "Create Web Service"**

7. **Wait for Deployment**: Render will build and deploy your backend
   - Monitor logs for any errors
   - Note your backend URL: `https://dimentia-backend.onrender.com`

### Option B: Using render.yaml (Blueprint)

1. The `render.yaml` file is already created in the `backend/` directory
2. In Render Dashboard, click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect `render.yaml` automatically
5. Fill in the environment variables that are marked as `sync: false`:
   - `MONGO_URI`
   - `ALLOWED_ORIGINS`

### Verify Backend Deployment

Visit: `https://your-backend-url.onrender.com/health`

You should see:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

## Step 3: Deploy Frontend to Vercel

### Using Vercel Dashboard

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Click "Add New..."** → **"Project"**
3. **Import Git Repository**: Select your `dimentia-project` repository
4. **Configure Project**:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

5. **Set Environment Variables**:
   ```
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NEXTAUTH_SECRET=generate-random-secret-here
   NEXT_PUBLIC_BACKEND_URL=https://dimentia-backend.onrender.com
   ```

   **Generate NEXTAUTH_SECRET**:
   ```bash
   # On your local machine
   openssl rand -base64 32
   ```

6. **Click "Deploy"**

7. **Wait for Deployment**: Vercel will build and deploy your frontend
   - First deployment takes 2-3 minutes
   - Note your frontend URL: `https://your-app.vercel.app`

### Update Backend CORS

After you have your Vercel URL, go back to Render and update the `ALLOWED_ORIGINS` environment variable:

```
ALLOWED_ORIGINS=http://localhost:3000,https://your-app.vercel.app
```

Then trigger a redeploy of your backend service.

## Step 4: Verify Full Deployment

### Test Backend API

```bash
curl https://dimentia-backend.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected"
}
```

### Test Frontend

1. Visit `https://your-app.vercel.app`
2. You should see the landing page
3. Try clicking "Start Assessment" to verify API connectivity

### Test Database Connection

```bash
curl -X POST https://dimentia-backend.onrender.com/api/sessions/start \
  -H "Content-Type: application/json" \
  -d '{"candidate_name": "Test User"}'
```

Expected response:
```json
{
  "session_id": "...",
  "candidate_name": "Test User",
  "started_at": "..."
}
```

## Step 5: Production Configuration

### Security Checklist

- ✅ **Environment Variables**: All secrets are in environment variables, not code
- ✅ **CORS**: Only allow your production frontend domain
- ✅ **MongoDB**: TLS enabled with strong password
- ✅ **NextAuth**: Random secret generated
- ✅ **API Keys**: JWT secret is random and secure

### Update ALLOWED_ORIGINS for Production

In Render, update `ALLOWED_ORIGINS` to only include production URL:

```
ALLOWED_ORIGINS=https://your-app.vercel.app
```

### Enable HTTPS (Automatic)

Both Vercel and Render provide HTTPS automatically:
- Vercel: Automatic SSL with Let's Encrypt
- Render: Automatic SSL with Let's Encrypt

### Set up Custom Domain (Optional)

#### For Frontend (Vercel):
1. Go to your project settings → "Domains"
2. Add your custom domain (e.g., `dimentia.example.com`)
3. Update DNS records as instructed by Vercel
4. Update `NEXTAUTH_URL` to your custom domain

#### For Backend (Render):
1. Go to your service settings → "Custom Domains"
2. Add your custom domain (e.g., `api.dimentia.example.com`)
3. Update DNS records as instructed by Render
4. Update `NEXT_PUBLIC_BACKEND_URL` in Vercel to your custom domain

## Step 6: Monitoring and Maintenance

### Render Backend Monitoring

1. **View Logs**: Render Dashboard → Your Service → "Logs"
2. **Metrics**: Monitor CPU, memory, and request metrics
3. **Alerts**: Set up email alerts for service failures

### Vercel Frontend Monitoring

1. **Analytics**: Vercel Dashboard → Your Project → "Analytics"
2. **Logs**: View function logs and errors
3. **Speed Insights**: Monitor page load performance

### MongoDB Atlas Monitoring

1. **Database Monitoring**: Atlas Dashboard → Your Cluster → "Metrics"
2. **Performance**: Monitor query performance
3. **Alerts**: Set up alerts for high connection count or slow queries

## Troubleshooting

### Backend Deployment Issues

#### Problem: "Module not found" errors
**Solution**: Ensure `requirements.txt` is in the `backend/` directory and contains all dependencies.

#### Problem: MongoDB connection timeout
**Solution**: 
1. Check `MONGO_URI` is correct in Render environment variables
2. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0` (allow all)
3. Check `MONGO_ENABLE_TLS=true` is set

#### Problem: Python version mismatch
**Solution**: Set `PYTHON_VERSION=3.11.9` in Render environment variables.

### Frontend Deployment Issues

#### Problem: "NEXTAUTH_URL is not defined"
**Solution**: Add `NEXTAUTH_URL` environment variable in Vercel project settings.

#### Problem: API calls failing
**Solution**: 
1. Check `NEXT_PUBLIC_BACKEND_URL` points to correct Render URL
2. Verify backend is running and accessible
3. Check CORS settings in backend allow your Vercel domain

#### Problem: Build fails with module errors
**Solution**: Run `npm install` locally to verify `package.json` is correct.

### Database Issues

#### Problem: "ServerSelectionTimeoutError"
**Solution**:
1. Verify MongoDB Atlas cluster is running
2. Check IP whitelist allows connections from Render
3. Verify connection string includes `retryWrites=true&w=majority`

#### Problem: SSL/TLS handshake error
**Solution**: Ensure `MONGO_ENABLE_TLS=true` is set in Render environment variables.

## Free Tier Limitations

### Render Free Tier
- Spins down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free compute time
- Consider upgrading to paid plan for production

### Vercel Hobby (Free) Tier
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS
- Good for MVP and testing

### MongoDB Atlas Free Tier (M0)
- 512 MB storage
- Shared RAM
- Good for development and small-scale testing
- Consider upgrading for production

## Continuous Deployment

Both Vercel and Render support automatic deployments:

1. **Push to GitHub**: Any push to `main` branch triggers deployment
2. **Pull Request Previews**: Vercel creates preview URLs for PRs
3. **Rollback**: Easy rollback to previous deployments

### Git Workflow

```bash
# Make changes locally
git add .
git commit -m "Add new feature"
git push origin main

# Vercel and Render will automatically deploy
```

## Production Checklist

Before going live:

- [ ] All environment variables set correctly
- [ ] Backend health check returns success
- [ ] Frontend connects to backend API
- [ ] Database operations work (create session, save results)
- [ ] CORS allows only production domain
- [ ] HTTPS enabled (automatic)
- [ ] Error monitoring set up
- [ ] Backups configured in MongoDB Atlas
- [ ] Custom domain configured (optional)
- [ ] NextAuth authentication working
- [ ] All 9 test modules functional

## Next Steps

1. **Test All Features**: Go through each test module and verify functionality
2. **Load Testing**: Test with multiple concurrent users
3. **Security Audit**: Review all API endpoints for security
4. **Performance Optimization**: Optimize slow queries and API calls
5. **User Acceptance Testing**: Have real users test the system

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Next.js Docs**: https://nextjs.org/docs

## Cost Estimates

### Free Tier (Testing/MVP)
- Vercel: Free
- Render: Free (with spin-down)
- MongoDB Atlas: Free (M0 cluster)
- **Total: $0/month**

### Production (Paid Tier)
- Vercel Pro: $20/month
- Render Standard: $7/month
- MongoDB Atlas M10: $0.08/hour (~$57/month)
- **Total: ~$84/month**

## Conclusion

Your Dimentia Project v2.0 is now deployed to production! 🎉

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://dimentia-backend.onrender.com
- **Database**: MongoDB Atlas (cloud-hosted)

Monitor your deployments and refer back to this guide for troubleshooting and maintenance.
