'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Calendar, ShoppingCart, Trash2, Edit } from 'lucide-react';
import { shoppingListService, ShoppingList, ShoppingListItem } from '@/services/shoppingListService';
import { CreateShoppingListModal } from '@/components/shopping-lists/CreateShoppingListModal';
import { useLanguage } from '@/contexts/LanguageContext';

export function ShoppingLists() {
  const router = useRouter();
  const { t } = useLanguage();
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [shoppingListItems, setShoppingListItems] = useState<Map<number, ShoppingListItem[]>>(new Map());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadShoppingLists();
  }, []);

  const loadShoppingLists = async () => {
    try {
      setIsLoading(true);
      const lists = await shoppingListService.getAllShoppingLists();
      setShoppingLists(lists);
      
      // Charger les items pour chaque shopping list
      const itemsMap = new Map<number, ShoppingListItem[]>();
      for (const list of lists) {
        const items = await shoppingListService.getShoppingListItemsByShoppingList(list.id);
        itemsMap.set(list.id, items);
      }
      setShoppingListItems(itemsMap);
    } catch (error) {
      console.error('Failed to load shopping lists:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMealsCount = (listId: number): number => {
    const items = shoppingListItems.get(listId) || [];
    const uniqueRecipes = new Set(
      items
        .filter((item) => item.sourceRecipeTitle)
        .map((item) => item.sourceRecipeTitle)
    );
    return uniqueRecipes.size;
  };

  const handleCreateList = async () => {
    try {
      await loadShoppingLists();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to load shopping lists:', error);
    }
  };

  const handleDeleteList = async (id: number) => {
    if (confirm(t('deleteListConfirm'))) {
      try {
        await shoppingListService.deleteShoppingList(id);
        await loadShoppingLists();
      } catch (error) {
        console.error('Failed to delete shopping list:', error);
      }
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
          <h1 className="text-2xl font-bold text-gray-900">{t('shoppingListsTitle')}</h1>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>{t('createList')}</span>
        </button>
      </div>

      {/* Shopping Lists Grid */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">{t('loadingShoppingLists')}</p>
        </div>
      ) : shoppingLists.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noShoppingLists')}</h3>
          <p className="text-gray-500 mb-4">{t('createFirstList')}</p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            {t('createList')}
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
                  title={t('deleteList')}
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
                  <span>{getMealsCount(list.id)} {t('meals')}</span>
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
