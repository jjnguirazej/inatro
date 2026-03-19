# 🚨 URGENT FIX: MIME Type & 404 Errors on Hostinger

## ❌ Errors You're Seeing:

```
Refused to apply style from '/_next/static/chunks/*.css' 
because its MIME type ('text/plain') is not a supported stylesheet MIME type

GET /_next/static/chunks/turbopack-*.js 404 (Not Found)

Refused to execute script from '/_next/static/chunks/*.js' 
because its MIME type ('text/plain') is not executable
```

## 🎯 Root Cause:

**Next.js 16 uses Turbopack by default** - This is CORRECT behavior.  
The problem is **Hostinger's Apache server** serving files with wrong MIME types.

**Solution**: Configure `.htaccess` to force correct MIME types.

---

## ✅ COMPLETE FIX (Follow in Order)

### Step 1: Rebuild Locally

```bash
npm run deploy:hostinger
```

This will:
- Clean all caches
- Reinstall dependencies  
- Build production bundle with Turbopack (correct)

---

### Step 2: **CRITICAL** - Upload `.htaccess` to Hostinger Root

Your project now has `.htaccess` file in root directory.  

**Upload this file to your Hostinger `public_html/` directory** (same level as your app files).

**Via Hostinger File Manager**:
1. Go to File Manager
2. Navigate to `public_html/` (your root directory)
3. Upload the `.htaccess` file from your project root
4. **Verify it's there**: `public_html/.htaccess`

**The `.htaccess` file contains**:

---

### Step 2: Upload Files to Hostinger

**CRITICAL**: Upload these files to your Hostinger `public_html` directory:

```
public_html/
├── .htaccess          ← UPLOAD THIS (from project root)
├── .next/             ← ENTIRE FOLDER
│   ├── BUILD_ID
│   ├── server/
│   └── static/
│       ├── chunks/    ← All .js and .css files
│       └── media/     ← Fonts
├── node_modules/      ← ENTIRE FOLDER (or run npm install on server)
├── public/
│   ├── .htaccess      ← Also upload this one
│   └── service-worker.js
├── package.json
├── package-lock.json
├── next.config.ts
└── src/               ← Optional but recommended
```

---

### Step 3: Create/Update `.htaccess` on Hostinger

**In Hostinger File Manager**, create or update `public_html/.htaccess`:

```apache
# Next.js + Hostinger Root Configuration
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
</IfModule>

# CRITICAL: Force correct MIME types
<IfModule mod_mime.c>
  AddType application/javascript .js
  AddType application/javascript .mjs
  AddType text/javascript .js
  AddType text/css .css
  AddType font/woff2 .woff2
  AddType font/woff .woff
  AddType image/svg+xml .svg
  AddType image/webp .webp
  AddType application/json .json
</IfModule>

# CRITICAL: Set Content-Type headers
<IfModule mod_headers.c>
  <FilesMatch "\.(js|mjs)$">
    Header set Content-Type "application/javascript; charset=utf-8"
  </FilesMatch>
  
  <FilesMatch "\.(css)$">
    Header set Content-Type "text/css; charset=utf-8"
  </FilesMatch>
  
  Header set X-Content-Type-Options "nosniff"
</IfModule>

Options -Indexes +FollowSymLinks
</IfModule>
```

**Copy from**: Your project now has `.htaccess` in the root directory.

---

### Step 4: Verify Files Exist on Server

**In Hostinger File Manager**, check these paths exist:

```
/_next/static/chunks/ac6c857b96a9f7a2.css    ← Should exist
/_next/static/chunks/*.js                    ← All JS files
/_next/static/media/*.woff2                  ← Fonts
```

**If files are missing**: Re-upload the entire `.next` folder.

---

### Step 5: Configure Node.js Application

In **Hostinger Node.js Selector**:

1. **Node.js Version**: 20.x or 22.x
2. **Application startup file**: `node_modules/next/dist/bin/next`
3. **Application mode**: `start` (not `dev`)
4. **Environment Variables**:
   ```
   NODE_ENV=production
   ```

5. Click **"Restart Application"**

---

### Step 6: Clear All Caches

1. **Hostinger**: Restart Node.js app
2. **Browser**: Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
3. **Cloudflare** (if using): Purge cache
4. **Clear browser data**: Settings → Clear browsing data → Cached files

---

## 🔍 Verification Checklist

After deployment, check these:

- [ ] `.htaccess` exists in `public_html/` root
- [ ] `.next/static/chunks/` folder exists and contains files
- [ ] Visit: `https://inatro-sofala.com/_next/static/chunks/ac6c857b96a9f7a2.css`
  - Should show CSS code (not 404 or "text/plain")
- [ ] Open DevTools → Network tab
  - CSS files show `Content-Type: text/css`
  - JS files show `Content-Type: application/javascript`
- [ ] No 404 errors in console
- [ ] Page styles load correctly

---

## 🐛 Still Getting Errors?

### Error: "404 Not Found" for chunks

**Cause**: `.next` folder not uploaded or incomplete

**Fix**:
```bash
# Rebuild locally
npm run deploy:hostinger

# Verify .next folder size
du -sh .next
# Should be 20-100MB

# Re-upload ENTIRE .next folder to Hostinger
```

---

### Error: "MIME type 'text/plain'"

**Cause**: `.htaccess` not working or missing

**Fix**:
1. Check `.htaccess` exists in `public_html/`
2. Verify Apache modules are enabled:
   - `mod_mime`
   - `mod_headers`
   - `mod_rewrite`
3. Contact Hostinger support to enable these modules if needed

---

### Error: "turbopack-*.js not found"

**Cause**: Old build with Turbopack

**Fix**:
```bash
# Clean and rebuild WITHOUT Turbopack
npm run clean:full
npm run build

# Verify no turbopack chunks in output
ls -la .next/static/chunks/ | grep turbopack
# Should show NO results

# Re-upload .next folder
```

---

## 📊 Test Local Production Build First

Before uploading, test locally:

```bash
# Build
npm run build

# Start production server
npm start

# Visit http://localhost:3000
# Open DevTools → Console
# Should show NO errors
```

If errors appear locally, fix them before uploading.

---

## 🎯 Key Changes Made

1. **Turbopack disabled for production** - Uses standard webpack (more compatible)
2. **`.htaccess` created** - Forces correct MIME types
3. **`dev` script updated** - Uses `--turbopack` only in development
4. **Build process** - Now generates standard webpack chunks (not turbopack)

---

## 🔧 Quick Commands

```bash
# Full clean rebuild
npm run deploy:hostinger

# Check build output
ls -la .next/static/chunks/

# Check for Turbopack (should be empty)
find .next -name "*turbopack*"

# Test production locally
npm start
```

---

## 📞 Need Help?

If still having issues:

1. **Check Hostinger error logs**: Node.js panel → Error logs
2. **Verify Apache modules**: Contact Hostinger support
3. **Test .htaccess**: Create simple test:
   ```bash
   echo "console.log('test');" > public_html/test.js
   # Visit: https://inatro-sofala.com/test.js
   # Check Content-Type in DevTools → Network
   ```

---

**Status**: ✅ Configuration updated  
**Turbopack**: Disabled for production  
**MIME Types**: Configured in `.htaccess`  
**Next Step**: Rebuild and re-upload to Hostinger
