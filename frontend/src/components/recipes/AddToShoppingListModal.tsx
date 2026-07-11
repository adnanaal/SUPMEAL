'use client';

import { useState, useEffect } from 'react';
import { X, ShoppingCart, Check } from 'lucide-react';
import { Recipe } from '@/types';
import { getLocalShoppingLists, ShoppingList, updateLocalShoppingList } from '@/lib/localShoppingLists';
import { addShoppingListItem, ShoppingListItem } from '@/lib/localShoppingLists';

interface AddToShoppingListModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
}

export function AddToShoppingListModal({ isOpen, onClose, recipe }: AddToShoppingListModalProps) {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setShoppingLists(getLocalShoppingLists());
  }, []);

  const handleAddToList = async () => {
    if (!selectedListId) return;

    try {
      setIsAdding(true);

      // Récupérer la shopping list actuelle
      const shoppingLists = getLocalShoppingLists();
      const targetList = shoppingLists.find((sl) => sl.id === selectedListId);
      
      if (targetList) {
        // Ajouter les ingrédients de la recette à la shopping list
        if (recipe.ingredients) {
          for (const ingredient of recipe.ingredients) {
            const newItem: ShoppingListItem = {
              id: Date.now() + Math.random(),
              shoppingListId: selectedListId,
              ingredientName: ingredient.name,
              quantity: ingredient.quantity,
              unit: ingredient.unit || '',
              checked: false,
              sourceMealPlanId: 0, // Pas de meal plan spécifique
              sourceRecipeTitle: recipe.title,
              sourceMealType: 'MANUAL',
              sourceDate: new Date().toISOString().split('T')[0],
            };
            addShoppingListItem(newItem);
          }
        }

        // Mettre à jour mealPlanIds de la shopping list pour inclure cette recette
        if (!targetList.mealPlanIds.includes(recipe.id)) {
          updateLocalShoppingList(selectedListId, {
            mealPlanIds: [...targetList.mealPlanIds, recipe.id],
          });
        }
      }

      onClose();
    } catch (err) {
      console.error('Failed to add to shopping list:', err);
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Add to Shopping List</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Recipe Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-500 mb-1">Recipe</p>
          <p className="font-medium text-gray-900">{recipe.title}</p>
          <p className="text-sm text-gray-500 mt-1">
            {recipe.ingredients?.length || 0} ingredient{recipe.ingredients?.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Shopping Lists */}
        <div className="space-y-3 mb-6">
          <p className="text-sm font-medium text-gray-700">Select Shopping List</p>
          {shoppingLists.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <p>No shopping lists found</p>
              <p className="text-sm mt-1">Create a shopping list first</p>
            </div>
          ) : (
            shoppingLists.map((list) => (
              <div
                key={list.id}
                onClick={() => setSelectedListId(list.id)}
                className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedListId === list.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <p className="font-medium text-gray-900">{list.name}</p>
                  {list.description && (
                    <p className="text-sm text-gray-500">{list.description}</p>
                  )}
                </div>
                {selectedListId === list.id && (
                  <div className="p-2 bg-orange-500 rounded-full">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            disabled={isAdding}
          >
            Cancel
          </button>
          <button
            onClick={handleAddToList}
            disabled={isAdding || !selectedListId}
            className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? 'Adding...' : 'Add Ingredients'}
          </button>
        </div>
      </div>
    </div>
  );
}
