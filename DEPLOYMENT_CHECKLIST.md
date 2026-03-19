# ✅ DEPLOYMENT CHECKLIST - Hostinger

## Pre-Deployment (On Your Mac)

- [x] CSS variables fixed in `globals.css`
- [x] Layout updated with inline styles
- [x] `.htaccess` created in project root
- [x] Build scripts updated in `package.json`
- [x] Clean build completed

**Run this to prepare deployment**:
```bash
npm run deploy:hostinger
```

---

## Deployment Steps (Upload to Hostinger)

### 1. Upload `.htaccess` ⚠️ MOST CRITICAL
- [ ] Go to Hostinger File Manager
- [ ] Navigate to `public_html/` (your root)
- [ ] Upload `.htaccess` from your project root
- [ ] Verify it's there: `public_html/.htaccess`

### 2. Upload `.next` Folder
- [ ] Upload entire `.next/` folder to `public_html/.next/`
- [ ] Verify it contains:
  - [ ] `BUILD_ID` file
  - [ ] `static/chunks/` folder with JS/CSS files
  - [ ] `server/` folder

### 3. Upload Other Files
- [ ] `package.json`
- [ ] `package-lock.json`
- [ ] `next.config.ts`
- [ ] `public/` folder (if not already there)

### 4. Upload node_modules (Optional)
Choose ONE:
- [ ] **Option A**: Upload entire `node_modules/` folder (slow but reliable)
- [ ] **Option B**: Run `npm install` on Hostinger (via SSH or Node.js panel)

---

## Configuration (Hostinger Control Panel)

### Node.js Settings
- [ ] Open: Hostinger Control Panel → Advanced → Node.js
- [ ] **Node.js Version**: Select `20.x` or `22.x`
- [ ] **Application root**: `public_html` (or your app folder path)
- [ ] **Application URL**: `inatro-sofala.com`
- [ ] **Application startup file**: `node_modules/next/dist/bin/next`

### Environment Variables
- [ ] Click "Add Variable"
- [ ] Name: `NODE_ENV`
- [ ] Value: `production`
- [ ] Click Save

### MongoDB Connection (If needed)
- [ ] Add `MONGODB_URI` environment variable
- [ ] Value: Your MongoDB connection string

---

## Start Application

- [ ] Click "Restart Application" in Node.js panel
- [ ] Wait 30 seconds for app to start
- [ ] Check status shows "Running"

---

## Verification Tests

### Test 1: Check Main Page
- [ ] Visit: `https://inatro-sofala.com/login`
- [ ] **Expected**: Page loads with styles ✅
- [ ] **Open DevTools** → Console
- [ ] **Expected**: No errors ✅

### Test 2: Check Static Files
- [ ] Visit: `https://inatro-sofala.com/_next/static/chunks/[any-file].js`
- [ ] **Expected**: JavaScript code displays (not 404)
- [ ] **DevTools → Network**: `Content-Type: application/javascript` ✅

### Test 3: Check CSS
- [ ] Visit: `https://inatro-sofala.com/_next/static/chunks/[any-file].css`
- [ ] **Expected**: CSS code displays
- [ ] **DevTools → Network**: `Content-Type: text/css` ✅

### Test 4: Check Styles
- [ ] Page background is white (from CSS variable `--background`)
- [ ] Text is dark (from CSS variable `--foreground`)
- [ ] Fonts load correctly
- [ ] All Tailwind classes work

---

## Troubleshooting

### ❌ Getting 404 Errors?
**Fix**:
- [ ] Verify `.next` folder uploaded completely
- [ ] Check path: `public_html/.next/static/chunks/`
- [ ] Re-upload `.next` folder

### ❌ Getting "MIME type 'text/plain'" Errors?
**Fix**:
- [ ] Verify `.htaccess` is in root: `public_html/.htaccess`
- [ ] Check `.htaccess` content contains `AddType` directives
- [ ] Contact Hostinger support to enable `mod_mime` and `mod_headers`

### ❌ Styles Not Loading?
**Fix**:
- [ ] Hard refresh browser: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
- [ ] Clear browser cache completely
- [ ] Restart Node.js app in Hostinger panel

### ❌ "MongooseError: Operation buffering timed out"?
**Fix**:
- [ ] Check MongoDB connection string in environment variables
- [ ] Verify MongoDB Atlas allows Hostinger IP
- [ ] Test connection from Hostinger SSH

---

## Post-Deployment Monitoring

### First 5 Minutes
- [ ] Check Hostinger error logs (Node.js panel → Logs)
- [ ] Test all main routes: `/`, `/login`, `/admin`
- [ ] Test API endpoints work
- [ ] Test file uploads work

### First Hour
- [ ] Monitor Hostinger performance metrics
- [ ] Check for any crash/restart notifications
- [ ] Test from different devices/browsers

### First Day
- [ ] Check error logs for any patterns
- [ ] Monitor memory usage
- [ ] Verify all features working

---

## Rollback Plan (If Needed)

If deployment fails:
1. **Keep old `.next` folder** (rename to `.next.backup`)
2. **Restore from backup** if needed
3. **Check Hostinger logs** for specific errors
4. **Contact Hostinger support** with error messages

---

## Success Criteria ✅

Deployment is successful when ALL are true:

- ✅ No 404 errors in browser console
- ✅ No MIME type errors in browser console
- ✅ CSS styles apply correctly (white background, proper colors)
- ✅ JavaScript executes without errors
- ✅ Fonts load and display correctly
- ✅ Login page works
- ✅ Admin pages accessible (with auth)
- ✅ API endpoints respond correctly
- ✅ File uploads work (if applicable)

---

## Important Notes

1. **Turbopack is NORMAL**: Next.js 16 uses Turbopack by default. The `turbopack-*.js` files are expected.

2. **`.htaccess` is CRITICAL**: This file fixes the MIME type issues. Without it, Apache serves files as `text/plain`.

3. **Hard Refresh Required**: After deployment, always hard refresh browser to bypass cache.

4. **Node.js Version**: Must be 20.x or higher. Next.js 16 requires modern Node.js.

5. **Environment Variables**: Must include `NODE_ENV=production` for proper operation.

---

## Estimated Time

- **Upload files**: 10-20 minutes (depending on connection speed)
- **Configuration**: 5 minutes
- **Testing**: 5 minutes
- **Total**: ~30 minutes

---

## Support Resources

- **Hostinger Support**: Contact if Apache modules need enabling
- **Project Documentation**: 
  - [HOSTINGER_MIME_FIX.md](HOSTINGER_MIME_FIX.md) - MIME type troubleshooting
  - [HOSTINGER_DEPLOY.md](HOSTINGER_DEPLOY.md) - Full deployment guide
  - [SOLUTION_SUMMARY.md](SOLUTION_SUMMARY.md) - Quick reference

---

## Final Check Before Going Live

- [ ] All tests passing
- [ ] No console errors
- [ ] Styles working correctly
- [ ] API endpoints responding
- [ ] Database connection working
- [ ] Error logs clean
- [ ] Performance acceptable

**If all checked: You're LIVE! 🎉**

---

**Last Updated**: March 19, 2026  
**Next.js Version**: 16.1.6  
**Build Status**: Production Ready ✅
