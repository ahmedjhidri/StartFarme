import React, { useState, useEffect } from 'react';
import { ShoppingCart, TrendingUp, Search, Plus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import { marketAPI } from '../services/api';
import type { MarketPrice, Listing } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Market: React.FC = () => {
  const { user, language } = useAuthStore();
  const isArabic = language === 'ar';
  
  const [activeTab, setActiveTab] = useState<'prices' | 'marketplace'>('prices');
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    loadMarketData();
  }, []);
  
  const loadMarketData = async () => {
    try {
      const [pricesData, listingsData] = await Promise.all([
        marketAPI.getPrices(),
        marketAPI.getListings(),
      ]);
      
      // If API returns empty data, use mock data for demonstration
      if (pricesData.length === 0) {
        setPrices([
          {
            product: 'Tomatoes',
            productAr: 'طماطم',
            category: 'vegetables',
            unit: 'kg',
            prices: [
              {
                market: 'Tunis Wholesale',
                priceMin: 2.5,
                priceMax: 3.5,
                priceAvg: 3.0,
                date: new Date(),
              },
            ],
            priceHistory: [
              { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), price: 2.8 },
              { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), price: 2.9 },
              { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), price: 3.1 },
              { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), price: 3.0 },
              { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), price: 2.9 },
              { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), price: 3.0 },
              { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), price: 3.2 },
              { date: new Date(), price: 3.0 },
            ],
          },
          {
            product: 'Olives',
            productAr: 'زيتون',
            category: 'olives',
            unit: 'kg',
            prices: [
              {
                market: 'Sfax Market',
                priceMin: 8.0,
                priceMax: 12.0,
                priceAvg: 10.0,
                date: new Date(),
              },
            ],
            priceHistory: [
              { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), price: 9.5 },
              { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), price: 9.8 },
              { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), price: 10.2 },
              { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), price: 10.0 },
              { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), price: 9.9 },
              { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), price: 10.1 },
              { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), price: 10.3 },
              { date: new Date(), price: 10.0 },
            ],
          },
        ]);
      } else {
        setPrices(pricesData);
      }
      
      setListings(listingsData);
    } catch (error) {
      console.error('Failed to load market data:', error);
      // Set mock data as fallback on error
      setPrices([
        {
          product: 'Tomatoes',
          productAr: 'طماطم',
          category: 'vegetables',
          unit: 'kg',
          prices: [
            {
              market: 'Tunis Wholesale',
              priceMin: 2.5,
              priceMax: 3.5,
              priceAvg: 3.0,
              date: new Date(),
            },
          ],
          priceHistory: [
            { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), price: 2.8 },
            { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), price: 2.9 },
            { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), price: 3.1 },
            { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), price: 3.0 },
            { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), price: 2.9 },
            { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), price: 3.0 },
            { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), price: 3.2 },
            { date: new Date(), price: 3.0 },
          ],
        },
        {
          product: 'Olives',
          productAr: 'زيتون',
          category: 'olives',
          unit: 'kg',
          prices: [
            {
              market: 'Sfax Market',
              priceMin: 8.0,
              priceMax: 12.0,
              priceAvg: 10.0,
              date: new Date(),
            },
          ],
          priceHistory: [
            { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), price: 9.5 },
            { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), price: 9.8 },
            { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), price: 10.2 },
            { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), price: 10.0 },
            { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), price: 9.9 },
            { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), price: 10.1 },
            { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), price: 10.3 },
            { date: new Date(), price: 10.0 },
          ],
        },
      ]);
      setListings([]);
    }
  };
  
  const filteredListings = listings.filter((listing) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        listing.product.toLowerCase().includes(query) ||
        listing.productAr.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query)
      );
    }
    return true;
  });
  
  const formatPrice = (price: number) => {
    return `${price.toFixed(2)} TND`;
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(isArabic ? 'ar-TN' : 'fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };
  
  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          {isArabic ? 'السوق' : 'Marché'}
        </h1>
        {user?.role === 'farmer' && activeTab === 'marketplace' && (
          <Button variant="primary" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            {isArabic ? 'إضافة منتج' : 'Ajouter un produit'}
          </Button>
        )}
      </div>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('prices')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'prices'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {isArabic ? 'أسعار السوق' : 'Prix du marché'}
        </button>
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'marketplace'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {isArabic ? 'السوق' : 'Marketplace'}
        </button>
      </div>
      
      {activeTab === 'prices' ? (
        <div className="space-y-4">
          {prices.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">
                  {isArabic
                    ? 'لا توجد بيانات أسعار متاحة حالياً'
                    : 'Aucune donnée de prix disponible pour le moment'}
                </p>
              </div>
            </Card>
          ) : (
            prices.map((price, index) => (
              <Card key={index}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {isArabic ? price.productAr : price.product}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {price.prices[0]?.market || 'Marché'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(price.prices[0]?.priceAvg || 0)}
                    </p>
                    <p className="text-xs text-gray-600">/{price.unit}</p>
                  </div>
                </div>
                
                {price.prices[0] && (
                  <div className="flex gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-600">
                        {isArabic ? 'أقل:' : 'Min:'}
                      </span>
                      <span className="font-medium ml-1">
                        {formatPrice(price.prices[0].priceMin)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        {isArabic ? 'أعلى:' : 'Max:'}
                      </span>
                      <span className="font-medium ml-1">
                        {formatPrice(price.prices[0].priceMax)}
                      </span>
                    </div>
                  </div>
                )}
                
                {price.priceHistory && price.priceHistory.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      {isArabic ? 'التاريخ (7 أيام)' : 'Historique (7 jours)'}
                    </p>
                    <ResponsiveContainer width="100%" height={150}>
                      <LineChart data={price.priceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickFormatter={(date) => formatDate(new Date(date))}
                          tick={{ fontSize: 10 }}
                        />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip
                          formatter={(value: number) => formatPrice(value)}
                          labelFormatter={(date) => formatDate(new Date(date))}
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#2D8B3C"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={isArabic ? 'ابحث عن منتج...' : 'Rechercher un produit...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Listings */}
          {filteredListings.length === 0 ? (
            <Card>
              <div className="text-center py-8">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {isArabic
                    ? 'لا توجد عروض متاحة حالياً'
                    : 'Aucune offre disponible pour le moment'}
                </p>
                {user?.role === 'farmer' && (
                  <Button variant="primary">
                    <Plus className="w-4 h-4 mr-2" />
                    {isArabic ? 'إنشاء عرض جديد' : 'Créer une nouvelle offre'}
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            filteredListings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  {listing.photos && listing.photos.length > 0 && (
                    <img
                      src={listing.photos[0]}
                      alt={listing.product}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {isArabic ? listing.productAr : listing.product}
                        </h3>
                        <p className="text-sm text-gray-600">{listing.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">
                          {formatPrice(listing.pricePerUnit)}
                        </p>
                        <p className="text-xs text-gray-600">/{listing.unit}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span>
                        {isArabic ? 'الكمية:' : 'Quantité:'} {listing.quantity} {listing.unit}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          listing.quality === 'organic'
                            ? 'bg-green-100 text-green-800'
                            : listing.quality === 'grade-a'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {listing.quality === 'organic'
                          ? isArabic
                            ? 'عضوي'
                            : 'Bio'
                          : listing.quality === 'grade-a'
                          ? isArabic
                            ? 'درجة أولى'
                            : 'Grade A'
                          : isArabic
                          ? 'درجة ثانية'
                          : 'Grade B'}
                      </span>
                    </div>
                    
                    {listing.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {listing.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-gray-500">
                        {isArabic ? 'تاريخ الحصاد:' : 'Date de récolte:'}{' '}
                        {formatDate(listing.harvestDate)}
                      </p>
                      <Button variant="primary" size="sm">
                        {isArabic ? 'عرض التفاصيل' : 'Voir les détails'}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
