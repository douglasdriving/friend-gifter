# Friend Gifting MVP - Testing Guide

## Prerequisites

1. **PostgreSQL Database**: You need a running PostgreSQL instance
2. **Node.js**: Version 18 or higher
3. **pnpm**: Installed globally

## Setup Instructions

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Backend Environment

```bash
cd packages/server
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL`: Your PostgreSQL connection string
  - Example: `postgresql://user:password@localhost:5432/friend_gifting`
- `JWT_SECRET`: A random secret string (e.g., `your-secret-key-here`)
- `PORT`: 3000 (default)

### 3. Initialize Database

```bash
# Still in packages/server
pnpm prisma migrate dev
pnpm prisma db seed
```

This will:
- Create all database tables
- Seed the database with 3 test users:
  - **Emma** (emma@example.com / Password123)
  - **Marcus** (marcus@example.com / Password123)
  - **Aisha** (aisha@example.com / Password123)

### 4. Start the Backend

```bash
# In packages/server
pnpm dev
```

Backend will run on http://localhost:3000

### 5. Start the Frontend

```bash
# In a new terminal, from project root
cd packages/web
pnpm dev
```

Frontend will run on http://localhost:5173

## Testing Workflows

### Test 1: User Authentication

1. **Landing Page**
   - Visit http://localhost:5173
   - Should see landing page with "Get Started" and "Sign In" buttons

2. **Registration**
   - Click "Get Started"
   - Fill in registration form:
     - Name: Test User
     - Username: testuser
     - Email: test@example.com
     - Password: Password123
   - Click "Create Account"
   - Should redirect to dashboard

3. **Logout and Login**
   - Click "Logout" button
   - Click "Sign In" on landing page
   - Login with test@example.com / Password123
   - Should redirect to dashboard

### Test 2: Friends Management

1. **Search for Friends**
   - From dashboard, click "Manage Friends"
   - Click "Search" tab
   - Search for "emma"
   - Should see Emma in results
   - Click "Add Friend"
   - Should show success message

2. **Login as Emma**
   - Logout
   - Login as emma@example.com / Password123
   - Go to Friends page
   - Click "Requests" tab
   - Should see friend request from Test User
   - Click "Accept"

3. **Verify Friendship**
   - Click "Friends" tab
   - Should see Test User in friends list
   - Logout and login as Test User
   - Go to Friends page
   - Should see Emma in friends list

### Test 3: Items Feature

1. **Create an Item** (as Test User)
   - From dashboard, click "Manage Items"
   - Click "+ Add Item"
   - Fill in form:
     - Title: "Vintage Camera"
     - Description: "Classic film camera in great condition"
     - Category: "Electronics"
     - Condition: "Good"
   - Click "Create Item"
   - Should see item in "My Items" list

2. **View as Friend** (as Emma)
   - Logout and login as Emma
   - From dashboard, click "Browse Feed" under Items
   - Should see "Vintage Camera" from Test User
   - Click on the item to view details
   - Should see full item information

3. **Mark as Gifted** (as Test User)
   - Logout and login as Test User
   - Go to "My Items"
   - Click on "Vintage Camera"
   - Click "Mark as Gifted"
   - Should show "✓ Gifted" badge

4. **Delete Item**
   - Click "Delete Item"
   - Confirm deletion
   - Should redirect to My Items (empty)

### Test 4: Wishes Feature

1. **Create a Wish** (as Test User)
   - From dashboard, click "Manage Wishes"
   - Click "+ Add Wish"
   - Fill in form:
     - Title: "Mountain Bike"
     - Description: "Looking for a good quality mountain bike"
     - Category: "Sports"
     - Priority: "High"
   - Click "Create Wish"
   - Should see wish in "My Wishes" list

2. **View as Friend** (as Emma)
   - Logout and login as Emma
   - From dashboard, click "Browse Feed" under Wishes
   - Should see "Mountain Bike" wish from Test User
   - Click on the wish to view details

3. **Mark as Fulfilled** (as Test User)
   - Logout and login as Test User
   - Go to "My Wishes"
   - Click on "Mountain Bike"
   - Click "Mark as Fulfilled"
   - Should show "✓ Fulfilled" badge

### Test 5: Privacy (Friend-Gating)

1. **Create a New User**
   - Logout
   - Register as newuser@example.com / Password123

2. **Verify No Access to Non-Friends' Content**
   - Click "Browse Items"
   - Should see empty feed (no items from Test User or Emma)
   - Click "Browse Wishes"
   - Should see empty feed

3. **Add Friend and Verify Access**
   - Go to Friends page
   - Search for Test User
   - Send friend request
   - (Login as Test User and accept request)
   - Login back as newuser
   - Browse Items/Wishes
   - Should now see Test User's items and wishes

## Expected Behavior

### ✅ What Should Work

- User registration and login
- JWT token persistence (stays logged in on refresh)
- Friend search by username or name
- Friend request send/accept/decline
- Viewing friends list
- Creating items with all fields
- Viewing items feed (only friends' items)
- Marking items as gifted
- Deleting items
- Creating wishes with priorities
- Viewing wishes feed (only friends' wishes)
- Marking wishes as fulfilled
- Deleting wishes
- Protected routes (redirect to login if not authenticated)
- Logout functionality

### ❌ Known Limitations (MVP)

- **No image upload**: Items and wishes don't have photos yet
- **No real-time updates**: Need to refresh to see new content
- **Basic error messages**: Some error messages are generic
- **No pagination**: All items/wishes load at once
- **No search/filter**: Can't search within items or wishes
- **No notifications**: No alerts for new friend requests or items

## Troubleshooting

### Backend Issues

**Problem**: Backend fails to start
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check if port 3000 is available

**Problem**: Database errors
```bash
cd packages/server
pnpm prisma migrate reset  # WARNING: Deletes all data
pnpm prisma db seed
```

### Frontend Issues

**Problem**: Can't login
- Check backend is running
- Check browser console for errors
- Clear localStorage and try again

**Problem**: Items/wishes not showing
- Ensure you're friends with the users
- Check backend logs for errors
- Verify API requests in Network tab

### Common Errors

**"You can only view items from friends"**
- This is correct behavior - you need to be friends first

**"Friend request already sent"**
- The request is pending - check the Requests tab

**"401 Unauthorized"**
- Token may have expired - logout and login again

## API Testing (Optional)

You can also test the API directly with curl or Postman:

### Health Check
```bash
curl http://localhost:3000/api/v1/health
```

### Register
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "apitest",
    "email": "apitest@example.com",
    "password": "Password123",
    "name": "API Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "apitest@example.com",
    "password": "Password123"
  }'
```

Save the token from the response and use it in subsequent requests:

### Get Items Feed
```bash
curl http://localhost:3000/api/v1/items/feed \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Success Criteria

The MVP is working correctly if:
- ✅ You can register and login
- ✅ You can add friends via search
- ✅ You can create, view, and delete items
- ✅ You can create, view, and delete wishes
- ✅ You can only see friends' items and wishes (not strangers')
- ✅ All pages are responsive and styled correctly
- ✅ Authentication persists across page refreshes
- ✅ Error messages appear when things go wrong

## Next Steps After Testing

1. Report any bugs or issues found
2. Consider implementing image upload (Phase 7)
3. Add tests (unit and integration)
4. Deploy to production
5. Gather user feedback

Happy testing! 🎉
