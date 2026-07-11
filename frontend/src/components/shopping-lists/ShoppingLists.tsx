'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Calendar, ShoppingCart, Trash2, Edit } from 'lucide-react';
import { 
  getLocalShoppingLists, 
  addLocalShoppingList,
  deleteLocalShoppingList,
  ShoppingList 
} from '@/lib/localShoppingLists';
import { CreateShoppingListModal } from '@/components/shopping-lists/CreateShoppingListModal';

export function ShoppingLists() {
  const router = useRouter();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    setShoppingLists(getLocalShoppingLists());
  }, []);

  // Rafraîchir quand le composant reçoit le focus (pour les mises à jour externes)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setShoppingLists(getLocalShoppingLists());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleCreateList = (list: ShoppingList) => {
    addLocalShoppingList(list);
    setShoppingLists(getLocalShoppingLists());
    setIsCreateModalOpen(false);
  };

  const handleDeleteList = (id: number) => {
    if (confirm('Are you sure you want to delete this shopping list?')) {
      deleteLocalShoppingList(id);
      setShoppingLists(getLocalShoppingLists());
    }
  };

  const handleViewList = (id: number) => {
    router.push(`/dashboard/shopping-lists/${id}`);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Lists</h1>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Create List</span>
        </button>
      </div>

      {/* Shopping Lists Grid */}
      {shoppingLists.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No shopping lists yet</h3>
          <p className="text-gray-500 mb-4">Create your first shopping list to get started</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Create List
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shoppingLists.map((list) => (
            <div
              key={list.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => handleViewList(list.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{list.name}</h3>
                  {list.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">{list.description}</p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteList(list.id);
                  }}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete list"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(list.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ShoppingCart className="w-4 h-4" />
                  <span>{list.mealPlanIds.length} meals</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Shopping List Modal */}
      <CreateShoppingListModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateList}
      />
    </div>
  );
}
