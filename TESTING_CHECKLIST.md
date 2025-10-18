# Friend Gifting MVP - Testing Checklist

Please test each item below and write your results underneath each checkbox.
- If it works: Write "✅ Works" or "PASS"
- If it doesn't work: Write "❌ Fails" and describe what happens, including any error messages

## Setup & Login

### 1. Login with Test User
- [ ] Navigate to http://localhost:5173
- [ ] Login with: emma@example.com / Password123
- [ ] Should redirect to dashboard

**Your result:**
PASS

### 2. Dashboard Loads
- [ ] Dashboard shows welcome message with your name
- [ ] Three cards visible: My Items, My Wishes, Friends
- [ ] Navigation tabs visible at top: Dashboard, Items, Wishes, Friends
- [ ] Logout button visible in header

**Your result:**
PASS

---

## Navigation Testing

### 3. Top Navigation Tabs
- [ ] Click "Items" tab - should go to Items Feed page
- [ ] Click "Wishes" tab - should go to Wishes Feed page
- [ ] Click "Friends" tab - should go to Friends page
- [ ] Click "Dashboard" tab - should go back to Dashboard
- [ ] Active tab should be highlighted in blue

**Your result:**
PASS

### 4. Header Always Visible
- [ ] Scroll down on any page with content
- [ ] Header with navigation tabs should stay at the top (sticky)

**Your result:**
PASS

---

## Items Feature

### 5. View Items Feed
- [ ] Click "Items" tab
- [ ] Should see items from seed data (Bread Maker, etc.)
- [ ] "My Items" and "Refresh" buttons visible at top

**Your result:**
PASS

### 6. Navigate to My Items
- [ ] Click "My Items" button
- [ ] Should see "My Items" page
- [ ] Should see "+ Add Item" button
- [ ] Should see "Browse Feed" button

**Your result:**
PASS

### 7. Create New Item
- [ ] Click "+ Add Item"
- [ ] Form should appear
- [ ] Fill in:
  - Title: "Test Laptop"
  - Description: "Old laptop, works fine"
  - Category: "Electronics"
  - Condition: Select "GOOD"
- [ ] Click "Create Item"
- [ ] Form should close
- [ ] New item should appear in the list

**Your result:**
FAILED: When pressing "Create item" a browser warning pops up saying "Failed to create item". In the front-end console, this is logged:

12:10:01 [vite] http proxy error: /api/v1/items
Error: read ECONNRESET
    at TCP.onStreamRead (node:internal/stream_base_commons:216:20)

and in the backend:

E:\projects\vibe\friend-gifting\packages\server\src\services\items.service.ts:119:36

  116  * Create new item
  117  */
  118 async create(userId: string, data: CreateItemDto) {
→ 119   const item = await prisma.item.create({
          data: {
            userId: undefined,
            title: "Test Laptop",
            description: "Old latop, works fine",
            category: "Electronics",
            condition: "GOOD",
        +   user: {
        +     create: UserCreateWithoutItemsInput | UserUncheckedCreateWithoutItemsInput,
        +     connectOrCreate: UserCreateOrConnectWithoutItemsInput,
        +     connect: UserWhereUniqueInput
        +   }
          },
          include: {
            photos: true
          }
        })

Argument `user` is missing.
    at wn (E:\projects\vibe\friend-gifting\node_modules\.pnpm\@prisma+client@5.22.0_prisma@5.22.0\node_modules\@prisma\client\runtime\library.js:29:1363)
    at $n.handleRequestError (E:\projects\vibe\friend-gifting\node_modules\.pnpm\@prisma+client@5.22.0_prisma@5.22.0\node_modules\@prisma\client\runtime\library.js:121:6958)
    at $n.handleAndLogRequestError (E:\projects\vibe\friend-gifting\node_modules\.pnpm\@prisma+client@5.22.0_prisma@5.22.0\node_modules\@prisma\client\runtime\library.js:121:6623)
    at $n.request (E:\projects\vibe\friend-gifting\node_modules\.pnpm\@prisma+client@5.22.0_prisma@5.22.0\node_modules\@prisma\client\runtime\library.js:121:6307)
    at async l (E:\projects\vibe\friend-gifting\node_modules\.pnpm\@prisma+client@5.22.0_prisma@5.22.0\node_modules\@prisma\client\runtime\library.js:130:9633)
    at async Object.create (E:\projects\vibe\friend-gifting\packages\server\src\services\items.service.ts:119:18)
    at async create (E:\projects\vibe\friend-gifting\packages\server\src\controllers\items.controller.ts:28:18) {
  clientVersion: '5.22.0'
}

### 8. View Item Details
- [ ] Click on any item card
- [ ] Should navigate to item detail page
- [ ] Back button (←) should be visible in header (NOT the tabs)
- [ ] Item title, description, condition, category should display
- [ ] If it's your item: "Mark as Gifted" and "Delete Item" buttons visible

**Your result:**


### 9. Back Button from Item Details
- [ ] From item detail page, click the back button (←)
- [ ] Should return to previous page (My Items or Items Feed)
- [ ] Navigation tabs should be visible again

**Your result:**


### 10. Mark Item as Gifted
- [ ] Navigate to one of YOUR items (e.g., the "Test Laptop" you created)
- [ ] Click "Mark as Gifted"
- [ ] Green "✓ Gifted" badge should appear
- [ ] "Mark as Gifted" button should disappear

**Your result:**


### 11. Delete Item
- [ ] Navigate to one of YOUR items
- [ ] Click "Delete Item"
- [ ] Confirmation dialog should appear
- [ ] Click OK/Confirm
- [ ] Should navigate back to "My Items"
- [ ] Item should no longer be in the list

**Your result:**


---

## Wishes Feature

### 12. View Wishes Feed
- [ ] Click "Wishes" tab
- [ ] Should see wishes from seed data
- [ ] "My Wishes" and "Refresh" buttons visible at top

**Your result:**
FAILED: No wishes appear.
11:58:16 [vite] http proxy error: /api/v1/wishes/feed
AggregateError [ECONNREFUSED]:
    at internalConnectMultiple (node:net:1134:18)
    at afterConnectMultiple (node:net:1715:7) (x4)

### 13. Navigate to My Wishes
- [ ] Click "My Wishes" button
- [ ] Should see "My Wishes" page
- [ ] Should see "+ Add Wish" button
- [ ] Should see "Browse Feed" button

**Your result:**
PASS

### 14. Create New Wish
- [ ] Click "+ Add Wish"
- [ ] Form should appear
- [ ] Fill in:
  - Title: "Standing Desk"
  - Description: "Looking for adjustable standing desk"
  - Category: "Furniture"
  - Priority: Select "HIGH"
- [ ] Click "Create Wish"
- [ ] Form should close
- [ ] New wish should appear in the list

**Your result:**
FAILED: same error as when trying to create an item.
11:58:46 [vite] http proxy error: /api/v1/wishes
AggregateError [ECONNREFUSED]:
    at internalConnectMultiple (node:net:1134:18)
    at afterConnectMultiple (node:net:1715:7)

### 15. View Wish Details
- [ ] Click on any wish card
- [ ] Should navigate to wish detail page
- [ ] Back button (←) should be visible in header (NOT the tabs)
- [ ] Wish title, description, priority, category should display
- [ ] If it's your wish: "Mark as Fulfilled" and "Delete Wish" buttons visible

**Your result:**


### 16. Back Button from Wish Details
- [ ] From wish detail page, click the back button (←)
- [ ] Should return to previous page (My Wishes or Wishes Feed)
- [ ] Navigation tabs should be visible again

**Your result:**


### 17. Mark Wish as Fulfilled
- [ ] Navigate to one of YOUR wishes (e.g., "Standing Desk")
- [ ] Click "Mark as Fulfilled"
- [ ] Green "✓ Fulfilled" badge should appear
- [ ] "Mark as Fulfilled" button should disappear

**Your result:**


### 18. Delete Wish
- [ ] Navigate to one of YOUR wishes
- [ ] Click "Delete Wish"
- [ ] Confirmation dialog should appear
- [ ] Click OK/Confirm
- [ ] Should navigate back to "My Wishes"
- [ ] Wish should no longer be in the list

**Your result:**


---

## Friends Feature

### 19. View Friends Page
- [ ] Click "Friends" tab
- [ ] Should see Friends page with three tabs: Friends, Search, Requests
- [ ] Default tab should be "Friends"

**Your result:**
PASS

### 20. Search for Users
- [ ] Click "Search" tab
- [ ] Enter "marcus" in search box
- [ ] Click "Search" or press Enter
- [ ] Should see Marcus Wilson in results
- [ ] "Add Friend" button should be visible

**Your result:**
FAILED: browser warning says search failed.
12:00:00 [vite] http proxy error: /api/v1/friends/search?q=marcus
AggregateError [ECONNREFUSED]:
    at internalConnectMultiple (node:net:1134:18)
    at afterConnectMultiple (node:net:1715:7)

### 21. Send Friend Request
- [ ] From search results, click "Add Friend" next to Marcus
- [ ] Alert should show "Friend request sent!"
- [ ] Click OK

**Your result:**


### 22. View Sent Requests
- [ ] Click "Requests" tab
- [ ] Should see "Sent Requests" section
- [ ] Marcus Wilson should appear with "Pending..." status
- [ ] "Cancel" button visible

**Your result:**


---

## Testing Friend-Gating (Privacy)

### 23. Logout and Login as Different User
- [ ] Click "Logout" in header
- [ ] Should return to landing page
- [ ] Login with: marcus@example.com / Password123
- [ ] Should redirect to dashboard

**Your result:**
PASS, but I had to restart the server for this to work. It might be that a server error caused basically all items to stop working, also the above fails

### 24. Accept Friend Request
- [ ] Click "Friends" tab
- [ ] Click "Requests" tab
- [ ] Should see "Received Requests" section
- [ ] Emma Brown should appear
- [ ] Click "Accept"
- [ ] Alert should show "Friend request accepted!"
- [ ] Emma should move to "Friends" tab

**Your result:**


### 25. Verify Friend's Items Appear
- [ ] Click "Items" tab (Items Feed)
- [ ] Should now see Emma's items (e.g., "Test Laptop" if not deleted)
- [ ] Before accepting, you wouldn't have seen Emma's items

**Your result:**


### 26. Verify Friend's Wishes Appear
- [ ] Click "Wishes" tab (Wishes Feed)
- [ ] Should now see Emma's wishes (e.g., "Standing Desk" if not deleted)

**Your result:**


### 27. Remove Friend
- [ ] Click "Friends" tab
- [ ] Should see Emma Brown in friends list
- [ ] Click "Remove"
- [ ] Confirmation should appear
- [ ] Click OK
- [ ] Emma should disappear from friends list

**Your result:**


### 28. Verify Friend-Gating After Removal
- [ ] Click "Items" tab
- [ ] Emma's items should NO LONGER appear (friend-gated)
- [ ] Click "Wishes" tab
- [ ] Emma's wishes should NO LONGER appear (friend-gated)

**Your result:**


---

## PWA Navigation (The Critical Test!)

### 29. Navigate Without Browser Back Button
- [ ] Start at Dashboard
- [ ] Click Items → Click an item → Click back button in app
- [ ] Click Wishes → Click a wish → Click back button in app
- [ ] Click My Items → Click "+ Add Item" → Click Cancel
- [ ] Click Friends → Click Search → Click Friends tab
- [ ] At NO point should you need the browser back button
- [ ] All navigation should work within the app

**Your result:**


### 30. Cross-Navigation Buttons
- [ ] From Items Feed: "My Items" button should take you to My Items
- [ ] From My Items: "Browse Feed" button should take you to Items Feed
- [ ] From Wishes Feed: "My Wishes" button should take you to My Wishes
- [ ] From My Wishes: "Browse Feed" button should take you to Wishes Feed

**Your result:**
PASS

---

## Additional Checks

### 31. Refresh Button Works
- [ ] On Items Feed, click "Refresh" button
- [ ] Should reload items
- [ ] On Wishes Feed, click "Refresh" button
- [ ] Should reload wishes

**Your result:**


### 32. Empty States
- [ ] Create a new user account (register with new email)
- [ ] My Items should show "You haven't added any items yet" with "Add Your First Item" button
- [ ] My Wishes should show "You haven't added any wishes yet" with "Add Your First Wish" button
- [ ] Friends should show "No friends yet" with "Find Friends" button
- [ ] Items Feed should show "No items available" (no friends yet)
- [ ] Wishes Feed should show "No wishes available" (no friends yet)

**Your result:**


---

## Summary

When you're done testing, please let me know and I'll review all your results and fix any issues!

**Overall Status:**
- Total Tests: 32
- Passed:
- Failed:
- Notes:
