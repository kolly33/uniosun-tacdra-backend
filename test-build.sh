#!/bin/bash
# Test script to validate the build process locally before deploying to Render

echo "🧪 Testing UNIOSUN TACDRA build process locally..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Backup existing dist and uploads if they exist
if [ -d "dist" ]; then
    echo "📦 Backing up existing dist directory..."
    mv dist dist.backup.$(date +%s)
fi

if [ -d "uploads" ]; then
    echo "📦 Backing up existing uploads directory..."
    mv uploads uploads.backup.$(date +%s)
fi

# Run the build script
echo "🚀 Running build script..."
if [ -f "render-build.sh" ]; then
    chmod +x render-build.sh
    ./render-build.sh
    build_result=$?
else
    echo "❌ render-build.sh not found"
    exit 1
fi

# Test the built application
if [ $build_result -eq 0 ]; then
    echo "🧪 Testing the built application..."
    
    # Test if the application starts
    echo "🔍 Testing if the application can start..."
    timeout 10s npm run start:prod &
    start_pid=$!
    sleep 5
    
    if kill -0 $start_pid 2>/dev/null; then
        echo "✅ Application started successfully"
        kill $start_pid 2>/dev/null
        wait $start_pid 2>/dev/null
    else
        echo "❌ Application failed to start"
        exit 1
    fi
    
    echo "✅ Build test completed successfully!"
    echo "🚀 Your application is ready for Render deployment!"
else
    echo "❌ Build script failed"
    exit 1
fi
