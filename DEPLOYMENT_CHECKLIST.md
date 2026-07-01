# cPanel Deployment Checklist

Use this checklist to deploy your MovieTube backend to cPanel step by step.

## Pre-Deployment

- [ ] MySQL database created in cPanel
- [ ] Database credentials available
- [ ] Domain/subdomain ready (e.g., api.movietube.in)
- [ ] cPanel has Node.js support enabled
- [ ] Changed JWT_SECRET in .env to a secure random string

## File Preparation

- [ ] All backend files ready to upload
- [ ] .env file configured with production values
- [ ] package.json is correct
- [ ] Verified all files are present:
  - [ ] server.js
  - [ ] db.js
  - [ ] package.json
  - [ ] .env
  - [ ] middleware/auth.js
  - [ ] routes/auth.js
  - [ ] routes/watchlist.js

## cPanel Setup

- [ ] Logged into cPanel
- [ ] Found "Setup Node.js App" feature
- [ ] Created new Node.js application
  - [ ] Selected Node.js version (18.x or 20.x)
  - [ ] Set Application mode: Production
  - [ ] Set Application root: backend
  - [ ] Set Application URL: api.movietube.in
  - [ ] Set Startup file: server.js

## File Upload

- [ ] Uploaded all backend files to application root
- [ ] Verified folder structure is correct
- [ ] .env file uploaded with production values

## Environment Configuration

- [ ] Added environment variables in cPanel:
  - [ ] DB_HOST
  - [ ] DB_USER
  - [ ] DB_PASSWORD
  - [ ] DB_NAME
  - [ ] JWT_SECRET (changed from default!)
  - [ ] PORT
  - [ ] NODE_ENV=production

## Installation

- [ ] Opened Terminal in cPanel
- [ ] Activated Node.js environment:
  ```bash
  source /home/username/nodevenv/backend/20/bin/activate
  ```
- [ ] Navigated to backend folder:
  ```bash
  cd ~/backend
  ```
- [ ] Installed dependencies:
  ```bash
  npm install
  ```
- [ ] Verified installation completed without errors

## Database Testing

- [ ] Ran database connection test:
  ```bash
  npm test
  ```
- [ ] Verified connection successful
- [ ] Checked database tables will be created

## Application Start

- [ ] Started application in cPanel Node.js interface
- [ ] Clicked "Restart" button
- [ ] Verified status shows "Running"
- [ ] Checked for any error messages

## Domain Configuration

- [ ] Subdomain points to correct directory
- [ ] DNS propagation complete (may take 24 hours)
- [ ] Can access: http://api.movietube.in

## SSL Certificate

- [ ] SSL certificate installed for api.movietube.in
- [ ] Tested HTTPS access: https://api.movietube.in
- [ ] No certificate warnings in browser

## API Testing

- [ ] Health check works:
  ```
  https://api.movietube.in/api/health
  ```
- [ ] Returns: {"status":"OK","message":"MovieTube API is running"}

- [ ] Tested registration endpoint:
  ```bash
  curl -X POST https://api.movietube.in/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test123"}'
  ```
- [ ] Registration successful

- [ ] Tested login endpoint
- [ ] Login successful and returns token

## Frontend Integration

- [ ] Updated .env.production with API URL:
  ```
  VITE_API_URL=https://api.movietube.in/api
  ```
- [ ] Updated CORS in backend server.js with frontend domain
- [ ] Built frontend for production:
  ```bash
  npm run build
  ```
- [ ] Deployed frontend build to cPanel

## End-to-End Testing

- [ ] Opened frontend website
- [ ] Tested user registration
- [ ] Tested user login
- [ ] Tested adding movie to watchlist
- [ ] Tested viewing watchlist
- [ ] Tested removing from watchlist
- [ ] No CORS errors in browser console
- [ ] All API calls successful

## Monitoring Setup

- [ ] Installed PM2 for process management (optional)
- [ ] Configured auto-restart
- [ ] Set up log monitoring
- [ ] Verified app stays running

## Security

- [ ] JWT_SECRET changed to secure value
- [ ] CORS configured with specific domains
- [ ] NODE_ENV set to production
- [ ] .env file not publicly accessible
- [ ] SSL/HTTPS enabled
- [ ] Database user has minimal permissions

## Backup

- [ ] Created database backup
- [ ] Downloaded backup of all files
- [ ] Documented backup procedure
- [ ] Set up automated backups (optional)

## Documentation

- [ ] Noted all configuration values
- [ ] Saved database credentials securely
- [ ] Documented API URL
- [ ] Created maintenance notes

## Post-Deployment

- [ ] Sent test registration email to yourself
- [ ] Tested on mobile device
- [ ] Tested on different browsers
- [ ] Monitored error logs for 24 hours
- [ ] No unexpected errors or crashes

## Troubleshooting (if needed)

- [ ] Checked application logs in cPanel
- [ ] Verified all environment variables
- [ ] Tested database connection separately
- [ ] Checked Node.js process is running
- [ ] Reviewed CORS configuration
- [ ] Contacted hosting support if needed

---

## Quick Commands Reference

```bash
# Activate Node.js environment
source /home/username/nodevenv/backend/20/bin/activate

# Navigate to backend
cd ~/backend

# Install dependencies
npm install

# Test database
npm test

# Start server (if not using cPanel interface)
npm start

# Check running processes
ps aux | grep node

# View logs (if using PM2)
pm2 logs movietube-api

# Restart application
pm2 restart movietube-api
```

## Support Contacts

- **Hosting Provider Support:** [Your hosting provider contact]
- **cPanel Documentation:** https://docs.cpanel.net/
- **Node.js Version:** [Note your version here]

---

## Completion

Date Deployed: ___________
API URL: https://api.movietube.in/api
Frontend URL: https://movietube.in
Notes: _______________________________

✅ **Deployment Complete!**
