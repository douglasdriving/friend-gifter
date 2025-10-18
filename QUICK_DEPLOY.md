# Quick Deployment Guide - Friend Gifting

**Fastest way to deploy (100% Free)**: Render + Vercel + Cloudinary

---

## ⚡ Quick Deploy Checklist

### Step 1: Push to GitHub (5 minutes)

```bash
# If not already on GitHub:
git init
git add .
git commit -m "Ready for deployment"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/friend-gifting.git
git branch -M main
git push -u origin main
```

### Step 2: Set Up Cloudinary (2 minutes)

1. Go to [cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Sign up (free account gives 25GB storage)
3. From your dashboard, copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
4. Save these - you'll need them in Step 4

### Step 3: Deploy Database (3 minutes)

1. Go to [render.com/register](https://render.com/register) and sign up
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `friend-gifting-db`
   - **Database**: `friend_gifting`
   - **Plan**: **Free**
4. Click "Create Database"
5. Wait ~2 minutes for creation
6. Click on your database → "Info" tab
7. Copy the **Internal Database URL** (starts with `postgresql://`)
8. Keep this tab open!

### Step 4: Deploy Backend (10 minutes)

1. In Render, click "New +" → "Web Service"
2. Click "Connect account" → Choose GitHub
3. Select your `friend-gifting` repository
4. Configure:
   - **Name**: `friend-gifting-api` (or any name you want)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: *(LEAVE BLANK - delete any text)*
   - **Runtime**: Node
   - **Build Command**:
     ```
     pnpm install && pnpm rebuild bcrypt --build-from-source && cd packages/server && pnpm prisma generate && pnpm build
     ```
   - **Start Command**:
     ```
     cd packages/server && pnpm prisma migrate deploy && pnpm start
     ```
   - **Plan**: **Free**

5. Click "Advanced" → "Add Environment Variable"
6. Add these variables ONE BY ONE:

   | Variable Name | Value |
   |--------------|-------|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | **Paste the Internal Database URL from Step 3** |
   | `JWT_SECRET` | **Generate a random secret (see below)** |
   | `CLIENT_URL` | `https://friend-gifting.vercel.app` (you'll update this later) |
   | `CLOUDINARY_CLOUD_NAME` | **Your Cloudinary Cloud Name from Step 2** |
   | `CLOUDINARY_API_KEY` | **Your Cloudinary API Key from Step 2** |
   | `CLOUDINARY_API_SECRET` | **Your Cloudinary API Secret from Step 2** |

   **Generate JWT Secret:**
   - Windows: Run PowerShell and execute:
     ```powershell
     -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
     ```
   - Mac/Linux: Run in terminal:
     ```bash
     openssl rand -base64 32
     ```
   - Or use: [randomkeygen.com](https://randomkeygen.com/) (use "256-bit WPA Key")

7. Click "Create Web Service"
8. Wait ~5-10 minutes for deployment
9. Once deployed, copy your backend URL (e.g., `https://friend-gifting-api.onrender.com`)
10. **IMPORTANT**: Test it by visiting: `https://YOUR-BACKEND-URL.onrender.com/api/v1`
    - You should see a 404 page or similar (this is normal)

### Step 5: Deploy Frontend (5 minutes)

1. Go to [vercel.com/signup](https://vercel.com/signup) and sign up with GitHub
2. Click "Add New..." → "Project"
3. Select your `friend-gifting` repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `packages/web`
   - **Build Command**: Leave as default (`pnpm build`)
   - **Output Directory**: Leave as default (`dist`)
   - **Install Command**: Leave as default (`pnpm install`)

5. Click "Environment Variables"
6. Add:
   | Name | Value |
   |------|-------|
   | `VITE_API_URL` | `https://YOUR-BACKEND-URL.onrender.com/api/v1` |

   (Replace with YOUR actual backend URL from Step 4)

7. Click "Deploy"
8. Wait ~2-3 minutes
9. Once deployed, you'll see your app URL (e.g., `https://friend-gifting.vercel.app`)
10. **IMPORTANT**: Copy this URL!

### Step 6: Update Backend CORS (2 minutes)

1. Go back to Render → Your backend service
2. Click "Environment" in left sidebar
3. Find `CLIENT_URL` variable
4. Update it to your Vercel URL from Step 5 (e.g., `https://friend-gifting.vercel.app`)
5. Click "Save Changes"
6. Render will automatically redeploy (~2 minutes)

### Step 7: Seed Database (Optional, 3 minutes)

To add test users (emma, marcus, aisha):

1. In Render → Your database → "Info" tab
2. Copy the **External Database URL** (different from Internal!)
3. On your local computer, run:
   ```bash
   cd packages/server
   DATABASE_URL="postgresql://friend_gifting_user:yMS28xwEvfhPKnAPqQQl91RPSGAxPr9q@dpg-d3plf8jipnbc73a0o5e0-a.singapore-postgres.render.com/friend_gifting" pnpm prisma:seed
   ```

### Step 8: Test Your App! 🎉

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try these actions:
   - [ ] Register a new account
   - [ ] Login
   - [ ] Create an item
   - [ ] Upload a photo
   - [ ] Search for users
   - [ ] Send a friend request (if you have 2 accounts)

---

## 🎯 Expected URLs

After deployment, you should have:

- **Frontend**: `https://friend-gifting.vercel.app` (or your custom URL)
- **Backend**: `https://friend-gifting-api.onrender.com`
- **Database**: Accessible via Internal URL (only backend can access)

---

## ⚠️ Important Notes

### Free Tier Limitations:

**Render Free Tier:**
- Backend sleeps after 15 minutes of inactivity
- First request after sleep takes ~30-60 seconds to wake up
- 750 hours/month limit (enough for testing)
- Database limited to 1GB

**How to keep backend awake:**
- Option 1: Use [cron-job.org](https://cron-job.org) to ping your backend every 10 minutes
  - Add a job to GET `https://your-backend-url.onrender.com/api/v1` every 10 min
- Option 2: Upgrade to Render paid plan ($7/mo) for always-on

**Cloudinary Free Tier:**
- 25GB storage (plenty for MVP)
- 25GB monthly bandwidth
- 25 credits per month (generous)

---

## 🔧 Troubleshooting

### Backend won't start

**Problem**: Deployment fails or backend crashes

**Solution**:
1. Check Render logs (Dashboard → Your service → Logs)
2. Common issues:
   - Wrong `DATABASE_URL` format - should start with `postgresql://`
   - Missing environment variables - check all 7 are set
   - Build errors - check your code is committed and pushed

### Frontend can't connect to backend

**Problem**: Login/register doesn't work, console shows CORS or network errors

**Solution**:
1. Verify `VITE_API_URL` in Vercel is correct
   - Should end with `/api/v1`
   - Should match your Render backend URL
2. Verify `CLIENT_URL` in Render matches your Vercel URL
3. Check both URLs work:
   - Frontend: Should load the app
   - Backend: Visit `/api/v1` - should show 404 (that's OK)

### Images not uploading

**Problem**: Image upload fails or doesn't show

**Solution**:
1. Check Cloudinary credentials are correct in Render env vars
2. Check browser console for errors
3. Verify Cloudinary dashboard shows uploads
4. Make sure images are < 5MB

### Database connection errors

**Problem**: Backend logs show database connection errors

**Solution**:
1. Verify `DATABASE_URL` is the **Internal** URL (not External)
2. Check database status in Render (should be "Available")
3. Database URL should look like:
   ```
   postgresql://user:password@dpg-xxxx-a.oregon-postgres.render.com/dbname
   ```

---

## 💰 Cost Summary

**Total monthly cost**: **$0** (Free)

- Render (Backend + Database): Free
- Vercel (Frontend): Free
- Cloudinary (Images): Free

**Upgrade path when ready:**
- Render paid: $7/mo (no sleep, better performance)
- Custom domain: $10-15/year
- Total: ~$8/mo + $12/year for production

---

## 🚀 Next Steps

After successful deployment:

1. **Custom Domain** (optional):
   - Buy a domain (Namecheap, Google Domains)
   - Add to Vercel (Settings → Domains)
   - Add to Render (Settings → Custom Domain)

2. **Monitoring**:
   - Set up [UptimeRobot](https://uptimerobot.com) for free uptime monitoring
   - Monitor Render logs for errors

3. **Share with users**:
   - Your app is live and ready!
   - Share the Vercel URL
   - Collect feedback

4. **Improve performance** (when needed):
   - Upgrade Render to paid plan (no sleep)
   - Add Redis caching
   - Optimize database queries

---

## 📚 Additional Resources

- **Full deployment guide**: See `DEPLOYMENT.md` for advanced options
- **Testing guide**: See `TESTING.md` for running tests
- **API docs**: See `MVP_COMPLETE_FINAL.md` for API documentation

---

## 🆘 Need Help?

If you encounter issues:

1. Check the logs:
   - Render: Dashboard → Logs
   - Vercel: Deployment → Logs
   - Browser: F12 → Console tab

2. Common fixes:
   - Redeploy: Push a new commit to trigger redeployment
   - Clear cache: Hard refresh browser (Ctrl+Shift+R)
   - Check env vars: All variables set correctly?

3. Test locally first:
   - Make sure app works locally before deploying
   - Run `pnpm build` to test production build

---

**Total time**: ~30 minutes for complete deployment

**Difficulty**: Easy (just follow the steps!)

**Result**: Your app running live on the internet! 🎉

---

Good luck with your deployment! 🚀
