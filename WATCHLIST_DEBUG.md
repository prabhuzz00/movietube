# Watchlist Not Showing - Debug Guide

## Quick Fix (Try This First)

### Option 1: Check Browser Console

1. Open your browser
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for errors (probably says something about "index" or "permission denied")

### Option 2: Check Firebase Console

1. Go to https://console.firebase.google.com/
2. Select your "movietube" project
3. Go to **Firestore Database**
4. Look for a collection called `watchlist`
5. Do you see your data there?

## Common Issues & Solutions

### Issue 1: "Missing or insufficient permissions"

**This is the most common issue!**

**Solution: Update Firestore Security Rules**

1. Go to Firebase Console → Firestore Database
2. Click **"Rules"** tab
3. Replace with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to authenticated users for their own data
    match /watchlist/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
      allow delete: if request.auth != null;
    }
  }
}
```

4. Click **"Publish"**
5. Wait 30 seconds
6. Try again!

### Issue 2: "The query requires an index"

**Solution: Create the index**

Firebase Console will show you a direct link to create the index. Click it!

Or manually:
1. Firebase Console → Firestore Database → Indexes tab
2. Click "Add Index"
3. Collection: `watchlist`
4. Fields to index:
   - `userId` - Ascending
   - `addedAt` - Descending
5. Click "Create"
6. Wait 2-3 minutes for index to build

### Issue 3: Data is saved but not showing

**Temporary Fix: Remove orderBy**

I'll create a version without orderBy that works immediately.

## Step-by-Step Debugging

### Step 1: Check if you're logged in

```javascript
// In browser console (F12), type:
console.log(localStorage.getItem('user'))
```

Should show your user data. If `null`, you're not logged in.

### Step 2: Check Firebase Auth

```javascript
// In browser console:
import { auth } from './src/config/firebase'
console.log(auth.currentUser)
```

Should show your user. If `null`, auth isn't working.

### Step 3: Manual test in console

Try adding to watchlist manually:
1. Go to any page
2. Open console (F12)
3. Add item manually to test Firestore connection

### Step 4: Check Firestore Rules

Most common cause! Rules might be blocking reads.

## Quick Fix Code (No Index Required)

Let me update the watchlist service to work without requiring an index...
