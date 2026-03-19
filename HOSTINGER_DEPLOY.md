# Hostinger Deployment Guide for Next.js 16 + Turbopack

## 🚀 Quick Deploy Steps

### 1. Clean Build (Fix Cache Corruption)
```bash
# Run this FIRST to fix .next cache issues
npm run deploy:hostinger
```

This command:
- Removes corrupted `.next` cache
- Cleans `node_modules/.cache`
- Reinstalls dependencies
- Builds fresh production bundle

### 2. Upload to Hostinger

Upload these files/folders via File Manager or FTP:
```
├── .next/              (entire folder)
├── public/             (if you have static files)
├── node_modules/       (entire folder)
├── package.json
├── package-lock.json
├── next.config.ts
└── .env.production     (if you have environment variables)
```

### 3. Configure Node.js on Hostinger

1. Go to **Advanced → Node.js Selector**
2. Select **Node.js 20.x or higher**
3. Set **Application root**: `/public_html` (or your app folder)
4. Set **Application URL**: your domain
5. Set **Application startup file**: `node_modules/next/dist/bin/next`
6. Add **Environment variable**:
   - Name: `NODE_ENV`
   - Value: `production`

### 4. Start the Application

In Hostinger's Node.js settings:
- Click **"Run NPM Install"** (if needed)
- Click **"Start Application"**
- Click **"Restart Application"** to ensure latest build is loaded

---

## 🔧 Fixing Common Issues

### Issue 1: CSS Variables Not Loading
**Symptoms**: Styles work in dev but not in production

**Solution**: 
- ✅ Already fixed in `globals.css` (removed `@theme inline`)
- ✅ CSS variables now in `:root` (compatible with Tailwind v4)
- ✅ Inline styles added to `layout.tsx` for critical rendering

### Issue 2: Cache Corruption Errors
**Symptoms**: 
```
Unable to open static sorted file 00000040.meta
No such file or directory (os error 2)
Persisting failed: Another write batch is already active
```

**Solution**:
```bash
# Before EVERY build on Hostinger:
npm run clean:full

# Or full deploy command:
npm run deploy:hostinger
```

### Issue 3: Old Styles Being Served
**Symptoms**: Changes don't appear after deployment

**Solution**:
1. Clear `.next` folder before build
2. Generate unique build IDs (already configured in `next.config.ts`)
3. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
4. Restart Node.js app in Hostinger panel

---

## 📋 Manual Build Steps (Alternative)

If `npm run deploy:hostinger` fails, run these commands individually:

```bash
# 1. Clean everything
rm -rf .next
rm -rf node_modules/.cache

# 2. Install dependencies
npm install

# 3. Build for production
npm run build

# 4. Verify build succeeded
cat .next/BUILD_ID
```

Expected output: `build-[timestamp]`

---

## 🛠️ Package.json Scripts Reference

```json
"clean": "rm -rf .next"                          // Remove .next cache
"clean:full": "rm -rf .next node_modules/.cache" // Deep clean
"prebuild": "npm run clean"                      // Auto-clean before build
"deploy:hostinger": "npm run clean:full && npm install && npm run build"
```

---

## ⚡ Performance Tips

1. **Disable Turbopack in Production** (if issues persist):
   ```bash
   # In package.json, change:
   "build": "NODE_ENV=production next build"
   ```

2. **Verify Build Output**:
   ```bash
   npm run build
   # Should show:
   # ✓ Compiled successfully
   # ✓ Linting and checking validity of types
   # ✓ Collecting page data
   # ✓ Generating static pages
   ```

3. **Check Build Size**:
   ```bash
   du -sh .next/
   # Should be reasonable (typically 20-100MB)
   ```

---

## 🔍 Troubleshooting Checklist

- [ ] Ran `npm run clean:full` before build
- [ ] Build completed without errors
- [ ] `.next` folder exists and contains `BUILD_ID`
- [ ] Node.js version on Hostinger is 20.x+
- [ ] Environment variable `NODE_ENV=production` is set
- [ ] Application restarted in Hostinger panel
- [ ] Browser cache cleared (hard refresh)

---

## 📞 Need Help?

If issues persist:
1. Check Hostinger error logs in Node.js panel
2. Run `npm run build` locally and check for errors
3. Verify all dependencies are in `package.json` (not devDependencies)
4. Ensure MongoDB connection string is correct in production

---

## 🎯 Tailwind v4 + Next.js 16 Notes

- ✅ `@theme inline` removed (not compatible with production builds)
- ✅ CSS variables defined directly in `:root`
- ✅ Critical styles inlined in `layout.tsx` for faster rendering
- ✅ Tailwind v4 uses `@import "tailwindcss"` (no config file needed)
- ✅ PostCSS configured with `@tailwindcss/postcss`

---

**Last Updated**: March 19, 2026  
**Next.js Version**: 16.1.6  
**Tailwind Version**: 4.x
