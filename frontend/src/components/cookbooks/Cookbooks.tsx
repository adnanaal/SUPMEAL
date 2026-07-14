'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, BookOpen, Users, Trash2, Settings } from 'lucide-react';
import { Cookbook } from '@/lib/localCookbooks';
import { cookbookService } from '@/services/cookbookService';
import { CreateCookbookModal } from '@/components/cookbooks/CreateCookbookModal';

export function Cookbooks() {
  const router = useRouter();
  const [cookbooks, setCookbooks] = useState<Cookbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const currentUserId = 'user1'; // Simuler l'utilisateur connecté

  useEffect(() => {
    const loadCookbooks = async () => {
      try {
        setLoading(true);
        const data = await cookbookService.getAllCookbooks();
        setCookbooks(data);
      } catch (err) {
        console.error('Failed to load cookbooks:', err);
        setError('Failed to load cookbooks');
      } finally {
        setLoading(false);
      }
    };
    loadCookbooks();
  }, []);

  // Rafraîchir quand le composant reçoit le focus
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        try {
          const data = await cookbookService.getAllCookbooks();
          setCookbooks(data);
        } catch (err) {
          console.error('Failed to refresh cookbooks:', err);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleCreateCookbook = async (cookbook: Cookbook) => {
    try {
      const createdCookbook = await cookbookService.createCookbook(cookbook);
      setCookbooks([...cookbooks, createdCookbook]);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Failed to create cookbook:', err);
      throw err;
    }
  };

  const handleDeleteCookbook = async (id: number) => {
    if (confirm('Are you sure you want to delete this cookbook?')) {
      try {
        await cookbookService.deleteCookbook(id);
        setCookbooks(cookbooks.filter(cb => cb.id !== id));
      } catch (err) {
        console.error('Failed to delete cookbook:', err);
      }
    }
  };

  const handleViewCookbook = (id: number) => {
    router.push(`/dashboard/cookbooks/${id}`);
  };

  const getUserPermissionInCookbook = (cookbook: Cookbook): string | null => {
    const member = cookbook.members.find((m) => m.userId === currentUserId);
    return member ? member.permission : null;
  };

  const canDeleteCookbook = (cookbook: Cookbook): boolean => {
    const permission = getUserPermissionInCookbook(cookbook);
    return permission === 'CREATOR';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <BookOpen className="w-6 h-6 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Cookbooks</h1>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create Cookbook</span>
        </button>
      </div>

      {/* Cookbooks Grid */}
      {cookbooks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cookbooks yet</h3>
          <p className="text-gray-500 mb-4">Create your first cookbook to start collecting recipes</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create Cookbook
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cookbooks.map((cookbook) => (
            <div
              key={cookbook.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => handleViewCookbook(cookbook.id)}
            >
              {/* Cover Image */}
              {cookbook.coverImage && (
                <div className="h-40 bg-gray-100">
                  <img
                    src={cookbook.coverImage}
                    alt={cookbook.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{cookbook.name}</h3>
                    {cookbook.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{cookbook.description}</p>
                    )}
                  </div>
                  {canDeleteCookbook(cookbook) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCookbook(cookbook.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete cookbook"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{cookbook.members.length} member{cookbook.members.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{cookbook.recipeIds.length} recipe{cookbook.recipeIds.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center space-x-2">
                  <span className="text-xs text-gray-400">Created by {cookbook.creatorName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Cookbook Modal */}
      <CreateCookbookModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateCookbook}
        currentUserId={currentUserId}
      />
    </div>
  );
}
