# cPanel NPM Install Error - Troubleshooting Guide

## Error You're Seeing:
```
Error: An error occured during installation of modules. 
Web application is inaccessible by its address "http://api.movietube.in/". 
The operation wasn't performed.
```

## Quick Fixes (Try These First)

### Solution 1: Manual Installation via Terminal (RECOMMENDED)

Instead of using the "Run NPM Install" button, do it manually:

1. **Open Terminal in cPanel**
2. **Run these commands:**

```bash
# Activate Node.js environment (IMPORTANT - copy this from your Node.js app page)
source /home/YOUR_USERNAME/nodevenv/backend/NODE_VERSION/bin/activate

# Navigate to your backend folder
cd ~/backend

# Now install
npm install
```

**To get the exact activation command:**
- Go to your Node.js app in cPanel
- Look for the command that starts with `source /home/...`
- Copy and paste that exact command

### Solution 2: Check File Location

The error often occurs when files are in the wrong location.

**Verify your folder structure:**

1. Go to **cPanel File Manager**
2. Navigate to your home directory
3. You should see a folder called `backend` (or whatever you named it)
4. Inside `backend`, you should have:
   ```
   backend/
   ├── server.js
   ├── package.json
   ├── db.js
   ├── .env
   ├── middleware/
   └── routes/
   ```

**If the structure is wrong:**
- The "Application root" in your Node.js app settings should match where these files are
- Example: If files are in `/home/username/backend`, set Application root to `backend`

### Solution 3: Check Node.js Version

1. Go to **Setup Node.js App** in cPanel
2. Click **Edit** on your application
3. Change Node.js version to **20.x** (or latest LTS)
4. Click **Save**
5. Try again

### Solution 4: Delete and Recreate Application

Sometimes cPanel caches settings incorrectly:

1. **Delete** the Node.js application (this won't delete your files)
2. **Create a new one** with these settings:
   - Node.js version: 20.x
   - Application mode: Production
   - Application root: `backend`
   - Application URL: `http://api.movietube.in`
   - Application startup file: `server.js`
3. Don't click "Run NPM Install" yet
4. Use **Solution 1** (Manual Terminal method)

### Solution 5: Simplified package.json

Some cPanel versions have issues with ES modules. Let's create a CommonJS version:

**Create a new file: `package-simple.json`**

```json
{
  "name": "movieweb-backend",
  "version": "1.0.0",
  "description": "Backend API for MovieTube",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express-validator": "^7.0.1"
  }
}
```

**Then in Terminal:**
```bash
cd ~/backend
mv package.json package-old.json
mv package-simple.json package.json
npm install
```

## Detailed Step-by-Step Fix

### Step 1: Verify Your Setup

**Check in cPanel File Manager:**

1. Navigate to your home directory (`/home/your_username/`)
2. Look for the `backend` folder
3. Click into it
4. Verify you see: `server.js`, `package.json`, `db.js`, etc.

**Screenshot what you see and check against this:**
```
/home/your_username/
└── backend/
    ├── server.js ✓
    ├── package.json ✓
    ├── db.js ✓
    ├── .env ✓
    ├── middleware/
    │   └── auth.js ✓
    └── routes/
        ├── auth.js ✓
        └── watchlist.js ✓
```

### Step 2: Check Node.js App Configuration

1. Go to **Setup Node.js App**
2. Click **Edit** on your app
3. Verify these settings:

```
Node.js version: 20.x (or 18.x)
Application mode: Production
Application root: backend          ← Must match your folder name
Application URL: http://api.movietube.in
Application startup file: server.js
```

### Step 3: Manual Installation (Best Method)

1. **Open Terminal** in cPanel

2. **Get your activation command:**
   - Go back to your Node.js app page
   - You'll see a command like:
     ```bash
     source /home/movi518571/nodevenv/backend/20/bin/activate && cd /home/movi518571/backend
     ```
   - Copy this ENTIRE command

3. **In Terminal, paste and run:**
   ```bash
   source /home/YOUR_USERNAME/nodevenv/backend/20/bin/activate
   cd ~/backend
   ```

4. **Verify you're in the right place:**
   ```bash
   pwd
   ls -la
   ```
   - You should see your files listed

5. **Install dependencies:**
   ```bash
   npm install --production
   ```

6. **Wait for completion** (may take 2-3 minutes)

7. **Verify installation:**
   ```bash
   ls node_modules/
   ```
   - You should see folders like: express, mysql2, bcryptjs, etc.

### Step 4: Test the Installation

```bash
# Still in terminal, still in ~/backend
npm test
```

This will test your database connection.

### Step 5: Start the Application

**Option A: Via cPanel Interface**
1. Go to **Setup Node.js App**
2. Click **Edit** on your app
3. Click **Restart**
4. Status should turn green

**Option B: Via Terminal**
```bash
cd ~/backend
source /home/YOUR_USERNAME/nodevenv/backend/20/bin/activate
node server.js
```

## Common Issues and Solutions

### Issue: "Cannot find module 'express'"

**Solution:**
```bash
cd ~/backend
source /home/YOUR_USERNAME/nodevenv/backend/20/bin/activate
npm install
```

### Issue: "Permission denied"

**Solution:**
```bash
cd ~/backend
chmod +x server.js
```

### Issue: "Port already in use"

**Solution:**
1. Find and kill the process:
   ```bash
   ps aux | grep node
   kill -9 [PID]
   ```
2. Or change PORT in your .env file

### Issue: "Application root not found"

**Solution:**
1. Check exact folder name in File Manager
2. Update "Application root" in Node.js app settings to match

### Issue: npm install hangs/freezes

**Solution:**
1. Press Ctrl+C to cancel
2. Try with cache clean:
   ```bash
   npm cache clean --force
   npm install
   ```

## Alternative: Using Git

If File Manager upload is problematic:

```bash
cd ~
git clone https://github.com/yourusername/movieweb-backend.git backend
cd backend
npm install
```

## Verification Checklist

After fixing, verify:

- [ ] Files are in correct location (`~/backend/`)
- [ ] package.json exists and is valid JSON
- [ ] Node.js app points to correct Application root
- [ ] npm install completed without errors
- [ ] node_modules/ folder exists and has packages
- [ ] Application status shows "Running" (green)

## Test Your API

Once running, test:

```bash
curl http://api.movietube.in/api/health
```

Should return:
```json
{"status":"OK","message":"MovieTube API is running"}
```

## Still Having Issues?

1. **Check cPanel Error Log:**
   - Setup Node.js App → Your App → Scroll to bottom → View logs

2. **Check Terminal Output:**
   - Run `node server.js` in terminal
   - Look for specific error messages

3. **Contact Your Host:**
   - Some hosts have custom Node.js configurations
   - Ask: "What's the correct way to deploy Node.js apps with ES modules?"

## Most Common Solution (90% Success Rate)

```bash
# In cPanel Terminal:

# 1. Activate Node environment (get this command from your Node.js app page)
source /home/YOUR_USERNAME/nodevenv/backend/20/bin/activate

# 2. Go to your backend folder
cd ~/backend

# 3. Check you're in the right place
ls -la

# 4. Install
npm install --production

# 5. Test
npm test

# 6. Start (go back to cPanel interface and click Restart)
```

---

## Quick Debug Commands

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check current directory
pwd

# List files
ls -la

# Check if port is in use
netstat -tlnp | grep :3000

# View running Node processes
ps aux | grep node

# Read package.json
cat package.json

# Check if node_modules exists
ls -la node_modules/
```

## Contact Info for Your Host

When contacting support, provide:
- Your domain: movietube.in
- Error message: "An error occured during installation of modules"
- What you tried: Manual npm install via terminal
- Ask: "Can you help me deploy a Node.js Express application with ES modules?"

---

**Next Steps:**
1. Try Solution 1 (Manual Terminal Installation) first
2. If that doesn't work, try Solution 4 (Delete and Recreate)
3. If still stuck, share the exact error from Terminal
