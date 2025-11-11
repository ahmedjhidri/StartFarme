import React, { useState } from 'react';
import { Users, MessageCircle, Plus, ThumbsUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';
import type { ForumPost } from '../types';

const categories = [
  { id: 'all', label: 'الكل', labelFr: 'Tout' },
  { id: 'irrigation', label: 'الري', labelFr: 'Irrigation' },
  { id: 'pests', label: 'الآفات', labelFr: 'Ravageurs' },
  { id: 'soil', label: 'التربة', labelFr: 'Sol' },
  { id: 'marketing', label: 'التسويق', labelFr: 'Marketing' },
  { id: 'equipment', label: 'المعدات', labelFr: 'Équipement' },
  { id: 'general', label: 'عام', labelFr: 'Général' },
];

export const Community: React.FC = () => {
  const { language } = useAuthStore();
  const isArabic = language === 'ar';
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts] = useState<ForumPost[]>([]);
  
  const filteredPosts = posts.filter((post) => {
    if (selectedCategory !== 'all' && post.category !== selectedCategory) {
      return false;
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });
  
  return (
    <div className="p-4 pb-20 md:pb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">
            {isArabic ? 'المجتمع' : 'Communauté'}
          </h1>
        </div>
        <Button variant="primary" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          {isArabic ? 'منشور جديد' : 'Nouveau post'}
        </Button>
      </div>
      
      {/* Search */}
      <div className="mb-4">
        <Input
          type="text"
          placeholder={isArabic ? 'ابحث في المنشورات...' : 'Rechercher dans les posts...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Categories */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? 'bg-primary text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isArabic ? cat.label : cat.labelFr}
          </button>
        ))}
      </div>
      
      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {isArabic
                ? 'لا توجد منشورات حتى الآن. كن أول من ينشر!'
                : 'Aucun post pour le moment. Soyez le premier à publier !'}
            </p>
            <Button variant="primary">
              <Plus className="w-4 h-4 mr-2" />
              {isArabic ? 'إنشاء منشور' : 'Créer un post'}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                    {post.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{post.authorName}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString(
                        isArabic ? 'ar-TN' : 'fr-FR',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }
                      )}
                    </p>
                  </div>
                </div>
                {post.expertVerified && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {isArabic ? '✓ خبير' : '✓ Expert'}
                  </span>
                )}
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
              <p className="text-gray-700 mb-3 line-clamp-3">{post.content}</p>
              
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <button className="flex items-center gap-1 hover:text-primary transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.upvotes}</span>
                  </button>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.replies.length} {isArabic ? 'رد' : 'réponses'}</span>
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  {isArabic ? 'عرض التفاصيل' : 'Voir les détails'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
