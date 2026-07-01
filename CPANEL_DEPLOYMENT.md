# Deploying MovieTube Backend to cPanel

Complete guide to deploy your Node.js Express backend on cPanel hosting.

## Prerequisites

- ✅ cPanel account with Node.js support
- ✅ MySQL database already created (you have this)
- ✅ Domain or subdomain for the API
- ✅ SSH access (optional but recommended)

## Step-by-Step Deployment Guide

### Step 1: Check Node.js Availability

1. Log into your **cPanel**
2. Search for **"Node.js"** or **"Setup Node.js App"** in the search bar
3. If you don't see it, contact your hosting provider to enable Node.js

### Step 2: Create Node.js Application

1. Go to **"Setup Node.js App"** in cPanel
2. Click **"Create Application"**

Configure the application:

```
Node.js version: Select latest LTS version (18.x or 20.x recommended)
Application mode: Production
Application root: backend (or nodejs-backend)
Application URL: Choose a subdomain (e.g., api.movietube.in)
Application startup file: server.js
```

3. Click **"Create"**

### Step 3: Upload Backend Files

#### Option A: Using File Manager (Easier)

1. Go to **cPanel File Manager**
2. Navigate to the application root folder you specified (e.g., `/home/username/backend`)
3. Upload these files:
   - `server.js`
   - `db.js`
   - `package.json`
   - `.env` (you'll create this)
   - `middleware/` folder (with `auth.js`)
   - `routes/` folder (with `auth.js` and `watchlist.js`)

4. Or upload a ZIP file with all backend files and extract it

#### Option B: Using SSH/Terminal (Recommended)

1. Enable **SSH Access** in cPanel (under "SSH Access")
2. Connect via SSH:
   ```bash
   ssh username@yourdomain.com
   ```

3. Navigate to your directory:
   ```bash
   cd ~/backend
   ```

4. Upload files using FTP/SFTP client (FileZilla, WinSCP, etc.)

### Step 4: Configure Environment Variables

1. In cPanel, go back to **"Setup Node.js App"**
2. Click **"Edit"** on your application
3. Scroll down to **"Environment Variables"** section
4. Add these variables:

```
DB_HOST=localhost
DB_USER=movi518571_movietube
DB_PASSWORD=movi518571_movietube
DB_NAME=movi518571_movietube
JWT_SECRET=your-secure-random-string-change-this-now-production-key-2024
PORT=3000
NODE_ENV=production
```

**IMPORTANT**: 
- Change `JWT_SECRET` to a long, random string (use a password generator)
- `DB_HOST` is usually `localhost` on cPanel
- `PORT` may need to be different depending on your host (check with provider)

5. Click **"Save"**

### Step 5: Install Dependencies

#### Method 1: Using cPanel Interface (Easiest)

1. In **"Setup Node.js App"**, click on your application
2. You'll see a command to run in terminal:
   ```bash
   source /home/username/nodevenv/backend/20/bin/activate && cd /home/username/backend
   ```
3. Copy this command
4. Go to **"Terminal"** in cPanel
5. Paste the command and press Enter
6. Run:
   ```bash
   npm install
   ```

#### Method 2: Using SSH

```bash
cd ~/backend
source /home/username/nodevenv/backend/20/bin/activate
npm install
```

### Step 6: Update MySQL Host (If Needed)

Some cPanel hosts use a different MySQL host. To find yours:

1. Go to **cPanel → MySQL Databases**
2. Look for **"MySQL Host"** information (usually shown at the top)
3. If it's not `localhost`, update your `.env`:
   ```
   DB_HOST=mysql.yourdomain.com  # or whatever host is shown
   ```

### Step 7: Test Database Connection

Create a test file `test-db.js` in your backend folder:

```javascript
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    
    console.log('✅ Database connected successfully!');
    await connection.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();
```

Run it:
```bash
node test-db.js
```

### Step 8: Start the Application

1. Go to **"Setup Node.js App"** in cPanel
2. Click **"Edit"** on your application
3. Click **"Restart"** button
4. Check the status - it should show as "Running"

Or via SSH:
```bash
cd ~/backend
source /home/username/nodevenv/backend/20/bin/activate
npm start
```

### Step 9: Configure Subdomain (API Domain)

#### Option A: Using Subdomain

1. Go to **cPanel → Domains** or **Subdomains**
2. Create a new subdomain: `api.movietube.in`
3. Point it to your backend application root
4. The Node.js app should automatically bind to this domain

#### Option B: Using Main Domain with Path

If you want `movietube.in/api` instead:

1. You'll need to set up a reverse proxy using `.htaccess`
2. In your main domain's root, create/edit `.htaccess`:

```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/api/(.*)$
RewriteRule ^api/(.*)$ http://localhost:3000/api/$1 [P,L]
```

### Step 10: Enable SSL (HTTPS)

1. Go to **cPanel → SSL/TLS Status**
2. Find your API subdomain
3. Click **"Run AutoSSL"** (if available with Let's Encrypt)
4. Or install SSL certificate manually

Your API will now be accessible via:
```
https://api.movietube.in
```

### Step 11: Update Frontend Configuration

Update your frontend's API URL:

**`src/services/api.js`:**

```javascript
const API_URL = import.meta.env.PROD 
  ? 'https://api.movietube.in/api'  // Production
  : 'http://localhost:5000/api';     // Development
```

Or create environment files:

**`.env.production`** (in frontend root):
```
VITE_API_URL=https://api.movietube.in/api
```

**`.env.development`**:
```
VITE_API_URL=http://localhost:5000/api
```

Update `api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Step 12: Update CORS Settings

Update `backend/server.js` to allow your frontend domain:

```javascript
import cors from 'cors';

app.use(cors({
  origin: [
    'https://movietube.in',
    'https://www.movietube.in',
    'http://localhost:5173'  // Keep for local development
  ],
  credentials: true
}));
```

### Step 13: Test the Deployment

1. Visit your API health check:
   ```
   https://api.movietube.in/api/health
   ```
   Should return: `{ "status": "OK", "message": "MovieTube API is running" }`

2. Test registration:
   ```bash
   curl -X POST https://api.movietube.in/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123"}'
   ```

3. Open your frontend and test:
   - Register a new account
   - Login
   - Add items to watchlist

## Common Issues & Solutions

### Issue 1: "Cannot find module" errors

**Solution:**
```bash
cd ~/backend
source /home/username/nodevenv/backend/20/bin/activate
npm install
```

### Issue 2: Port already in use

**Solution:**
- Change `PORT` in `.env` to a different port (check with hosting provider)
- Common alternatives: 3000, 3001, 8080, 8081

### Issue 3: Database connection refused

**Solutions:**
1. Check if `DB_HOST` is correct (try `localhost`, `127.0.0.1`, or `mysql.yourdomain.com`)
2. Verify database user has remote access (cPanel → MySQL Databases → Remote MySQL)
3. Check if MySQL is running (contact hosting support)

### Issue 4: CORS errors in browser

**Solution:**
Update `server.js` CORS configuration to include your frontend domain:
```javascript
app.use(cors({
  origin: 'https://movietube.in',
  credentials: true
}));
```

### Issue 5: Application keeps restarting

**Solutions:**
1. Check logs in cPanel Node.js app interface
2. Run in terminal to see errors:
   ```bash
   cd ~/backend
   source /home/username/nodevenv/backend/20/bin/activate
   node server.js
   ```
3. Common causes:
   - Port conflict
   - Missing environment variables
   - Database connection failure

### Issue 6: 502 Bad Gateway

**Solutions:**
1. Restart the Node.js application in cPanel
2. Check if Node.js process is running:
   ```bash
   ps aux | grep node
   ```
3. Check application logs

## Process Manager (Keep App Running)

To ensure your app stays running even after SSH disconnection:

### Option 1: Using PM2 (Recommended)

```bash
cd ~/backend
source /home/username/nodevenv/backend/20/bin/activate
npm install pm2 -g
pm2 start server.js --name movietube-api
pm2 save
pm2 startup
```

### Option 2: Using Forever

```bash
npm install forever -g
forever start server.js
```

### Option 3: cPanel Auto-Restart

Most cPanel Node.js apps have auto-restart enabled by default. Check your app settings.

## Monitoring & Maintenance

### View Logs

**cPanel Interface:**
1. Go to **Setup Node.js App**
2. Click on your application
3. Scroll down to view logs

**Via SSH:**
```bash
cd ~/backend
tail -f logs/error.log  # if you set up logging
```

### Check Application Status

**cPanel:**
- Green status = Running
- Red status = Stopped

**SSH:**
```bash
ps aux | grep node
```

### Restart Application

**cPanel:**
1. Setup Node.js App → Edit → Restart

**SSH:**
```bash
pm2 restart movietube-api
# or
cd ~/backend && npm start
```

## Security Checklist

- [ ] Changed `JWT_SECRET` to a strong, unique value
- [ ] Enabled SSL/HTTPS for API
- [ ] Updated CORS to only allow your frontend domain
- [ ] Set `NODE_ENV=production`
- [ ] Database user has only necessary permissions
- [ ] `.env` file is not publicly accessible
- [ ] Kept `.env` out of Git (add to `.gitignore`)
- [ ] Regular backups of database

## Performance Optimization

1. **Enable Gzip Compression:**
   ```javascript
   import compression from 'compression';
   app.use(compression());
   ```

2. **Use Connection Pooling:**
   Already configured in `db.js` with `mysql2/promise` pool

3. **Add Rate Limiting:**
   ```bash
   npm install express-rate-limit
   ```
   
   ```javascript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

## Updating Your Application

When you need to update code:

1. Upload new files via File Manager or FTP
2. SSH into server:
   ```bash
   cd ~/backend
   source /home/username/nodevenv/backend/20/bin/activate
   npm install  # if package.json changed
   ```
3. Restart app in cPanel or via PM2:
   ```bash
   pm2 restart movietube-api
   ```

## Backup Strategy

### Database Backup

**Manual:**
1. cPanel → phpMyAdmin
2. Select database → Export → Go

**Automated:**
```bash
# Create backup script
mysqldump -u movi518571_movietube -p movi518571_movietube > backup_$(date +%Y%m%d).sql
```

### Code Backup

Use Git:
```bash
cd ~/backend
git init
git add .
git commit -m "Backup $(date)"
git push origin main
```

## Support Resources

- **Your Hosting Provider:** Contact support for Node.js specific issues
- **cPanel Documentation:** https://docs.cpanel.net/
- **Node.js Logs:** Check in cPanel Node.js app interface
- **MySQL Access:** Use phpMyAdmin in cPanel for database management

---

## Quick Reference Commands

```bash
# Activate Node.js environment
source /home/username/nodevenv/backend/20/bin/activate

# Install dependencies
npm install

# Run application
npm start

# View running Node processes
ps aux | grep node

# Restart with PM2
pm2 restart movietube-api

# View PM2 logs
pm2 logs movietube-api

# Check app status
pm2 status
```

## Final Checklist

- [ ] Node.js app created in cPanel
- [ ] All backend files uploaded
- [ ] Environment variables configured
- [ ] Dependencies installed (`npm install`)
- [ ] Database connection tested
- [ ] Application started and running
- [ ] SSL certificate installed
- [ ] Frontend API URL updated
- [ ] CORS configured for your domain
- [ ] Tested registration and login
- [ ] Tested watchlist functionality
- [ ] Set up monitoring/logs
- [ ] Created backup strategy

Your backend should now be live at `https://api.movietube.in`! 🚀
