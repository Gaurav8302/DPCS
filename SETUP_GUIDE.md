# 🚀 Dimentia Project Setup Guide

Complete step-by-step guide to set up and deploy the Dimentia cognitive assessment platform.

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **Python** 3.11 or higher ([Download](https://www.python.org/))
- **MongoDB Atlas** account ([Sign up](https://www.mongodb.com/cloud/atlas/register))
- **Git** installed ([Download](https://git-scm.com/))

## 🏗️ Project Structure

```
RPC2.0/
├── frontend/           # Next.js 14 application
│   ├── src/
│   │   ├── pages/      # App pages and routes
│   │   ├── components/ # Reusable React components
│   │   ├── lib/        # Utility functions
│   │   ├── contexts/   # React contexts
│   │   └── styles/     # CSS and Tailwind styles
│   ├── public/         # Static assets
│   └── package.json
├── backend/            # FastAPI application
│   ├── database/       # MongoDB models and connection
│   ├── routers/        # API route handlers
│   ├── utils/          # Scoring algorithms
│   ├── main.py         # App entry point
│   └── requirements.txt
├── .env.example        # Environment variables template
├── .gitignore
└── README.md
```

## 🔧 Backend Setup

### Step 1: Set up MongoDB Atlas

1. **Create a MongoDB Atlas account** at https://www.mongodb.com/cloud/atlas/register

2. **Create a new cluster**:
   - Choose the free tier (M0)
   - Select a cloud provider and region
   - Name your cluster (e.g., "Cluster0")

3. **Configure database access**:
   - Go to "Database Access"
   - Add a new database user
   - Choose "Password" authentication
   - Save username and password securely

4. **Configure network access**:
   - Go to "Network Access"
   - Add IP Address
   - For development: Add "0.0.0.0/0" (allow from anywhere)
   - For production: Add your server IP

5. **Get connection string**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### Step 2: Install Python dependencies

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Configure environment variables

```powershell
# Copy example env file
cp ..\.env.example .env

# Edit .env file with your values
notepad .env
```

Update the following variables:

```env
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
MONGO_DB_NAME="dimentia_project"
BACKEND_URL="http://localhost:8000"
FRONTEND_URL="http://localhost:3000"
ENCRYPTION_KEY="your-32-byte-encryption-key-here"
JWT_SECRET="your-jwt-secret-key"
JWT_ALGORITHM="HS256"
JWT_EXPIRATION_HOURS=24
```

**To generate secure keys:**

```powershell
# Generate encryption key (Python)
python -c "import secrets; print(secrets.token_hex(32))"

# Generate JWT secret
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Step 4: Start the backend server

```powershell
# Make sure virtual environment is activated
.\venv\Scripts\activate

# Start server with auto-reload
uvicorn main:app --reload --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🎨 Frontend Setup

### Step 1: Install Node.js dependencies

```powershell
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
```

### Step 2: Configure environment variables

```powershell
# Copy example env file
cp ..\.env.example .env.local

# Edit .env.local
notepad .env.local
```

Update the following:

```env
NEXTAUTH_SECRET="your-nextauth-secret-min-32-characters"
NEXTAUTH_URL="http://localhost:3000"
BACKEND_URL="http://localhost:8000"
NEXT_PUBLIC_BACKEND_URL="http://localhost:8000"
```

**Generate NextAuth secret:**

```powershell
# In PowerShell
$bytes = New-Object Byte[] 32
[System.Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

### Step 3: Start the development server

```powershell
# Start Next.js dev server
npm run dev
```

The frontend will be available at http://localhost:3000

## ✅ Verify Installation

### Test Backend

1. Open http://localhost:8000/health in browser
2. Should see: `{"status":"healthy","version":"2.0.0","service":"dimentia-api"}`

3. Test API docs at http://localhost:8000/docs
4. Try creating a test user:

```bash
curl -X POST "http://localhost:8000/api/users" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "education_years": 16
  }'
```

### Test Frontend

1. Open http://localhost:3000
2. You should see the landing page
3. Click "Start Assessment"
4. Verify pages load correctly

## 🧪 Running Tests

### Backend Tests

```powershell
cd backend
.\venv\Scripts\activate
pytest
```

### Frontend Tests

```powershell
cd frontend
npm test
```

## 🐳 Docker Deployment (Optional)

### Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose

Create `docker-compose.yml` in root:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - MONGO_DB_NAME=${MONGO_DB_NAME}
      - JWT_SECRET=${JWT_SECRET}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXT_PUBLIC_BACKEND_URL=http://backend:8000
    depends_on:
      - backend
    restart: unless-stopped
```

Run with:

```powershell
docker-compose up -d
```

## 🌐 Production Deployment

### Deploy Backend (AWS EC2 / GCP Cloud Run)

1. **Set up server** (Ubuntu example):

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python
sudo apt install python3.11 python3.11-venv -y

# Clone repository
git clone <your-repo-url>
cd RPC2.0/backend

# Set up virtual environment
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Set environment variables
nano .env
# Add production values

# Install and configure Nginx
sudo apt install nginx -y

# Create Nginx config
sudo nano /etc/nginx/sites-available/dimentia-api

# Add configuration
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/dimentia-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Set up systemd service
sudo nano /etc/systemd/system/dimentia-api.service

[Unit]
Description=Dimentia API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/RPC2.0/backend
Environment="PATH=/home/ubuntu/RPC2.0/backend/venv/bin"
ExecStart=/home/ubuntu/RPC2.0/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000

[Install]
WantedBy=multi-user.target

# Start service
sudo systemctl enable dimentia-api
sudo systemctl start dimentia-api
```

2. **Set up SSL** with Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.yourdomain.com
```

### Deploy Frontend (Vercel)

1. **Push code to GitHub**

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your repository
   - Select `frontend` as root directory

3. **Configure environment variables** in Vercel dashboard:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (your production URL)
   - `NEXT_PUBLIC_BACKEND_URL` (your API URL)

4. **Deploy**: Vercel will automatically build and deploy

## 🔐 Security Checklist

- [ ] Change all default passwords
- [ ] Use strong encryption keys (32+ characters)
- [ ] Enable MongoDB IP whitelist in production
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Backup database regularly

## 📊 Monitoring

### Set up MongoDB monitoring

- Enable MongoDB Atlas monitoring in dashboard
- Set up alerts for:
  - High memory usage
  - Connection spikes
  - Slow queries

### Application monitoring

- Use Vercel Analytics for frontend
- Set up logging service (e.g., Sentry)
- Monitor API response times

## 🆘 Troubleshooting

### Backend issues

**MongoDB connection fails:**
```powershell
# Check connection string in .env
# Verify IP whitelist in MongoDB Atlas
# Test connection:
python -c "from motor.motor_asyncio import AsyncIOMotorClient; import os; from dotenv import load_dotenv; load_dotenv(); client = AsyncIOMotorClient(os.getenv('MONGO_URI')); print('Connected!' if client.admin.command('ping') else 'Failed')"
```

**Import errors:**
```powershell
# Reinstall dependencies
pip install --force-reinstall -r requirements.txt
```

### Frontend issues

**Module not found:**
```powershell
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build fails:**
```powershell
# Check TypeScript errors
npm run build

# Check environment variables
cat .env.local
```

## 📚 Next Steps

1. ✅ Complete authentication setup (NextAuth)
2. ✅ Build test module pages
3. ✅ Implement admin dashboard
4. ✅ Add accessibility features
5. ✅ Set up monitoring
6. ✅ Deploy to production

## 📞 Support

For issues or questions:
- Check documentation in `/docs`
- Review API docs at `/api/docs`
- Contact development team

---

**🎉 Congratulations!** Your Dimentia Project is now set up and ready for development.
