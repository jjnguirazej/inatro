#!/bin/bash
# Hostinger Deploy Script for Next.js 16 + Turbopack
# This script ensures a clean build without cache corruption

set -e  # Exit on error

echo "🚀 Starting Hostinger Deployment Process..."
echo ""

# Step 1: Clean corrupted cache
echo "📦 Step 1/4: Cleaning .next cache and node_modules cache..."
rm -rf .next
rm -rf node_modules/.cache
echo "✓ Cache cleaned"
echo ""

# Step 2: Install dependencies
echo "📦 Step 2/4: Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Step 3: Build for production
echo "🔨 Step 3/4: Building production bundle..."
npm run build
echo "✓ Build completed"
echo ""

# Step 4: Show build info
echo "📊 Step 4/4: Build Information"
echo "Build ID: $(cat .next/BUILD_ID)"
echo "Build size: $(du -sh .next | cut -f1)"
echo ""

echo "✅ Deployment package ready!"
echo ""
echo "Next steps:"
echo "1. Upload .next/ folder to Hostinger"
echo "2. Upload node_modules/ folder"
echo "3. Upload package.json and next.config.ts"
echo "4. Set NODE_ENV=production in Hostinger panel"
echo "5. Restart Node.js application"
echo ""
echo "For detailed instructions, see HOSTINGER_DEPLOY.md"
