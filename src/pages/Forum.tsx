import { useAuthStore } from '../store/authStore';
import { t } from '../utils/i18n';
import { MessageSquare, Plus, ThumbsUp, ArrowRight } from 'lucide-react';

export const Forum = () => {
  const { language } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t('forum', language)}
          </h1>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>{language === 'ar' ? 'منشور جديد' : 'Nouveau post'}</span>
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['irrigation', 'pests', 'soil', 'marketing', 'equipment', 'general'].map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 whitespace-nowrap text-sm font-medium"
            >
              {language === 'ar' ? cat : cat}
            </button>
          ))}
        </div>

        {/* Empty State */}
        <div className="card text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {language === 'ar'
              ? 'لا توجد منشورات حتى الآن'
              : 'Aucun post pour le moment'
            }
          </p>
          <button className="btn-primary flex items-center gap-2 mx-auto">
            <Plus className="w-5 h-5" />
            <span>{language === 'ar' ? 'إنشاء منشور' : 'Créer un post'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

