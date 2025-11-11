// User roles
export type UserRole = 'farmer' | 'buyer' | 'expert' | 'admin';

// Language options
export type Language = 'ar' | 'fr' | 'ar-fr';

// User profile structure
export interface UserProfile {
  id: string;
  role: UserRole;
  phone: string; // Primary identifier (not everyone has email)
  name: string;
  email?: string;
  language: Language;
  // Farmer-specific
  farmLocation?: {
    governorate: string;
    delegation: string;
    coordinates: { lat: number; lng: number };
  };
  farmSize?: number; // in hectares
  crops?: string[]; // ['olives', 'dates', 'wheat', etc.]
  // Buyer-specific
  businessType?: 'restaurant' | 'supermarket' | 'cooperative' | 'exporter';
  purchaseCapacity?: string;
  subscriptionTier?: 'free' | 'premium';
}

// Weather data
export interface WeatherData {
  location: string;
  current: {
    temp: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
  };
  forecast: {
    date: string;
    tempMin: number;
    tempMax: number;
    rainfall: number;
    alerts: WeatherAlert[];
  }[];
}

export interface WeatherAlert {
  type: 'frost' | 'drought' | 'heatwave' | 'storm';
  severity: 'low' | 'medium' | 'high';
  message: string;
  messageAr: string;
  actionRequired: string;
}

// Crop management
export interface Crop {
  id: string;
  name: string;
  nameAr: string;
  variety?: string;
  plantingDate: Date;
  harvestDate: Date;
  farmerId: string;
  fieldSize: number; // hectares
  status: 'planning' | 'planted' | 'growing' | 'harvesting' | 'harvested';
}

export interface CropCalendar {
  crop: string;
  region: string;
  tasks: {
    week: number;
    task: string;
    taskAr: string;
    priority: 'low' | 'medium' | 'high';
  }[];
}

// Irrigation
export interface IrrigationCalculation {
  farmerId: string;
  crop: string;
  fieldSize: number;
  soilType: 'sandy' | 'clay' | 'loam' | 'mixed';
  currentWeather: WeatherData;
  lastIrrigation: Date;
  recommendation: {
    waterNeeded: number; // liters
    timing: 'morning' | 'evening';
    urgency: 'low' | 'medium' | 'high';
    reasoning: string;
    reasoningAr: string;
  };
}

// Market prices
export interface MarketPrice {
  product: string;
  productAr: string;
  category: 'vegetables' | 'fruits' | 'grains' | 'olives' | 'dates' | 'livestock';
  unit: 'kg' | 'ton' | 'liter' | 'unit';
  prices: {
    market: string;
    priceMin: number; // TND
    priceMax: number;
    priceAvg: number;
    date: Date;
  }[];
  priceHistory: {
    date: Date;
    price: number;
  }[];
}

export interface Listing {
  id: string;
  farmerId: string;
  product: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  negotiable: boolean;
  location: string;
  harvestDate: Date;
  quality: 'grade-a' | 'grade-b' | 'organic';
  photos: string[];
  description: string;
  status: 'available' | 'reserved' | 'sold';
}

// Pest detection
export interface PestDetection {
  id: string;
  farmerId: string;
  cropAffected: string;
  image: File | string;
  detectionResult: {
    pestName: string;
    pestNameAr: string;
    confidence: number; // 0-1
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    descriptionAr: string;
    treatment: {
      organic: string[];
      chemical: string[];
      preventive: string[];
    };
    estimatedLoss: string;
  };
  expertVerified: boolean;
  timestamp: Date;
}

// Forum
export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  category: 'irrigation' | 'pests' | 'soil' | 'marketing' | 'equipment' | 'general';
  title: string;
  content: string;
  images?: string[];
  tags: string[];
  replies: Reply[];
  upvotes: number;
  expertVerified: boolean;
  createdAt: Date;
}

export interface Reply {
  id: string;
  authorId: string;
  authorName: string;
  authorType: 'farmer' | 'expert';
  content: string;
  upvotes: number;
  isAcceptedAnswer: boolean;
  createdAt: Date;
}

// Financial services
export interface MicroInsurance {
  id: string;
  farmerId: string;
  crop: string;
  coverage: number; // TND
  premium: number; // TND per season
  coverageType: 'drought' | 'frost' | 'flood' | 'pest' | 'comprehensive';
  startDate: Date;
  endDate: Date;
  status: 'active' | 'claimed' | 'expired';
}

export interface MicroLoan {
  id: string;
  farmerId: string;
  amount: number; // TND
  purpose: 'seeds' | 'fertilizer' | 'equipment' | 'irrigation' | 'other';
  interestRate: number;
  repaymentSchedule: {
    dueDate: Date;
    amount: number;
    paid: boolean;
  }[];
  status: 'pending' | 'approved' | 'active' | 'paid' | 'defaulted';
}

// Input marketplace
export interface InputProduct {
  id: string;
  supplierId: string;
  category: 'seeds' | 'fertilizer' | 'pesticide' | 'tools' | 'irrigation';
  name: string;
  nameAr: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  images: string[];
  certifications?: string[];
  suitableFor: string[];
}

export interface Order {
  id: string;
  farmerId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: 'cash' | 'mobile-wallet' | 'card';
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryDate?: Date;
}

// Analytics
export interface FarmerAnalytics {
  farmerId: string;
  period: 'month' | 'season' | 'year';
  metrics: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    cropYield: { crop: string; yield: number; unit: string }[];
    waterUsage: number; // cubic meters
    costPerHectare: number;
    profitPerCrop: { crop: string; profit: number }[];
  };
  insights: {
    bestPerformingCrop: string;
    recommendations: string[];
  };
}

