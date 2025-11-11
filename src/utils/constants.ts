// Tunisian governorates
export const GOVERNORATES = [
  'Ariana',
  'Béja',
  'Ben Arous',
  'Bizerte',
  'Gabès',
  'Gafsa',
  'Jendouba',
  'Kairouan',
  'Kasserine',
  'Kébili',
  'Kef',
  'Mahdia',
  'Manouba',
  'Médenine',
  'Monastir',
  'Nabeul',
  'Sfax',
  'Sidi Bouzid',
  'Siliana',
  'Sousse',
  'Tataouine',
  'Tozeur',
  'Tunis',
  'Zaghouan',
];

// Common crops in Tunisia
export const CROPS = [
  { name: 'Olives', nameAr: 'الزيتون', category: 'fruits' },
  { name: 'Dates', nameAr: 'التمر', category: 'fruits' },
  { name: 'Wheat', nameAr: 'القمح', category: 'grains' },
  { name: 'Barley', nameAr: 'الشعير', category: 'grains' },
  { name: 'Tomatoes', nameAr: 'الطماطم', category: 'vegetables' },
  { name: 'Peppers', nameAr: 'الفلفل', category: 'vegetables' },
  { name: 'Citrus', nameAr: 'الحمضيات', category: 'fruits' },
  { name: 'Grapes', nameAr: 'العنب', category: 'fruits' },
  { name: 'Almonds', nameAr: 'اللوز', category: 'nuts' },
  { name: 'Pistachios', nameAr: 'الفستق', category: 'nuts' },
];

// Subscription tiers
export const SUBSCRIPTION_TIERS = {
  free: {
    price: 0,
    features: [
      '3-day weather forecast',
      'Basic market prices',
      'Community forum access',
      '5 pest detections/month',
      'Standard support',
    ],
  },
  premium: {
    price: 40, // TND/month
    features: [
      '14-day weather forecast',
      'Hourly weather alerts (SMS)',
      'Advanced irrigation schedules',
      'Unlimited pest detection',
      'Market price predictions',
      'Priority expert support',
      'Reduced marketplace commission (3% vs 5%)',
      'Analytics dashboard',
    ],
  },
};

// Crop coefficients for irrigation calculation
export const CROP_COEFFICIENTS: Record<string, number> = {
  olives: 0.65,
  dates: 0.85,
  wheat: 0.95,
  barley: 0.95,
  tomatoes: 1.15,
  peppers: 1.05,
  citrus: 0.95,
  grapes: 0.85,
  almonds: 0.75,
  pistachios: 0.75,
};

// Soil types
export const SOIL_TYPES = [
  { value: 'sandy', label: 'Sandy', labelAr: 'رملية' },
  { value: 'clay', label: 'Clay', labelAr: 'طينية' },
  { value: 'loam', label: 'Loam', labelAr: 'طميية' },
  { value: 'mixed', label: 'Mixed', labelAr: 'مختلطة' },
];

// Units
export const UNITS = {
  weight: ['kg', 'ton', 'g'],
  volume: ['liter', 'm³'],
  area: ['hectare', 'm²'],
  length: ['m', 'cm'],
};

