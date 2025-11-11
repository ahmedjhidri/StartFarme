# StartFarme Backend - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up PostgreSQL Database

```bash
# Create database
createdb startfarme

# Or using PostgreSQL client
psql -U postgres
CREATE DATABASE startfarme;
```

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/startfarme?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
REDIS_URL="redis://localhost:6379"
```

### 4. Set Up Database Schema

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 5. Start Redis

```bash
# macOS
brew services start redis

# Linux
sudo systemctl start redis

# Or Docker
docker run -d -p 6379:6379 redis
```

### 6. Start the Server

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Database Setup

### Using Docker (Recommended)

```bash
# Start PostgreSQL
docker run -d \
  --name startfarme-postgres \
  -e POSTGRES_USER=startfarme \
  -e POSTGRES_PASSWORD=startfarme \
  -e POSTGRES_DB=startfarme \
  -p 5432:5432 \
  postgres:15

# Start Redis
docker run -d \
  --name startfarme-redis \
  -p 6379:6379 \
  redis:7
```

### Manual Setup

1. Install PostgreSQL: https://www.postgresql.org/download/
2. Install Redis: https://redis.io/download/
3. Create database: `createdb startfarme`
4. Update `.env` with your credentials

## API Testing

### Using cURL

```bash
# Health check
curl http://localhost:3000/health

# Send OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+21612345678"}'

# Verify OTP
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+21612345678", "code": "123456"}'
```

### Using Postman

1. Import the API collection (when available)
2. Set base URL: `http://localhost:3000`
3. Test endpoints

## Troubleshooting

### Database Connection Error

```bash
# Check if PostgreSQL is running
pg_isready

# Check connection
psql -U postgres -d startfarme
```

### Redis Connection Error

```bash
# Check if Redis is running
redis-cli ping

# Should return: PONG
```

### Port Already in Use

```bash
# Change port in .env
PORT=3001
```

### Migration Errors

```bash
# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Or manually drop and recreate
dropdb startfarme
createdb startfarme
npm run prisma:migrate
```

## Next Steps

1. ✅ Backend is set up and running
2. ⏭️ Connect frontend to backend
3. ⏭️ Set `MOCK_MODE = false` in frontend
4. ⏭️ Test all endpoints
5. ⏭️ Deploy to production

## Support

For issues, check:
- Backend logs
- Database logs
- Redis logs
- Network connectivity

