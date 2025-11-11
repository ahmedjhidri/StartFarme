// User types
export type UserRole = 'farmer' | 'buyer' | 'expert' | 'admin';
export type Language = 'ar' | 'fr' | 'ar-fr';
export type SubscriptionTier = 'free' | 'premium';

export interface UserProfile {
  id: string;
  role: UserRole;
  phone: string;
  email?: string;
  name: string;
  language: Language;
  farmLocation?: {
    governorate: string;
    delegation: string;
    coordinates: { lat: number; lng: number };
  };
  farmSize?: number; // in hectares
  crops?: string[];
  businessType?: 'restaurant' | 'supermarket' | 'cooperative' | 'exporter';
  purchaseCapacity?: string;
  subscriptionTier?: SubscriptionTier;
  createdAt?: Date;
  lastActive?: Date;
}

// Weather types
export interface WeatherData {
  location: string;
  current: {
    temp: number;
    humidity: number;
    rainfall: number;
    windSpeed: number;
    condition: string;
    conditionAr: string;
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

// Crop types
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

// Irrigation types
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

// Market types
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
  productAr: string;
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
  createdAt: Date;
}

// Pest Detection types
export interface PestDetection {
  id: string;
  farmerId: string;
  cropAffected: string;
  image: string;
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

// Forum types
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

// Order types
export interface Order {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  quantity: number;
  totalAmount: number;
  commission: number;
  paymentMethod: 'cash' | 'mobile-wallet' | 'card';
  deliveryAddress: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  deliveryDate?: Date;
}
