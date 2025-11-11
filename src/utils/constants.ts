// Tunisian Governorates
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

export const GOVERNORATES_AR = [
  'أريانة',
  'باجة',
  'بن عروس',
  'بنزرت',
  'قابس',
  'قفصة',
  'جندوبة',
  'القيروان',
  'القصرين',
  'قبلي',
  'الكاف',
  'المهدية',
  'منوبة',
  'مدنين',
  'المنستير',
  'نابل',
  'صفاقس',
  'سيدي بوزيد',
  'سليانة',
  'سوسة',
  'تطاوين',
  'توزر',
  'تونس',
  'زغوان',
];

// Common Crops in Tunisia
export const CROPS = [
  { name: 'Olives', nameAr: 'الزيتون', category: 'fruits' },
  { name: 'Dates', nameAr: 'التمر', category: 'fruits' },
  { name: 'Wheat', nameAr: 'القمح', category: 'grains' },
  { name: 'Barley', nameAr: 'الشعير', category: 'grains' },
  { name: 'Tomatoes', nameAr: 'الطماطم', category: 'vegetables' },
  { name: 'Peppers', nameAr: 'الفلفل', category: 'vegetables' },
  { name: 'Potatoes', nameAr: 'البطاطس', category: 'vegetables' },
  { name: 'Onions', nameAr: 'البصل', category: 'vegetables' },
  { name: 'Citrus', nameAr: 'الحمضيات', category: 'fruits' },
  { name: 'Almonds', nameAr: 'اللوز', category: 'fruits' },
  { name: 'Grapes', nameAr: 'العنب', category: 'fruits' },
  { name: 'Figs', nameAr: 'التين', category: 'fruits' },
];

// Subscription Tiers
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
    featuresAr: [
      'توقعات الطقس لـ 3 أيام',
      'أسعار السوق الأساسية',
      'الوصول إلى منتدى المجتمع',
      '5 كشف للآفات/شهر',
      'دعم قياسي',
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
    featuresAr: [
      'توقعات الطقس لـ 14 يوماً',
      'تنبيهات الطقس كل ساعة (SMS)',
      'جداول الري المتقدمة',
      'كشف غير محدود للآفات',
      'تنبؤات أسعار السوق',
      'دعم الخبراء ذو الأولوية',
      'عمولة سوق مخفضة (3% بدلاً من 5%)',
      'لوحة تحليل',
    ],
  },
};

// Translation helper
export const t = (key: string, lang: 'ar' | 'fr' = 'ar'): string => {
  const translations: Record<string, { ar: string; fr: string }> = {
    'app.name': { ar: 'StartFarme', fr: 'StartFarme' },
    'nav.weather': { ar: 'الطقس', fr: 'Météo' },
    'nav.crops': { ar: 'المحاصيل', fr: 'Cultures' },
    'nav.market': { ar: 'السوق', fr: 'Marché' },
    'nav.community': { ar: 'المجتمع', fr: 'Communauté' },
    'nav.profile': { ar: 'الملف الشخصي', fr: 'Profil' },
  };
  
  return translations[key]?.[lang] || key;
};
