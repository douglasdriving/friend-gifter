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


### 2. Dashboard Loads
- [ ] Dashboard shows welcome message with your name
- [ ] Three cards visible: My Items, My Wishes, Friends
- [ ] Navigation tabs visible at top: Dashboard, Items, Wishes, Friends
- [ ] Logout button visible in header

**Your result:**


---

## Navigation Testing

### 3. Top Navigation Tabs
- [ ] Click "Items" tab - should go to Items Feed page
- [ ] Click "Wishes" tab - should go to Wishes Feed page
- [ ] Click "Friends" tab - should go to Friends page
- [ ] Click "Dashboard" tab - should go back to Dashboard
- [ ] Active tab should be highlighted in blue

**Your result:**


### 4. Header Always Visible
- [ ] Scroll down on any page with content
- [ ] Header with navigation tabs should stay at the top (sticky)

**Your result:**


---

## Items Feature

### 5. View Items Feed
- [ ] Click "Items" tab
- [ ] Should see items from seed data (Bread Maker, etc.)
- [ ] "My Items" and "Refresh" buttons visible at top

**Your result:**


### 6. Navigate to My Items
- [ ] Click "My Items" button
- [ ] Should see "My Items" page
- [ ] Should see "+ Add Item" button
- [ ] Should see "Browse Feed" button

**Your result:**


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


### 13. Navigate to My Wishes
- [ ] Click "My Wishes" button
- [ ] Should see "My Wishes" page
- [ ] Should see "+ Add Wish" button
- [ ] Should see "Browse Feed" button

**Your result:**


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


### 20. Search for Users
- [ ] Click "Search" tab
- [ ] Enter "marcus" in search box
- [ ] Click "Search" or press Enter
- [ ] Should see Marcus Wilson in results
- [ ] "Add Friend" button should be visible

**Your result:**


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
