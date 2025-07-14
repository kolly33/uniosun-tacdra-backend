#!/bin/bash
# Render build script for UNIOSUN TACDRA Backend
# This script builds the NestJS application for production deployment

set -o errexit  # Exit on any error
set -o nounset  # Exit on undefined variables
set -o pipefail # Exit on pipe failures

echo "🚀 Starting Render deployment build for UNIOSUN TACDRA..."

# Print environment info
echo "📊 Environment Information:"
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "NODE_ENV: ${NODE_ENV:-development}"
echo "Build time: $(date)"
echo "Working directory: $(pwd)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in current directory"
    exit 1
fi

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/
rm -rf node_modules/.cache/ 2>/dev/null || true

# Install dependencies
echo "📦 Installing dependencies..."
npm ci
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Build the application
echo "🔨 Building NestJS application..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed during compilation"
    exit 1
fi

# Verify build output
if [ -d "dist" ]; then
    echo "✅ Build successful - dist directory created"
    echo "📁 Build contents:"
    ls -la dist/ | head -20  # Show first 20 files to avoid overwhelming output
    if [ $(find dist -type f | wc -l) -gt 20 ]; then
        echo "... and $(($(find dist -type f | wc -l) - 20)) more files"
    fi
else
    echo "❌ Build failed - dist directory not found"
    exit 1
fi

# Create uploads directory with proper permissions
echo "📁 Setting up uploads directory..."
mkdir -p uploads
chmod 755 uploads
echo "Ready for file uploads - $(date)" > uploads/.gitkeep

# Create logs directory for production
echo "📁 Setting up logs directory..."
mkdir -p logs
chmod 755 logs
echo "Ready for application logs - $(date)" > logs/.gitkeep

# Verify critical files
echo "🔍 Verifying critical files..."
critical_files=("dist/main.js" "package.json")
for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file found"
    else
        echo "❌ Critical file missing: $file"
        exit 1
    fi
done

# Check for TypeScript compilation issues
if [ -f "dist/main.js" ]; then
    file_size=$(stat -f%z "dist/main.js" 2>/dev/null || stat -c%s "dist/main.js" 2>/dev/null || echo "0")
    if [ "$file_size" -lt 1000 ]; then
        echo "⚠️  Warning: main.js seems unusually small ($file_size bytes)"
    fi
fi

# Print final status
echo "📊 Final Build Summary:"
echo "Total files in dist: $(find dist -type f | wc -l)"
echo "Total directories in dist: $(find dist -type d | wc -l)"
echo "Upload directory: $(ls -la uploads/ 2>/dev/null || echo 'Created')"
echo "Build size: $(du -sh dist/ 2>/dev/null || echo 'Unknown')"
echo "Available disk space: $(df -h . | tail -1 | awk '{print $4}' 2>/dev/null || echo 'Unknown')"

# Final validation
echo "🔍 Final validation..."
if [ -f "dist/main.js" ] && [ -d "uploads" ] && [ -f "package.json" ]; then
    echo "✅ Build completed successfully! Ready for production deployment."
    echo "🚀 Application is ready to start with: npm run start:prod"
else
    echo "❌ Build validation failed"
    exit 1
fi
