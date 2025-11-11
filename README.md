# StartFarme - AgriTech Platform for Tunisian Farmers

A comprehensive mobile-first web application for Tunisian small farmers, addressing critical agricultural challenges including drought, lack of resources, and limited market access.

## Features

### Core Features (MVP)

1. **Authentication & User Management**
   - SMS-based OTP verification
   - Multi-language support (Arabic RTL + French)
   - User profiles with farm information

2. **Weather Dashboard & Alerts**
   - Hyper-local weather based on coordinates
   - 7-day forecast
   - Critical alerts (frost, drought warnings)

3. **Crop Management & Calendar**
   - Crop library for Tunisia
   - Region-specific planting calendars
   - Task reminders and growth tracking

4. **Smart Irrigation Calculator**
   - Precise water amount calculations
   - Weather-based recommendations
   - Water consumption tracking

5. **Market Prices & Marketplace**
   - Real-time market prices
   - Price history charts
   - Farmer marketplace for product listings
   - Buyer-farmer messaging

6. **Pest & Disease Detection** (Coming Soon)
   - AI-powered image recognition
   - Treatment recommendations
   - Expert verification

7. **Community Forum & Expert Q&A**
   - Category-based forums
   - Expert badges
   - Upvote/downvote system

8. **Financial Services Integration** (Coming Soon)
   - Micro-insurance marketplace
   - Micro-loan connector
   - Payment integration

9. **Input Marketplace** (Coming Soon)
   - Seeds, fertilizer, equipment
   - Order tracking
   - Delivery coordination

10. **Analytics Dashboard** (Coming Soon)
    - Revenue tracking
    - Expense tracking
    - Yield comparison
    - Profitability analysis

## Tech Stack

### Frontend
- **Framework**: React 18+ with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand
- **Routing**: React Router
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Maps**: Leaflet (planned)

### Backend (To be implemented)
- Node.js + Express OR Python + FastAPI
- PostgreSQL + Redis
- AWS S3 or Cloudinary
- JWT authentication
- Tunisian SMS provider integration
- Weather API integration

## Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd startfarme

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
startfarme/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── store/          # Zustand state management
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript types
│   ├── hooks/          # Custom React hooks
│   ├── assets/         # Static assets
│   └── styles/         # Global styles
├── public/             # Public assets
├── docs/               # Documentation
└── README.md
```

## Development

### Adding a New Feature

1. Create types in `src/types/index.ts`
2. Create components in `src/components/`
3. Create pages in `src/pages/`
4. Add routes in `src/App.tsx`
5. Update translations in `src/utils/i18n.ts`

### Language Support

The application supports Arabic (RTL) and French. Translations are managed in `src/utils/i18n.ts`.

### Styling

- Uses Tailwind CSS for styling
- Custom colors defined in `tailwind.config.js`
- RTL support automatically handled based on language

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SMS_API_KEY=your_sms_api_key
VITE_WEATHER_API_KEY=your_weather_api_key
```

## Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### PWA Setup

The application is set up as a Progressive Web App (PWA) for offline functionality and installability.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Contact

For questions or support, please contact the development team.
