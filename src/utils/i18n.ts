// Translation keys
export const translations = {
  ar: {
    // Navigation
    home: 'الرئيسية',
    weather: 'الطقس',
    crops: 'المحاصيل',
    market: 'السوق',
    forum: 'المنتدى',
    profile: 'الملف الشخصي',
    
    // Auth
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    phoneNumber: 'رقم الهاتف',
    enterPhone: 'أدخل رقم هاتفك',
    sendOtp: 'إرسال رمز التحقق',
    verifyOtp: 'تحقق من الرمز',
    otpCode: 'رمز التحقق',
    
    // Common
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    search: 'بحث',
    filter: 'تصفية',
    loading: 'جاري التحميل...',
    
    // Weather
    currentWeather: 'الطقس الحالي',
    forecast: 'التنبؤ',
    alerts: 'التنبيهات',
    temperature: 'درجة الحرارة',
    humidity: 'الرطوبة',
    rainfall: 'الأمطار',
    windSpeed: 'سرعة الرياح',
    
    // Crops
    myCrops: 'محاصيلي',
    addCrop: 'إضافة محصول',
    cropName: 'اسم المحصول',
    plantingDate: 'تاريخ الزراعة',
    harvestDate: 'تاريخ الحصاد',
    fieldSize: 'حجم الحقل',
    
    // Market
    marketPrices: 'أسعار السوق',
    marketplace: 'السوق',
    listProduct: 'إدراج منتج',
    price: 'السعر',
    quantity: 'الكمية',
    location: 'الموقع',
  },
  fr: {
    // Navigation
    home: 'Accueil',
    weather: 'Météo',
    crops: 'Cultures',
    market: 'Marché',
    forum: 'Forum',
    profile: 'Profil',
    
    // Auth
    login: 'Connexion',
    logout: 'Déconnexion',
    phoneNumber: 'Numéro de téléphone',
    enterPhone: 'Entrez votre numéro de téléphone',
    sendOtp: 'Envoyer le code',
    verifyOtp: 'Vérifier le code',
    otpCode: 'Code de vérification',
    
    // Common
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    search: 'Rechercher',
    filter: 'Filtrer',
    loading: 'Chargement...',
    
    // Weather
    currentWeather: 'Météo actuelle',
    forecast: 'Prévisions',
    alerts: 'Alertes',
    temperature: 'Température',
    humidity: 'Humidité',
    rainfall: 'Pluie',
    windSpeed: 'Vitesse du vent',
    
    // Crops
    myCrops: 'Mes cultures',
    addCrop: 'Ajouter une culture',
    cropName: 'Nom de la culture',
    plantingDate: 'Date de plantation',
    harvestDate: 'Date de récolte',
    fieldSize: 'Taille du champ',
    
    // Market
    marketPrices: 'Prix du marché',
    marketplace: 'Marché',
    listProduct: 'Liste un produit',
    price: 'Prix',
    quantity: 'Quantité',
    location: 'Emplacement',
  },
};

export type TranslationKey = keyof typeof translations.ar;

export const t = (key: TranslationKey, lang: 'ar' | 'fr' = 'ar'): string => {
  return translations[lang][key] || key;
};

