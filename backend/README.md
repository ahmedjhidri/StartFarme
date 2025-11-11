# StartFarme Backend API

Backend API server for StartFarme AgriTech platform.

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Cache**: Redis
- **Authentication**: JWT

## Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Set up database:
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Open Prisma Studio
npm run prisma:studio
```

4. Start Redis:
```bash
# macOS
brew services start redis

# Linux
sudo systemctl start redis

# Or use Docker
docker run -d -p 6379:6379 redis
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Environment Variables

See `.env.example` for all required environment variables.

### Required Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `REDIS_URL` - Redis connection URL

### Optional Variables

- `SMS_API_KEY` - SMS service API key
- `WEATHER_API_KEY` - Weather API key
- `AI_API_KEY` - AI/ML service API key
- `AWS_ACCESS_KEY_ID` - AWS S3 access key
- `AWS_SECRET_ACCESS_KEY` - AWS S3 secret key

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to phone number
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile

### Weather
- `GET /api/weather/current` - Get current weather
- `GET /api/weather/forecast` - Get weather forecast
- `GET /api/weather/alerts` - Get weather alerts

### Crops
- `GET /api/crops` - Get all crops
- `GET /api/crops/:id` - Get single crop
- `POST /api/crops` - Create crop
- `PUT /api/crops/:id` - Update crop
- `DELETE /api/crops/:id` - Delete crop
- `GET /api/crops/calendar` - Get crop calendar

### Irrigation
- `POST /api/irrigation/calculate` - Calculate irrigation needs
- `GET /api/irrigation/history` - Get irrigation history

### Market
- `GET /api/market/prices` - Get market prices
- `GET /api/market/prices/history` - Get price history
- `GET /api/market/listings` - Get listings
- `POST /api/market/listings` - Create listing
- `PUT /api/market/listings/:id` - Update listing
- `DELETE /api/market/listings/:id` - Delete listing

### Pest Detection
- `POST /api/pest-detection` - Detect pest from image
- `GET /api/pest-detection` - Get pest detection history

### Forum
- `GET /api/forum` - Get forum posts
- `GET /api/forum/:id` - Get single post
- `POST /api/forum` - Create post
- `POST /api/forum/:id/upvote` - Upvote post
- `POST /api/forum/:id/replies` - Create reply
- `POST /api/forum/:id/replies/:replyId/upvote` - Upvote reply

## Database Schema

See `prisma/schema.prisma` for the complete database schema.

## Development

### Running in Development Mode

```bash
npm run dev
```

The server will automatically reload on file changes.

### Database Migrations

```bash
# Create a new migration
npm run prisma:migrate

# Apply migrations
npm run prisma:migrate

# Reset database (WARNING: This will delete all data)
npx prisma migrate reset
```

### Prisma Studio

Open Prisma Studio to view and edit database data:

```bash
npm run prisma:studio
```

## Testing

```bash
npm test
```

## Deployment

### Build for Production

```bash
npm run build
```

### Environment Setup

1. Set all required environment variables
2. Run database migrations
3. Start Redis
4. Start the server

### Docker (Optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## API Documentation

API documentation will be available at `/api/docs` (when Swagger is integrated).

## Security

- All sensitive routes require JWT authentication
- Passwords are hashed using bcrypt
- OTP codes are stored in Redis with TTL
- CORS is enabled for specific origins
- Rate limiting can be added for sensitive endpoints

## License

MIT

