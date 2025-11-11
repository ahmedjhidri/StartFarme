# StartFarme - AgriTech Platform for Tunisian Farmers

A comprehensive AgriTech mobile-first web application designed to address critical agricultural challenges in Tunisia.

## Features

### Core Features (MVP)
- ✅ Phone-based authentication (SMS OTP) - Demo mode enabled
- ✅ Bilingual interface (Arabic RTL + French)
- ✅ Weather dashboard with alerts
- ✅ **Full crop management (CRUD)** - Add, edit, delete, and track crops
- ✅ **Smart irrigation calculator** - Calculate water needs based on crop, soil, and weather
- ✅ **Market prices & marketplace** - Real-time price charts and product listings
- ✅ **Pest & disease detection** - AI-powered image recognition with treatment recommendations
- ✅ **Community forum** - Post questions and interact with other farmers
- ✅ **PWA support** - Offline functionality and installable app
- ✅ User profile management

### Upcoming Features
- Financial services integration
- Input marketplace
- Analytics dashboard
- Real AI model integration for pest detection

## Tech Stack

### Frontend
- **Framework**: React 18+ with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: Zustand
- **Routing**: React Router
- **Forms**: React Hook Form + Zod
- **API Client**: Axios
- **Charts**: Recharts (for market price visualization)

## Getting Started

### Prerequisites
- Node.js 18+ (recommended: 20+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd startfarme

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:5174` (port configured in vite.config.ts)

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
startfarme/
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   ├── layout/      # Layout components
│   │   └── features/    # Feature-specific components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── stores/          # Zustand stores
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── assets/          # Static assets
├── public/              # Public assets
└── docs/                # Documentation
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Mock Mode

The application runs in **MOCK_MODE** by default, which allows frontend development without a backend. To switch to backend mode:

1. Open `src/services/api.ts`
2. Set `MOCK_MODE = false`
3. Update `VITE_API_BASE_URL` in `.env`
4. See `BACKEND_INTEGRATION.md` for detailed integration guide

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT

## Support

For support, email support@startfarme.tn or open an issue on GitHub.
