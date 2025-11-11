# Backend Integration Guide

This guide explains how to integrate the StartFarme frontend with a backend API.

## Current Status

The application is currently running in **MOCK_MODE**, which means all API calls use mock data stored in localStorage. This allows frontend development without a backend.

## Switching to Backend Mode

### Step 1: Update API Configuration

1. Open `src/services/api.ts`
2. Change `MOCK_MODE` from `true` to `false`:
   ```typescript
   const MOCK_MODE = false;
   ```

### Step 2: Set Environment Variables

1. Create `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=https://api.startfarme.tn/api
   ```

2. Update `vite.config.ts` if needed for environment variable handling.

### Step 3: Backend API Requirements

Your backend should implement the following endpoints:

#### Authentication
- `POST /api/auth/send-otp` - Send SMS OTP
- `POST /api/auth/verify-otp` - Verify OTP and return JWT token
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update user profile

#### Weather
- `GET /api/weather/current?lat={lat}&lng={lng}` - Get current weather
- `GET /api/weather/forecast?lat={lat}&lng={lng}&days={days}` - Get forecast
- `GET /api/weather/alerts?governorate={gov}` - Get weather alerts

#### Crops
- `GET /api/crops` - Get user's crops
- `POST /api/crops` - Create new crop
- `PUT /api/crops/:id` - Update crop
- `DELETE /api/crops/:id` - Delete crop
- `GET /api/crops/calendar?crop={crop}&region={region}` - Get crop calendar

#### Market
- `GET /api/market/prices?product={product}` - Get market prices
- `GET /api/market/prices/history?product={product}&days={days}` - Get price history
- `GET /api/listings` - Get marketplace listings
- `POST /api/listings` - Create listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

#### Pest Detection
- `POST /api/pest-detection` - Upload image and detect pest
- `GET /api/pest-detection/history` - Get detection history

#### Forum
- `GET /api/forum/posts` - Get forum posts
- `POST /api/forum/posts` - Create post
- `POST /api/forum/posts/:id/replies` - Add reply
- `PUT /api/forum/posts/:id/upvote` - Upvote post

#### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `PUT /api/orders/:id/status` - Update order status

### Step 4: Authentication

The frontend expects:
- JWT tokens in `Authorization: Bearer <token>` header
- Token stored in `localStorage.getItem('auth_token')`
- 401 responses should redirect to `/login`

### Step 5: CORS Configuration

Ensure your backend allows CORS from your frontend domain:
```javascript
// Express.js example
app.use(cors({
  origin: 'https://startfarme.tn',
  credentials: true
}));
```

### Step 6: SMS OTP Service

Integrate with a Tunisian SMS provider:
- Twilio (with Tunisian number)
- Local SMS gateway
- SMS API service

### Step 7: Weather API

Integrate with:
- OpenWeatherMap API
- Tunisian National Meteorological Institute (INM) API
- Custom weather data source

### Step 8: Market Data

Connect to:
- Ministry of Agriculture data
- Wholesale market APIs
- Scraped data from market websites
- Partner market data feeds

### Step 9: File Upload

For pest detection images:
- Use AWS S3, Cloudinary, or similar
- Implement image processing
- Store image URLs in database

### Step 10: Testing

1. Test all API endpoints
2. Verify authentication flow
3. Test error handling
4. Verify CORS configuration
5. Test file uploads
6. Test offline functionality (PWA)

## API Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

### Authentication Response
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "role": "farmer",
    "phone": "+216123456789",
    "name": "Ahmed Ben Ali",
    ...
  }
}
```

## Security Considerations

1. **HTTPS Only** - Always use HTTPS in production
2. **JWT Expiration** - Set appropriate token expiration
3. **Rate Limiting** - Implement rate limiting on API endpoints
4. **Input Validation** - Validate all inputs on backend
5. **SQL Injection** - Use parameterized queries
6. **XSS Protection** - Sanitize user inputs
7. **CSRF Protection** - Implement CSRF tokens
8. **File Upload Security** - Validate file types and sizes

## Deployment

1. Build frontend: `npm run build`
2. Deploy backend API
3. Update environment variables
4. Test all features
5. Monitor error logs
6. Set up analytics

## Support

For backend integration questions, refer to:
- API documentation
- Backend repository
- Team communication channel

