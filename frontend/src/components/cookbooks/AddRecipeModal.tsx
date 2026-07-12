'use client';

import { useState, useEffect } from 'react';
import { X, BookOpen, Check } from 'lucide-react';
import { getLocalRecipes, Recipe } from '@/lib/localRecipes';
import { addRecipeToCookbook } from '@/lib/localCookbooks';

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  cookbookId: number;
  onRecipeAdded: () => void;
}

export function AddRecipeModal({ isOpen, onClose, cookbookId, onRecipeAdded }: AddRecipeModalProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<Set<number>>(new Set());
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    setRecipes(getLocalRecipes());
  }, []);

  const handleToggleRecipe = (recipeId: number) => {
    const newSelected = new Set(selectedRecipeIds);
    if (newSelected.has(recipeId)) {
      newSelected.delete(recipeId);
    } else {
      newSelected.add(recipeId);
    }
    setSelectedRecipeIds(newSelected);
  };

  const handleAddRecipes = async () => {
    try {
      setIsAdding(true);

      // Ajouter les recettes sélectionnées au cookbook
      for (const recipeId of selectedRecipeIds) {
        addRecipeToCookbook(cookbookId, recipeId);
      }

      onRecipeAdded();
    } catch (err) {
      console.error('Failed to add recipes:', err);
    } finally {
      setIsAdding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Add Recipes to Cookbook</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {recipes.map((recipe) => {
              const isSelected = selectedRecipeIds.has(recipe.id);
              return (
                <div
                  key={recipe.id}
                  onClick={() => handleToggleRecipe(recipe.id)}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {recipe.imagePath && (
                      <img
                        src={recipe.imagePath}
                        alt={recipe.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{recipe.title}</p>
                      {recipe.description && (
                        <p className="text-sm text-gray-500 line-clamp-1">{recipe.description}</p>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="p-2 bg-orange-500 rounded-full">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>
              );
            })}

            {recipes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recipes found</p>
                <p className="text-sm mt-1">Create some recipes first</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              disabled={isAdding}
            >
              Cancel
            </button>
            <button
              onClick={handleAddRecipes}
              disabled={isAdding || selectedRecipeIds.size === 0}
              className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Adding...' : `Add ${selectedRecipeIds.size} Recipe${selectedRecipeIds.size > 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
