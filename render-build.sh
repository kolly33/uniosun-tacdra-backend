#!/bin/bash
set -e

echo "🚀 Starting Render build for UNIOSUN TACDRA..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Build with NestJS CLI directly (not npm script)
echo "🔨 Building application..."
npx nest build

# Verify build
echo "✅ Verifying build..."
if [ -f "dist/main.js" ]; then
    echo "✅ Build successful!"
    echo "📁 Build output:"
    ls -la dist/
else
    echo "❌ Build failed - main.js not found"
    exit 1
fi

# Create required directories
mkdir -p uploads logs
chmod 755 uploads logs

echo "🎉 Build completed successfully!"
