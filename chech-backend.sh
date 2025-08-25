#!/bin/bash

echo "🔍 Checking if backend is running..."

# Check if backend is responding
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo "✅ Backend is running on http://localhost:3001"
    echo "📚 API Documentation: http://localhost:3001/api/docs"
else
    echo "❌ Backend is not running!"
    echo ""
    echo "To start the backend:"
    echo "1. Make sure Docker is running"
    echo "2. Run: docker-compose up -d"
    echo "3. Or run: cd backend && npm run start:dev"
    echo ""
    echo "Check backend logs with: docker-compose logs backend"
fi

# Check if frontend environment is correct
echo ""
echo "🔧 Frontend Configuration:"
echo "NEXT_PUBLIC_API_BASE_URL: ${NEXT_PUBLIC_API_BASE_URL:-'Not set'}"
echo "NEXT_PUBLIC_USE_MOCK_API: ${NEXT_PUBLIC_USE_MOCK_API:-'Not set'}"

if [ "$NEXT_PUBLIC_USE_MOCK_API" = "true" ]; then
    echo "ℹ️  Mock API is enabled - registration will work without backend"
else
    echo "ℹ️  Real API mode - backend must be running for registration"
fi
