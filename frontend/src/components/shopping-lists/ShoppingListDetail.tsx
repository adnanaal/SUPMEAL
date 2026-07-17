'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Check, Edit, Trash2, Info, Utensils, Calendar } from 'lucide-react';
import { 
  shoppingListService, 
  ShoppingList,
  ShoppingListItem 
} from '@/services/shoppingListService';
import { AddMealsModal } from '@/components/shopping-lists/AddMealsModal';
import { EditIngredientModal } from '@/components/shopping-lists/EditIngredientModal';
import { IngredientSourceModal } from '@/components/shopping-lists/IngredientSourceModal';

export function ShoppingListDetail() {
  const params = useParams();
  const router = useRouter();
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [isAddMealsModalOpen, setIsAddMealsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSourceModalOpen, setIsSourceModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ShoppingListItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const listId = parseInt(params.id as string);

  useEffect(() => {
    loadShoppingList();
  }, [listId]);

  const loadShoppingList = async () => {
    try {
      setIsLoading(true);
      const [list, listItems] = await Promise.all([
        shoppingListService.getShoppingListById(listId),
        shoppingListService.getShoppingListItemsByShoppingList(listId),
      ]);
      setShoppingList(list);
      setItems(listItems);
    } catch (error) {
      console.error('Failed to load shopping list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleCheck = async (itemId: number) => {
    try {
      const item = items.find((i) => i.id === itemId);
      if (item) {
        await shoppingListService.updateShoppingListItem(itemId, { checked: !item.checked });
        await loadShoppingList();
      }
    } catch (error) {
      console.error('Failed to toggle check:', error);
    }
  };

  const handleEditItem = (item: ShoppingListItem) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleItemUpdate = async (itemId: number, updates: Partial<ShoppingListItem>) => {
    try {
      await shoppingListService.updateShoppingListItem(itemId, updates);
      await loadShoppingList();
    } catch (error) {
      console.error('Failed to update item:', error);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (confirm('Are you sure you want to delete this ingredient?')) {
      try {
        await shoppingListService.deleteShoppingListItem(itemId);
        await loadShoppingList();
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  const handleViewSource = (item: ShoppingListItem) => {
    setSelectedItem(item);
    setIsSourceModalOpen(true);
  };

  const handleAddMeals = () => {
    setIsAddMealsModalOpen(true);
  };

  const handleMealsAdded = async () => {
    await loadShoppingList();
    setIsAddMealsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Shopping Lists</span>
        </button>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading shopping list...</p>
        </div>
      </div>
    );
  }

  if (!shoppingList) {
    return (
      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Shopping Lists</span>
        </button>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500">Shopping list not found</p>
        </div>
      </div>
    );
  }

  const checkedItems = items.filter((item) => item.checked);
  const uncheckedItems = items.filter((item) => !item.checked);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{shoppingList.name}</h1>
            {shoppingList.description && (
              <p className="text-sm text-gray-500 mt-1">{shoppingList.description}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleAddMeals}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Add Meals</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Utensils className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{items.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Checked</p>
              <p className="text-2xl font-bold text-gray-900">{checkedItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Meals Included</p>
              <p className="text-2xl font-bold text-gray-900">{shoppingList.mealPlanIds.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Unchecked Items */}
        {uncheckedItems.length > 0 && (
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">To Buy</h3>
            <div className="space-y-3">
              {uncheckedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleToggleCheck(item.id)}
                      className="p-2 border-2 border-gray-300 rounded-lg hover:border-orange-500 transition-colors"
                    >
                      <Check className="w-5 h-5 text-gray-400" />
                    </button>
                    <div>
                      <p className="font-medium text-gray-900">
                        {item.quantity} {item.unit} {item.ingredientName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewSource(item)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-5 rounded-lg transition-colors"
                      title="View source"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditItem(item)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit ingredient"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete ingredient"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checked Items */}
        {checkedItems.length > 0 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchased</h3>
            <div className="space-y-3">
              {checkedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-green-50 rounded-lg opacity-75"
                >
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleToggleCheck(item.id)}
                      className="p-2 border-2 border-green-500 bg-green-500 rounded-lg"
                    >
                      <Check className="w-5 h-5 text-white" />
                    </button>
                    <div>
                      <p className="font-medium text-gray-900 line-through">
                        {item.quantity} {item.unit} {item.ingredientName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleViewSource(item)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View source"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditItem(item)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit ingredient"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete ingredient"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {items.length === 0 && (
          <div className="p-12 text-center">
            <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items yet</h3>
            <p className="text-gray-500 mb-4">Add meals from your meal planner to populate this list</p>
            <button
              onClick={handleAddMeals}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Add Meals
            </button>
          </div>
        )}
      </div>

      {/* Add Meals Modal */}
      <AddMealsModal
        isOpen={isAddMealsModalOpen}
        onClose={() => setIsAddMealsModalOpen(false)}
        shoppingList={shoppingList}
        onMealsAdded={handleMealsAdded}
      />

      {/* Edit Ingredient Modal */}
      {selectedItem && (
        <EditIngredientModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          onUpdate={handleItemUpdate}
        />
      )}

      {/* Ingredient Source Modal */}
      {selectedItem && (
        <IngredientSourceModal
          isOpen={isSourceModalOpen}
          onClose={() => {
            setIsSourceModalOpen(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
        />
      )}
    </div>
  );
}
