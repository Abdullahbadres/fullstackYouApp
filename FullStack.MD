# 🚀 YouApp - Complete Fullstack Application

A modern dating/social media application built with **NestJS**, **MongoDB**, **Next.js**, **Docker**, **RabbitMQ**, and **Socket.io**.

## 🏗️ Architecture Overview

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│   (MongoDB)     │
│   Port: 3000    │    │   Port: 3001    │    │   Port: 27017   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐    ┌─────────────────┐
         │              │   Message Queue │    │   Cache         │
         └──────────────►│   (RabbitMQ)    │    │   (Redis)       │
                        │   Port: 5672    │    │   Port: 6379    │
                        └─────────────────┘    └─────────────────┘
\`\`\`

## ✨ Features Implemented

### 🔐 **Authentication & Authorization**
- JWT-based authentication
- Password hashing with bcrypt
- Protected routes and guards
- User registration and login

### 👤 **User Management**
- User profiles with personal information
- Automatic zodiac and horoscope calculation
- Profile image upload support
- Interest management system

### 💬 **Real-time Chat** (Ready for implementation)
- Socket.io integration
- RabbitMQ message queuing
- Real-time notifications
- Message persistence

### 🛠️ **Technical Features**
- **Docker containerization** for all services
- **MongoDB** with Mongoose ODM
- **Redis** caching layer
- **DTO validation** with class-validator
- **Swagger API documentation**
- **Unit testing** setup with Jest
- **Microservices architecture** ready

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### 1. Clone and Setup
\`\`\`bash
git clone <your-repo>
cd youapp
chmod +x start.sh
./start.sh
\`\`\`

### 2. Manual Setup (Alternative)
\`\`\`bash
# Copy environment file
cp .env.example .env

# Start all services
docker-compose up --build -d

# Check services
docker-compose ps
\`\`\`

### 3. Access Applications
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api/docs
- **MongoDB Admin**: http://localhost:8081
- **RabbitMQ Management**: http://localhost:15672

## 📊 Service Details

### Frontend (Next.js)
- **Port**: 3000
- **Features**: Login, Register, Profile Management, Interest System
- **API Integration**: Supports both mock and real backend
- **Responsive**: Mobile-first design

### Backend (NestJS)
- **Port**: 3001
- **Modules**: Auth, Users, Profiles, Chat (ready), Notifications (ready)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with Passport
- **Validation**: Class-validator DTOs
- **Documentation**: Swagger/OpenAPI

### Database (MongoDB)
- **Port**: 27017
- **Collections**: users, profiles, chats, messages
- **Indexes**: Optimized for performance
- **Admin UI**: MongoDB Express on port 8081

### Message Queue (RabbitMQ)
- **Port**: 5672 (AMQP), 15672 (Management)
- **Purpose**: Chat message queuing and notifications
- **Credentials**: admin/password

### Cache (Redis)
- **Port**: 6379
- **Purpose**: Session caching, temporary data
- **Integration**: NestJS Cache Manager

## 🧪 Testing

### Backend Unit Tests
\`\`\`bash
cd backend
npm test
npm run test:watch
npm run test:cov
\`\`\`

### API Testing
\`\`\`bash
# Health check
curl http://localhost:3001/api/health

# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"Test123!"}'

# Login user
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"test@example.com","password":"Test123!"}'
\`\`\`

## 📁 Project Structure

\`\`\`
youapp/
├── src/                          # Frontend (Next.js)
│   ├── app/                      # App Router pages
│   ├── components/               # React components
│   ├── contexts/                 # React contexts
│   └── api/                      # API service layer
├── backend/                      # Backend (NestJS)
│   ├── src/
│   │   ├── auth/                 # Authentication module
│   │   ├── users/                # Users module
│   │   ├── profiles/             # Profiles module
│   │   ├── chat/                 # Chat module (ready)
│   │   └── notifications/        # Notifications module (ready)
│   ├── test/                     # Unit tests
│   └── scripts/                  # Database scripts
├── docker-compose.yml            # Docker services
├── Dockerfile.frontend           # Frontend container
└── start.sh                     # Startup script
\`\`\`

## 🔧 Development

### Local Development
\`\`\`bash
# Frontend
npm run dev

# Backend
cd backend
npm run start:dev

# Database (Docker)
docker-compose up mongodb redis rabbitmq -d
\`\`\`

### Environment Variables
\`\`\`env
# Frontend
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_USE_MOCK_API=false

# Backend
MONGODB_URI=mongodb://admin:password@localhost:27017/youapp?authSource=admin
JWT_SECRET=your-secret-key
RABBITMQ_URL=amqp://admin:password@localhost:5672
REDIS_URL=redis://localhost:6379
\`\`\`

## 🚀 Deployment

### Production Build
\`\`\`bash
# Build all services
docker-compose -f docker-compose.prod.yml up --build -d

# Or build individually
docker build -f Dockerfile.frontend -t youapp-frontend .
docker build -f backend/Dockerfile -t youapp-backend ./backend
\`\`\`

### Environment Setup
1. Update `.env` with production values
2. Change JWT_SECRET to a secure random string
3. Update database credentials
4. Configure proper CORS origins

## 🧩 Next Steps

### Chat System Implementation
1. **Socket.io Gateway**: Real-time messaging
2. **RabbitMQ Integration**: Message queuing
3. **Chat Rooms**: User-to-user conversations
4. **Message Persistence**: MongoDB storage
5. **Push Notifications**: Real-time alerts

### Additional Features
1. **File Upload**: Profile images, chat media
2. **Search & Matching**: User discovery
3. **Admin Panel**: User management
4. **Analytics**: Usage tracking
5. **Mobile App**: React Native

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 API Documentation

Visit http://localhost:3001/api/docs for complete API documentation with Swagger UI.

### Key Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/profiles` - Get user profile
- `POST /api/profiles` - Create profile
- `PUT /api/profiles` - Update profile

## 🔍 Monitoring

### Service Health
\`\`\`bash
# Check all services
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Monitor resources
docker stats
\`\`\`

### Database Monitoring
- **MongoDB Compass**: Connect to mongodb://admin:password@localhost:27017
- **MongoDB Express**: http://localhost:8081

## 🛡️ Security

- JWT tokens with expiration
- Password hashing with bcrypt
- Input validation with DTOs
- CORS configuration
- Environment variable protection
- Docker container isolation

---

**🎉 Your fullstack YouApp is now ready for development and production!**

For questions or support, please check the documentation or create an issue.
