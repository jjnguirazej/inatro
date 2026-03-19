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


```apache
<IfModule mod_mime.c>
  AddType application/javascript .js .mjs
  AddType text/css .css
  AddType font/woff2 .woff2
  AddType image/svg+xml .svg
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\.(js|mjs)$">
    Header set Content-Type "application/javascript; charset=utf-8"
  </FilesMatch>
  <FilesMatch "\.(css)$">
    Header set Content-Type "text/css; charset=utf-8"
  </FilesMatch>
  Header set X-Content-Type-Options "nosniff"
</IfModule>
```

**This forces Apache to serve JS/CSS with correct MIME types.**

---

### Step 3: Upload Build Files to Hostinger

**Via Hostinger File Manager or FTP**, upload these to `public_html/`:

```
public_html/
├── .htaccess          ← MUST BE HERE (uploaded in Step 2)
├── .next/             ← ENTIRE FOLDER from your local build
│   ├── BUILD_ID
│   ├── server/
│   └── static/
│       ├── chunks/    ← Contains turbopack-*.js (this is CORRECT)
│       └── media/
├── node_modules/      ← Can upload OR run npm install on server
├── public/
│   └── .htaccess      ← This one is auto-included
├── package.json
├── package-lock.json
└── next.config.ts
```

**IMPORTANT**: The `.next/static/chunks/` folder MUST contain:
- `turbopack-*.js` files (this is normal for Next.js 16)
- `*.css` files
- Other chunk files

---

### Step 4: Verify Files on Server

**In Hostinger File Manager**, navigate and verify:

✅ `public_html/.htaccess` exists  
✅ `public_html/.next/static/chunks/turbopack-9d09cf0e3b4864df.js` exists  
✅ `public_html/.next/static/chunks/*.css` files exist  
✅ `public_html/.next/BUILD_ID` exists

---

### Step 5: Configure Node.js on Hostinger

1. Go to **Hostinger Control Panel** → **Advanced** → **Node.js**
2. Set **Node.js Version**: `20.x` or `22.x`
3. Set **Application root**: `public_html` (or your app folder)
4. Set **Application startup file**: `node_modules/next/dist/bin/next`
5. Set **Application mode**: `start` (NOT `dev`)
6. **Environment Variables** → Add:
   ```
   NODE_ENV=production
   ```
7. Click **"Restart Application"**

---

### Step 6: Clear All Caches & Test

1. **Restart Node.js app** in Hostinger panel
2. **Hard refresh browser**: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
3. **Open DevTools** → Console tab
4. **Check for errors**

**What you should see**:
- ✅ No 404 errors
- ✅ No MIME type errors
- ✅ Styles load correctly
- ✅ JS executes without errors

---

## 🔍 Verification Tests

### Test 1: Check .htaccess Works

Visit in browser:
```
https://inatro-sofala.com/_next/static/chunks/turbopack-9d09cf0e3b4864df.js
```

**Expected**: JavaScript code displays (not 404, not "text/plain")  
**DevTools → Network**: `Content-Type: application/javascript`

### Test 2: Check CSS File

Visit:
```
https://inatro-sofala.com/_next/static/chunks/[your-css-file].css
```

**Expected**: CSS code displays  
**DevTools → Network**: `Content-Type: text/css`

### Test 3: Main Page

Visit:
```
https://inatro-sofala.com/login
```

**DevTools → Console**: Should show NO errors  
**DevTools → Network**: All files load with 200 status

---

## 🐛 Troubleshooting

### Still Getting "404 Not Found"?

**Cause**: Files not uploaded or wrong location

**Fix**:
1. Check `.next` folder exists in `public_html/`
2. Verify path: `public_html/.next/static/chunks/`
3. Re-upload entire `.next` folder

---

### Still Getting "MIME type 'text/plain'"?

**Cause**: `.htaccess` not working

**Fix**:
1. **Verify `.htaccess` is in root**: `public_html/.htaccess`
2. **Check file content** - should contain `AddType` directives
3. **Contact Hostinger Support** - Ask them to enable:
   - `mod_mime`
   - `mod_headers`
   - `AllowOverride All`

---

### Apache Modules Not Enabled?

**Hostinger usually has these enabled**, but if not:

**Contact Hostinger Support** and request:
```
Please enable these Apache modules:
- mod_mime
- mod_headers  
- mod_rewrite
And set AllowOverride to All for my public_html directory
```

---

## 📋 Quick Checklist

Before contacting support, verify:

- [ ] `.htaccess` file exists in `public_html/` root
- [ ] `.next/static/chunks/` folder exists with JS/CSS files
- [ ] Tried hard refresh (Ctrl+Shift+R)
- [ ] Node.js app restarted in Hostinger panel
- [ ] `NODE_ENV=production` environment variable is set
- [ ] Node.js version is 20.x or 22.x
- [ ] Application startup file is `node_modules/next/dist/bin/next`

---

## ✅ Summary of Changes

1. **`.htaccess` created** - Forces correct MIME types for Apache
2. **Turbopack is CORRECT** - Next.js 16 uses it by default (not an error)
3. **Build updated** - Generates proper production bundle
4. **Documentation added** - Complete deployment guide

---

## 🚀 Next Steps

1. Upload `.htaccess` to Hostinger root ← **MOST CRITICAL**
2. Upload entire `.next` folder
3. Restart Node.js application
4. Hard refresh browser
5. Check DevTools Console for errors

**If all steps followed correctly**, your app will work! 🎉

---

**Files Created/Updated**:
- `.htaccess` (root) - Upload to Hostinger
- `public/.htaccess` - Already configured
- `HOSTINGER_DEPLOY.md` - Full deployment guide
- This file - MIME type fix guide
