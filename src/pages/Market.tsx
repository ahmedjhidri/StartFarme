import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { t } from '../utils/i18n';
import { ShoppingBag, TrendingUp, Search, Filter } from 'lucide-react';
import type { MarketPrice, Listing } from '../types';

// Mock market data
const mockPrices: MarketPrice[] = [
  {
    product: 'Olives',
    productAr: 'الزيتون',
    category: 'olives',
    unit: 'kg',
    prices: [
      {
        market: 'Tunis Wholesale',
        priceMin: 8,
        priceMax: 12,
        priceAvg: 10,
        date: new Date(),
      },
    ],
    priceHistory: [],
  },
  {
    product: 'Wheat',
    productAr: 'القمح',
    category: 'grains',
    unit: 'kg',
    prices: [
      {
        market: 'Tunis Wholesale',
        priceMin: 1.2,
        priceMax: 1.5,
        priceAvg: 1.35,
        date: new Date(),
      },
    ],
    priceHistory: [],
  },
];

const mockListings: Listing[] = [
  {
    id: '1',
    farmerId: '1',
    product: 'Olives',
    quantity: 500,
    unit: 'kg',
    pricePerUnit: 10,
    negotiable: true,
    location: 'Tunis',
    harvestDate: new Date('2024-11-20'),
    quality: 'grade-a',
    photos: [],
    description: 'Fresh organic olives',
    status: 'available',
  },
];

export const Market = () => {
  const { language } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'prices' | 'marketplace'>('prices');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {t('market', language)}
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('prices')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'prices'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('marketPrices', language)}
          </button>
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'marketplace'
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('marketplace', language)}
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'ابحث عن منتج...' : 'Rechercher un produit...'}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <span>{t('filter', language)}</span>
          </button>
        </div>

        {/* Prices Tab */}
        {activeTab === 'prices' && (
          <div className="space-y-4">
            {mockPrices.map((price, index) => (
              <div key={index} className="card">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {language === 'ar' ? price.productAr : price.product}
                    </h3>
                    <p className="text-sm text-gray-600">{price.category}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {price.prices.map((marketPrice, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">{marketPrice.market}</p>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-primary">
                          {marketPrice.priceAvg} TND / {price.unit}
                        </p>
                        <p className="text-sm text-gray-600">
                          {language === 'ar' ? 'الحد الأدنى:' : 'Min:'} {marketPrice.priceMin} TND
                        </p>
                        <p className="text-sm text-gray-600">
                          {language === 'ar' ? 'الحد الأقصى:' : 'Max:'} {marketPrice.priceMax} TND
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockListings.map((listing) => (
              <div key={listing.id} className="card hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {listing.product}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{listing.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                      {listing.pricePerUnit} TND / {listing.unit}
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      {listing.quality}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'الكمية:' : 'Quantité:'} {listing.quantity} {listing.unit}
                  </p>
                  <p className="text-sm text-gray-600">
                    {language === 'ar' ? 'تاريخ الحصاد:' : 'Date de récolte:'} {' '}
                    {listing.harvestDate.toLocaleDateString(language === 'ar' ? 'ar-TN' : 'fr-FR')}
                  </p>
                </div>

                <button className="w-full btn-primary">
                  {language === 'ar' ? 'عرض التفاصيل' : 'Voir les détails'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

