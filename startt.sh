#!/bin/bash

echo "🚀 Starting YouApp Fullstack Application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create necessary directories
mkdir -p backend/src
mkdir -p backend/test

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env file from .env.example"
fi

# Build and start all services
echo "🏗️ Building and starting services..."
docker-compose up --build -d

echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
docker-compose ps

echo "✅ YouApp is now running!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001"
echo "📚 API Documentation: http://localhost:3001/api/docs"
echo "🗄️ MongoDB Admin: http://localhost:8081"
echo "🐰 RabbitMQ Management: http://localhost:15672 (admin/password)"
echo ""
echo "To stop the application, run: docker-compose down"
