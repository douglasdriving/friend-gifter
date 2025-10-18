# Deployment Troubleshooting Guide

This guide documents all the issues encountered during deployment and their solutions.

---

## Table of Contents

1. [TypeScript Build Errors](#typescript-build-errors)
2. [bcrypt Native Module Errors](#bcrypt-native-module-errors)
3. [ES Module Import Errors](#es-module-import-errors)
4. [Frontend API Connection Issues](#frontend-api-connection-issues)
5. [CORS Errors](#cors-errors)
6. [Image Upload Issues](#image-upload-issues)
7. [Cloudinary Authentication](#cloudinary-authentication)
8. [Express Rate Limiting Errors](#express-rate-limiting-errors)

---

## TypeScript Build Errors

### Issue
Multiple TypeScript compilation errors when building for production:
- Router type inference errors
- JWT utility type errors
- Logger transport type errors
- Test helper import errors

### Solution
1. **Router Type Annotations** - Added explicit `Router` type to all route files:
```typescript
import { Router, type Router as RouterType } from 'express';
const router: RouterType = Router();
```

2. **Express App Type** - Added explicit type to main app:
```typescript
import express, { type Express } from 'express';
const app: Express = express();
```

3. **JWT Type Fixes** - Fixed SignOptions compatibility:
```typescript
export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret as string, {
    expiresIn: config.jwtExpiresIn,
  } as SignOptions);
};
```

4. **Logger Transport Types** - Fixed winston transport array typing:
```typescript
const transports: winston.transport[] = [
  new winston.transports.Console({ ... }),
];
```

5. **Password Utility** - Created `utils/password.ts` for test helpers:
```typescript
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}
```

### Files Modified
- `packages/server/src/index.ts`
- `packages/server/src/routes/*.routes.ts` (6 files)
- `packages/server/src/utils/jwt.ts`
- `packages/server/src/utils/logger.ts`
- `packages/server/src/utils/password.ts` (new)
- `packages/server/src/tests/helpers.ts`

---

## bcrypt Native Module Errors

### Issue
```
Error: Cannot find module '.../bcrypt/lib/binding/napi-v3/bcrypt_lib.node'
```

bcrypt's native bindings weren't being compiled for the Linux platform (Render). Prebuilt Windows binaries don't work on Linux.

### Solution
Use `npm rebuild bcrypt --build-from-source` to compile native bindings on the target platform.

**Important:** Use `npm` NOT `pnpm` for this command - pnpm doesn't support the `--build-from-source` flag.

### Correct Build Command
```bash
pnpm install && cd packages/shared && pnpm build && cd ../server && npm rebuild bcrypt --build-from-source && pnpm prisma generate && pnpm build
```

### Testing Locally
```bash
cd packages/server
npm rebuild bcrypt --build-from-source
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('test', 10).then(hash => console.log('✅ bcrypt works:', hash.substring(0, 20) + '...'))"
```

---

## ES Module Import Errors

### Issue
```
Error [ERR_UNSUPPORTED_DIR_IMPORT]: Directory import '/opt/render/project/src/packages/shared/src/types' is not supported resolving ES modules
```

The shared package was exporting TypeScript source with directory imports (`export * from './types'`), which ES modules don't support.

### Solution
Build the shared package to compile TypeScript to JavaScript before the server build.

1. **Updated `packages/shared/package.json`**:
```json
{
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
```
(Changed from `./src/index.ts`)

2. **Added shared build to Render build command**:
```bash
cd packages/shared && pnpm build && cd ../server
```

### Build Order
1. Install all dependencies (`pnpm install`)
2. Build shared package (`cd packages/shared && pnpm build`)
3. Build server (`cd ../server && pnpm build`)

---

## Frontend API Connection Issues

### Issue
Frontend calling `/api/v1/auth/register` resulted in 404 errors because it was trying to reach the frontend URL instead of the backend.

### Root Cause
`packages/web/src/lib/api.ts` had hardcoded `baseURL: '/api/v1'` which only works in development via Vite proxy.

### Solution
Use `VITE_API_URL` environment variable with fallback:

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Vercel Environment Variable
Set in Vercel → Settings → Environment Variables:
```
VITE_API_URL=https://friend-gifting-api.onrender.com/api/v1
```

**Important:** Include `/api/v1` in the URL!

---

## CORS Errors

### Issue
```
CORS header 'Access-Control-Allow-Origin' does not match
```

### Common Causes

1. **Trailing Slash Mismatch**
   - ❌ Backend expects: `https://example.com/`
   - ✅ Frontend sends: `https://example.com`
   - Solution: Remove trailing slashes from `CLIENT_URL`

2. **Wrong Frontend URL**
   - Vercel provides both a domain and deployment URLs
   - ✅ Use: `https://your-app.vercel.app` (domain)
   - ❌ Don't use: `https://your-app-xyz123.vercel.app` (deployment URL)

### Render Environment Variable
```
CLIENT_URL=https://friend-gifter-web.vercel.app
```
(No trailing slash!)

### Files Involved
- `packages/server/src/config/index.ts` - Reads `CLIENT_URL`
- `packages/server/src/index.ts` - CORS configuration

---

## Image Upload Issues

### Issue
Image uploads calling wrong URL:
```
POST https://friend-gifter-web.vercel.app/api/v1/items/.../photos
```

Should be calling backend:
```
POST https://friend-gifting-api.onrender.com/api/v1/items/.../photos
```

### Root Cause
`ImageUpload.tsx` component was using native `fetch()` with hardcoded URLs instead of the api client.

### Solution
Replace `fetch()` calls with api client:

**Before:**
```typescript
const response = await fetch(`/api/v1/items/${itemId}/photos`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
  body: formData,
});
```

**After:**
```typescript
import api from '../../lib/api';

const response = await api.post<ItemPhoto[]>(`/items/${itemId}/photos`, formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
```

### Files Modified
- `packages/web/src/components/items/ImageUpload.tsx`

---

## Cloudinary Authentication

### Issue
```
Invalid Signature 3829a847eff7d0ba7a220a94ade14d2bb2b98d2e
http_code: 401
```

### Root Cause
Incorrect or misconfigured Cloudinary API credentials.

### Solution

1. **Get Correct Credentials**
   - Go to [Cloudinary Console](https://console.cloudinary.com/)
   - Dashboard → Settings → Access Keys
   - Copy **exactly** (no spaces, no quotes):
     - Cloud Name
     - API Key
     - API Secret

2. **Set in Render Environment Variables**
   ```
   CLOUDINARY_CLOUD_NAME=dxxxxxxxx
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcd1234efgh5678ijkl9012
   ```

### Common Mistakes
- ❌ Copying with extra spaces or quotes
- ❌ Using API Key instead of API Secret (or vice versa)
- ❌ Cloud name with protocol (should be just the name, not `https://`)
- ❌ Credentials from wrong Cloudinary account

### Testing
Backend logs should show:
```
[info]: Cloudinary configured for image storage
[info]: Uploading image to Cloudinary...
```

If authentication fails, you'll see:
```
[error]: Invalid Signature ... { "http_code": 401 }
```

---

## Express Rate Limiting Errors

### Issue
```
ValidationError: The 'X-Forwarded-For' header is set but the Express 'trust proxy' setting is false (default)
```

### Root Cause
Express wasn't configured to trust Render's proxy, causing `express-rate-limit` to fail when receiving `X-Forwarded-For` headers from Render's load balancer.

### Solution
Enable trust proxy in production:

```typescript
if (config.nodeEnv === 'production') {
  app.set('trust proxy', 1);
}
```

This allows Express to:
- Correctly identify client IPs behind proxies
- Use X-Forwarded-For header for rate limiting
- Work properly on Render, Heroku, AWS, etc.

### Files Modified
- `packages/server/src/index.ts`

---

## Deployment Checklist

Use this checklist to verify your deployment is configured correctly:

### Backend (Render)

- [ ] Root Directory: **BLANK** (leave empty)
- [ ] Build Command includes all steps:
  - [ ] `pnpm install`
  - [ ] `cd packages/shared && pnpm build`
  - [ ] `cd ../server && npm rebuild bcrypt --build-from-source`
  - [ ] `pnpm prisma generate`
  - [ ] `pnpm build`
- [ ] Start Command: `cd packages/server && pnpm prisma migrate deploy && pnpm start`
- [ ] Environment Variables (7 required):
  - [ ] `NODE_ENV=production`
  - [ ] `DATABASE_URL` (Internal Database URL from Render PostgreSQL)
  - [ ] `JWT_SECRET` (32+ character random string)
  - [ ] `CLIENT_URL` (Vercel frontend URL, NO trailing slash)
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`

### Frontend (Vercel)

- [ ] Framework Preset: **Vite**
- [ ] Root Directory: `packages/web`
- [ ] Build Command: Default (`pnpm build`)
- [ ] Output Directory: Default (`dist`)
- [ ] Environment Variables (1 required):
  - [ ] `VITE_API_URL=https://YOUR-BACKEND.onrender.com/api/v1`

### Database (Render PostgreSQL)

- [ ] Database created and available
- [ ] Internal Database URL copied to backend `DATABASE_URL`
- [ ] Migrations deployed (happens automatically on first backend deploy)
- [ ] (Optional) Seed data loaded

---

## Testing Deployment

After deployment, test these features:

1. **Registration**
   - [ ] Can create new account
   - [ ] No CORS errors in console
   - [ ] Redirects to dashboard after registration

2. **Login**
   - [ ] Can log in with credentials
   - [ ] JWT token stored
   - [ ] Redirects to dashboard

3. **Items**
   - [ ] Can create new item
   - [ ] Can view items feed
   - [ ] Can edit/delete own items

4. **Image Upload**
   - [ ] Can select and upload images
   - [ ] Images appear immediately
   - [ ] Images stored in Cloudinary
   - [ ] No 404 or 502 errors

5. **Friends**
   - [ ] Can search for users
   - [ ] Can send friend requests
   - [ ] Can accept/decline requests

---

## Getting Help

If you encounter issues not covered here:

1. **Check Logs**
   - Render: Dashboard → Your service → Logs
   - Vercel: Project → Deployments → Click deployment → Logs
   - Browser: F12 → Console tab

2. **Common Log Locations**
   - Backend errors: Render logs
   - Frontend errors: Browser console
   - Build errors: Render/Vercel deployment logs

3. **Verify Environment Variables**
   - Backend: Render → Environment tab
   - Frontend: Vercel → Settings → Environment Variables
   - Make sure they match exactly (no typos, spaces, quotes)

4. **Test Locally First**
   - Set `NODE_ENV=production` locally
   - Use production-like URLs
   - Test image uploads with Cloudinary

---

## Summary of All Fixes

1. ✅ TypeScript build errors - Added explicit type annotations
2. ✅ bcrypt native bindings - Used `npm rebuild --build-from-source`
3. ✅ ES module imports - Built shared package before server
4. ✅ Frontend API URLs - Used `VITE_API_URL` environment variable
5. ✅ CORS errors - Fixed `CLIENT_URL` (no trailing slash)
6. ✅ Image upload URLs - Used api client instead of fetch
7. ✅ Cloudinary auth - Verified correct credentials in Render
8. ✅ Rate limiting - Enabled `trust proxy` in production

All issues resolved - MVP successfully deployed! 🎉
