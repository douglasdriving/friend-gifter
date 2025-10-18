# Deployment Guide

This guide walks you through deploying the Friend Gifting application to production.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Deployment Options](#deployment-options)
4. [Recommended Setup (Render + Vercel)](#recommended-setup-render--vercel)
5. [Alternative Setup (Railway)](#alternative-setup-railway)
6. [Alternative Setup (AWS/DigitalOcean)](#alternative-setup-awsdigitalocean)
7. [Environment Configuration](#environment-configuration)
8. [Database Setup](#database-setup)
9. [Image Storage](#image-storage)
10. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Overview

The Friend Gifting app consists of:
- **Backend**: Express.js API (Node.js)
- **Frontend**: React SPA (Static files)
- **Database**: PostgreSQL
- **File Storage**: Images (currently local, needs cloud storage)

---

## Prerequisites

Before deploying, ensure you have:

- [ ] GitHub account (to push code)
- [ ] Domain name (optional but recommended)
- [ ] Credit card for cloud services (many offer free tiers)
- [ ] Code committed and pushed to GitHub

### Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Ready for deployment"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/friend-gifting.git
git branch -M main
git push -u origin main
```

---

## Deployment Options

### Option 1: Free Tier (Best for MVP Testing)
- **Backend + Database**: [Render](https://render.com) (Free tier)
- **Frontend**: [Vercel](https://vercel.com) (Free tier)
- **Images**: [Cloudinary](https://cloudinary.com) (Free tier: 25GB)
- **Cost**: $0/month
- **Limitations**: Backend sleeps after 15 min inactivity, 750 hours/month

### Option 2: Low-Cost Production
- **Backend + Database**: [Railway](https://railway.app) ($5-20/month)
- **Frontend**: [Vercel](https://vercel.com) (Free)
- **Images**: [Cloudinary](https://cloudinary.com) (Free)
- **Cost**: ~$5-20/month
- **Benefits**: No sleep, better performance, $5 free credit monthly

### Option 3: Full Cloud (Scalable)
- **Backend**: AWS EC2 / DigitalOcean Droplet ($12+/month)
- **Database**: AWS RDS / DigitalOcean Managed PostgreSQL ($15+/month)
- **Frontend**: Vercel / Netlify (Free)
- **Images**: AWS S3 ($0.023/GB)
- **Cost**: ~$30+/month
- **Benefits**: Full control, scalability, professional setup

---

## Recommended Setup (Render + Vercel)

This is the **easiest and free** option, perfect for MVP testing.

### Step 1: Deploy Database (Render)

1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `friend-gifting-db`
   - **Database**: `friend_gifting`
   - **User**: `friend_gifting_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free
4. Click "Create Database"
5. **SAVE** the "Internal Database URL" and "External Database URL"

### Step 2: Set Up Image Storage (Cloudinary)

1. Go to [cloudinary.com](https://cloudinary.com) and sign up
2. From dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
3. We'll configure this in the backend later

### Step 3: Deploy Backend (Render)

1. In Render dashboard, click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `friend-gifting-api`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `packages/server`
   - **Runtime**: Node
   - **Build Command**: `pnpm install && pnpm prisma generate && pnpm build`
   - **Start Command**: `pnpm prisma migrate deploy && pnpm start`
   - **Plan**: Free

4. **Environment Variables** (click "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=<paste Internal Database URL from Step 1>
   JWT_SECRET=<generate a random secret - use: openssl rand -base64 32>
   JWT_EXPIRES_IN=7d
   CLIENT_URL=https://your-app-name.vercel.app
   CLOUDINARY_CLOUD_NAME=<from Step 2>
   CLOUDINARY_API_KEY=<from Step 2>
   CLOUDINARY_API_SECRET=<from Step 2>
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX=1000
   AUTH_RATE_LIMIT_MAX=50
   ```

5. Click "Create Web Service"
6. Wait for deployment (5-10 minutes)
7. **SAVE** your backend URL: `https://friend-gifting-api.onrender.com`

### Step 4: Update Backend for Cloudinary

Before deploying frontend, we need to update the backend to use Cloudinary instead of local storage.

**Create `packages/server/src/services/cloudinary.service.ts`:**

```typescript
import { v2 as cloudinary } from 'cloudinary';
import config from '../config';

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

export const cloudinaryService = {
  async uploadImage(fileBuffer: Buffer, folder: string = 'items'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `friend-gifting/${folder}`,
          format: 'webp',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto:good' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!.secure_url);
        }
      );

      uploadStream.end(fileBuffer);
    });
  },

  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  },
};
```

**Update `packages/server/src/config.ts`** to add Cloudinary config:

```typescript
cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
```

**Install Cloudinary:**
```bash
cd packages/server
pnpm add cloudinary
```

**Update image upload logic** in `items.service.ts` to use Cloudinary URLs instead of local files.

### Step 5: Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `packages/web`
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

5. **Environment Variables**:
   ```
   VITE_API_URL=https://friend-gifting-api.onrender.com/api/v1
   ```

6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. **SAVE** your frontend URL: `https://friend-gifting.vercel.app`

### Step 6: Update Backend CORS

Go back to Render → Your backend service → Environment:
- Update `CLIENT_URL` to your Vercel URL: `https://friend-gifting.vercel.app`
- Click "Save Changes" (this will redeploy)

### Step 7: Seed Database (Optional)

To add test data:

1. Go to Render → Your database
2. Copy "External Database URL"
3. On your local machine:
   ```bash
   cd packages/server
   DATABASE_URL="<paste External Database URL>" pnpm prisma:seed
   ```

---

## Alternative Setup (Railway)

Railway is a paid option ($5-20/month) but simpler and doesn't sleep.

### Step 1: Deploy Everything on Railway

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect it's a monorepo

### Step 2: Configure Services

**Add PostgreSQL:**
1. Click "+ New" → "Database" → "Add PostgreSQL"
2. Railway automatically creates and links it

**Configure Backend:**
1. Click on the backend service
2. Settings → Root Directory: `packages/server`
3. Settings → Build Command: `pnpm install && pnpm prisma generate && pnpm build`
4. Settings → Start Command: `pnpm prisma migrate deploy && pnpm start`
5. Variables → Add:
   ```
   NODE_ENV=production
   JWT_SECRET=<random-secret>
   CLIENT_URL=<will update after frontend>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
   CLOUDINARY_API_KEY=<your-cloudinary-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-secret>
   ```
6. Generate Domain (for the backend URL)

**Configure Frontend (on Vercel):**
- Same as Option 1, Step 5

### Step 3: Link Services

- Update backend `CLIENT_URL` with Vercel URL
- Railway automatically links `DATABASE_URL`

---

## Alternative Setup (AWS/DigitalOcean)

For full control and scalability.

### AWS Setup

**1. Database (RDS):**
- Create PostgreSQL instance
- Configure security groups
- Note connection URL

**2. Backend (EC2 or Elastic Beanstalk):**
- Launch EC2 instance (Ubuntu)
- Install Node.js, pnpm
- Clone repo, build, run with PM2
- Configure nginx reverse proxy
- Set up SSL with Let's Encrypt

**3. Images (S3):**
- Create S3 bucket
- Configure bucket policy
- Use AWS SDK for uploads

**4. Frontend (S3 + CloudFront or Vercel):**
- Build frontend locally
- Upload to S3 bucket
- Configure CloudFront distribution
- Or use Vercel (easier)

### DigitalOcean Setup

**1. Database:**
- Create Managed PostgreSQL database
- Note connection URL

**2. Backend (Droplet):**
- Create Ubuntu Droplet
- SSH in and set up:
  ```bash
  # Install Node.js
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs

  # Install pnpm
  npm install -g pnpm

  # Clone repo
  git clone https://github.com/yourusername/friend-gifting.git
  cd friend-gifting
  pnpm install

  # Build backend
  cd packages/server
  pnpm build

  # Install PM2
  npm install -g pm2

  # Start app
  pm2 start dist/index.js --name friend-gifting-api
  pm2 startup
  pm2 save
  ```

**3. Images:**
- Use Cloudinary or DigitalOcean Spaces

**4. Frontend:**
- Use Vercel (easiest) or
- Serve from nginx on same droplet

---

## Environment Configuration

### Backend Environment Variables

**Required:**
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/dbname
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
CLIENT_URL=https://your-frontend-url.com
```

**Cloudinary (for images):**
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Optional:**
```env
JWT_EXPIRES_IN=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=1000
AUTH_RATE_LIMIT_MAX=50
```

### Frontend Environment Variables

```env
VITE_API_URL=https://your-backend-url.com/api/v1
```

---

## Database Setup

### Migrations

Your hosting provider should run migrations automatically with:
```bash
pnpm prisma migrate deploy
```

If not, run manually:
```bash
DATABASE_URL="your-production-db-url" pnpm prisma migrate deploy
```

### Seeding (Optional)

To add test users:
```bash
DATABASE_URL="your-production-db-url" pnpm prisma:seed
```

---

## Image Storage

### Current: Local Storage ❌

The app currently stores images in `packages/server/uploads/`, which won't work in production (files lost on restart).

### Solution: Cloudinary ✅

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get credentials from dashboard
3. Install package:
   ```bash
   cd packages/server
   pnpm add cloudinary
   ```
4. Update `upload.service.ts` to use Cloudinary (see code above)
5. Add environment variables

### Alternative: AWS S3

If you prefer S3:
```bash
pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

Then update upload service to use S3 SDK.

---

## Post-Deployment Checklist

After deployment, verify:

### Backend Health
- [ ] API accessible at `https://your-api.com/api/v1`
- [ ] Database connected (check logs)
- [ ] Migrations applied
- [ ] Test login/register endpoints

### Frontend Health
- [ ] App loads at `https://your-app.com`
- [ ] Can register new user
- [ ] Can login
- [ ] Can create items
- [ ] Can upload images
- [ ] Can add friends
- [ ] Can see friends' items

### Security
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] CORS configured correctly
- [ ] Rate limiting active
- [ ] JWT secret is secure (not default)
- [ ] Database credentials secure
- [ ] Environment variables not in code

### Performance
- [ ] Images loading quickly (Cloudinary)
- [ ] API response times < 500ms
- [ ] Frontend loads < 3s
- [ ] Database queries optimized

---

## Monitoring & Maintenance

### Logging

**Backend logs:**
- Render: Dashboard → Logs tab
- Railway: Service → Logs
- AWS/DO: SSH in and check PM2 logs: `pm2 logs`

**Database:**
- Monitor connection pool
- Watch for slow queries
- Set up alerts for downtime

### Backups

**Database backups:**
- Render: Automatic daily backups on paid plan
- Railway: Manual backups via CLI
- AWS RDS: Configure automated backups
- DigitalOcean: Enable daily backups

### Updates

**Deploying updates:**

1. Push code to GitHub:
   ```bash
   git add .
   git commit -m "Update feature X"
   git push
   ```

2. Auto-deploy:
   - Vercel: Automatically deploys on push
   - Render: Automatically deploys on push (if enabled)
   - Railway: Automatically deploys on push

3. Manual deploy:
   - SSH to server, pull code, rebuild, restart PM2

---

## Cost Breakdown

### Free Tier (Recommended for MVP)
- **Backend**: Render Free (sleeps after 15min)
- **Database**: Render PostgreSQL Free
- **Frontend**: Vercel Free
- **Images**: Cloudinary Free (25GB)
- **Total**: $0/month
- **Limitations**: Backend sleeps, 750 hours/month

### Low-Cost Production
- **Backend + DB**: Railway ($5-20/month)
- **Frontend**: Vercel Free
- **Images**: Cloudinary Free
- **Total**: $5-20/month
- **Benefits**: No sleep, better performance

### Full Production
- **Backend**: DigitalOcean Droplet ($12/month)
- **Database**: DigitalOcean Managed DB ($15/month)
- **Frontend**: Vercel Free
- **Images**: Cloudinary Free or S3 ($1-5/month)
- **Total**: $28-32/month
- **Benefits**: Full control, scalability

---

## Troubleshooting

### Backend won't start
- Check environment variables
- Check database connection URL
- Review deployment logs
- Verify `DATABASE_URL` has `?schema=public`

### Frontend can't connect to backend
- Verify `VITE_API_URL` is correct
- Check CORS configuration
- Verify backend is running

### Images not uploading
- Check Cloudinary credentials
- Verify file size limits
- Check network tab for errors

### Database connection errors
- Verify `DATABASE_URL` format
- Check database is running
- Verify firewall/security groups

---

## Next Steps

1. Choose your deployment strategy
2. Set up accounts (Render, Vercel, Cloudinary)
3. Follow the step-by-step guide above
4. Update code for Cloudinary (if needed)
5. Deploy and test
6. Share with users!

Need help? Check the logs, search the error message, or open an issue on GitHub.

---

**Ready to deploy?** Start with the free tier (Render + Vercel) for testing, then upgrade to Railway or AWS/DO for production!
