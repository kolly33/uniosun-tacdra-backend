#!/bin/bash
# Production Environment Setup Script for Render

echo "🚀 Setting up UNIOSUN TACDRA for production deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

echo "📦 Installing production dependencies..."
npm ci --only=production

echo "🔨 Building the application..."
npm run build

echo "📁 Setting up uploads directory..."
mkdir -p uploads
echo "Uploads directory ready" > uploads/.gitkeep

echo "🔍 Checking build output..."
if [ -d "dist" ]; then
    echo "✅ Build successful - dist folder created"
    ls -la dist/
else
    echo "❌ Build failed - dist folder not found"
    exit 1
fi

echo "🌍 Environment check..."
echo "NODE_ENV: ${NODE_ENV:-'not set'}"
echo "DATABASE_HOST: ${DATABASE_HOST:-'not set'}"
echo "JWT_SECRET: ${JWT_SECRET:+SET}"

echo "✅ Production setup completed successfully!"
echo "🚀 Ready for deployment to Render!"
