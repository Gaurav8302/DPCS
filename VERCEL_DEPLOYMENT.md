# Vercel Deployment Configuration for Dimentia Project Frontend

## Environment Variables Setup

In your Vercel project dashboard, add these environment variables:

### Required Variables

1. **NEXTAUTH_URL**
   - Value: `https://your-project-name.vercel.app`
   - Note: After first deployment, update this with your actual Vercel URL
   - For initial deployment, you can use a placeholder like `https://dpcs-y5hy45.vercel.app`

2. **NEXTAUTH_SECRET**
   - Value: Generate a secure random string
   - Command to generate:
     ```bash
     openssl rand -base64 32
     ```
   - Example: `abcdef1234567890ghijklmnopqrstuv=`
   - **IMPORTANT**: Keep this secret and never commit to Git

3. **NEXT_PUBLIC_BACKEND_URL**
   - Value: Your Render backend URL
   - Example: `https://dimentia-backend.onrender.com`
   - Note: Deploy backend to Render first to get this URL

## Step-by-Step Deployment

### Step 1: Initial Deployment

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `Gaurav8302/DPCS`
4. Select the repository

### Step 2: Configure Project

1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: Click **"Edit"** and enter `frontend`
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `.next` (auto-detected)
5. **Install Command**: `npm install` (auto-detected)

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXTAUTH_URL` | `https://dpcs-y5hy45.vercel.app` | Production, Preview, Development |
| `NEXTAUTH_SECRET` | (your generated secret) | Production, Preview, Development |
| `NEXT_PUBLIC_BACKEND_URL` | `https://dimentia-backend.onrender.com` | Production, Preview, Development |

**For NEXTAUTH_URL**: Use a temporary value for first deployment. After deployment, you'll get your actual Vercel URL.

### Step 4: Deploy

Click **"Deploy"** and wait 2-3 minutes.

### Step 5: Update NEXTAUTH_URL

1. After deployment completes, note your Vercel URL (e.g., `dpcs-y5hy45.vercel.app`)
2. Go to **Settings** → **Environment Variables**
3. Edit `NEXTAUTH_URL` to match your actual URL: `https://dpcs-y5hy45.vercel.app`
4. Click **"Deployments"** → **"Redeploy"** to apply the change

### Step 6: Update Backend CORS

In your Render backend, update the `ALLOWED_ORIGINS` environment variable:

```
ALLOWED_ORIGINS=https://dpcs-y5hy45.vercel.app
```

Then redeploy your Render backend.

## Vercel Configuration Explained

### vercel.json Settings

```json
{
  "framework": "nextjs",           // Auto-detected Next.js
  "regions": ["iad1"],             // US East (Virginia) - closest to Render
  "headers": [...]                 // Security headers
}
```

### Security Headers

The configuration includes:
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking attacks
- **X-XSS-Protection**: Enables browser XSS protection
- **Referrer-Policy**: Controls referrer information

## Troubleshooting

### Error: "env.NEXTAUTH_URL should be string"

**Solution**: 
1. Go to Vercel project → **Settings** → **Environment Variables**
2. Ensure `NEXTAUTH_URL` is set as a **string value**, not a system variable
3. Format: `https://your-project.vercel.app`
4. Redeploy after adding/updating

### Error: "NEXTAUTH_SECRET is required"

**Solution**:
1. Generate a secret: `openssl rand -base64 32`
2. Add it in Vercel Environment Variables
3. Apply to all environments (Production, Preview, Development)

### Error: "Failed to fetch backend"

**Solution**:
1. Verify `NEXT_PUBLIC_BACKEND_URL` points to your Render backend
2. Ensure Render backend is deployed and running
3. Check backend's `ALLOWED_ORIGINS` includes your Vercel URL

### Error: "Build failed"

**Solution**:
1. Verify `Root Directory` is set to `frontend`
2. Check `package.json` has all dependencies
3. Review build logs for specific errors

## Custom Domain Setup (Optional)

### Add Custom Domain

1. Go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `dimentia.example.com`)
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning (automatic)

### Update Environment Variables

After adding custom domain:

1. Update `NEXTAUTH_URL` to: `https://dimentia.example.com`
2. Update backend `ALLOWED_ORIGINS` to include custom domain
3. Redeploy both frontend and backend

## Performance Optimization

### Vercel Analytics

Enable analytics in your Vercel dashboard:
1. Go to **Analytics** tab
2. Enable **Web Analytics**
3. Monitor Core Web Vitals and user traffic

### Speed Insights

1. Enable **Speed Insights** in Vercel dashboard
2. Monitor real-world performance metrics
3. Review recommendations for optimization

## Production Checklist

Before going live:

- [ ] `NEXTAUTH_URL` set to actual Vercel URL (not placeholder)
- [ ] `NEXTAUTH_SECRET` is a strong random string (32+ characters)
- [ ] `NEXT_PUBLIC_BACKEND_URL` points to Render backend
- [ ] Backend `ALLOWED_ORIGINS` includes Vercel URL
- [ ] Backend is deployed and health check returns success
- [ ] Test login/authentication flow
- [ ] Test all API calls from frontend to backend
- [ ] Verify all 9 test modules load correctly
- [ ] SSL/HTTPS enabled (automatic with Vercel)
- [ ] Security headers applied (from vercel.json)
- [ ] Custom domain configured (if applicable)

## Continuous Deployment

Vercel automatically deploys when you push to GitHub:

1. **Production**: Pushes to `main` branch
2. **Preview**: Pull requests and other branches
3. **Automatic**: Every commit triggers a build

### Disable Auto-Deploy (if needed)

1. Go to **Settings** → **Git**
2. Toggle **"Production Branch"** settings
3. Configure deployment branches

## Environment Variables Management

### Add New Variable

```bash
vercel env add VARIABLE_NAME
```

### List Variables

```bash
vercel env ls
```

### Pull Variables to Local

```bash
vercel env pull .env.local
```

## Rollback Deployment

If something goes wrong:

1. Go to **Deployments**
2. Find a previous successful deployment
3. Click **"..."** → **"Promote to Production"**
4. Instant rollback (no rebuild needed)

## Monitoring

### Check Deployment Status

1. **Dashboard**: https://vercel.com/gaurav8302/dpcs-y5hy45
2. **Real-time Logs**: View build and runtime logs
3. **Function Logs**: Monitor API routes (if any)

### Set Up Notifications

1. Go to **Settings** → **Notifications**
2. Configure:
   - Deployment status (success/failure)
   - Build errors
   - Domain SSL certificate issues

## Cost Management

### Hobby (Free) Plan Limits

- **Bandwidth**: 100 GB/month
- **Builds**: Unlimited
- **Serverless Functions**: 100 GB-hours
- **Team Members**: 1

### Upgrade to Pro (if needed)

- **Cost**: $20/month per user
- **Benefits**:
  - Unlimited bandwidth
  - Advanced analytics
  - Password protection
  - Priority support

## Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **NextAuth Docs**: https://next-auth.js.org/getting-started/introduction

## Support

If you encounter issues:

1. Check Vercel build logs
2. Review runtime logs
3. Contact Vercel support: https://vercel.com/support
4. Community: https://github.com/vercel/vercel/discussions

---

**Your frontend is now production-ready on Vercel!** 🚀
