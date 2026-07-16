'use client';

import { useState, useEffect } from 'react';
import { X, Check, Utensils, Calendar } from 'lucide-react';
import { ShoppingList } from '@/lib/localShoppingLists';
import { mealPlanningService, MealPlanning } from '@/services/mealPlanningService';
import { updateLocalShoppingList } from '@/lib/localShoppingLists';
import { addShoppingListItem, ShoppingListItem } from '@/lib/localShoppingLists';
import { recipeService } from '@/services/recipeService';
import { Recipe } from '@/types';
import { useAuthStore } from '@/stores/authStore';

interface AddMealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shoppingList: ShoppingList;
  onMealsAdded: () => void;
}

export function AddMealsModal({ isOpen, onClose, shoppingList, onMealsAdded }: AddMealsModalProps) {
  const [mealPlans, setMealPlans] = useState<MealPlanning[]>([]);
  const [selectedMealPlans, setSelectedMealPlans] = useState<Set<number>>(new Set());
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    loadMealPlans();
    // Pré-sélectionner les repas déjà inclus
    setSelectedMealPlans(new Set(shoppingList.mealPlanIds));
  }, [shoppingList]);

  const loadMealPlans = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const plannings = await mealPlanningService.getMealPlanningsByUser(user.id);
      setMealPlans(plannings);
    } catch (error) {
      console.error('Failed to load meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMealPlan = (mealPlanId: number) => {
    const newSelected = new Set(selectedMealPlans);
    if (newSelected.has(mealPlanId)) {
      newSelected.delete(mealPlanId);
    } else {
      newSelected.add(mealPlanId);
    }
    setSelectedMealPlans(newSelected);
  };

  const handleAddMeals = async () => {
    try {
      setIsAdding(true);

      // Mettre à jour la liste avec les nouveaux meal plans
      updateLocalShoppingList(shoppingList.id, {
        mealPlanIds: Array.from(selectedMealPlans),
      });

      // Ajouter les ingrédients des repas sélectionnés
      const recipes = await recipeService.getAllRecipes();
      
      for (const mealPlanId of selectedMealPlans) {
        const mealPlan = mealPlans.find((mp) => mp.id === mealPlanId);
        if (mealPlan && mealPlan.recipeId) {
          const recipe = recipes.find((r: Recipe) => r.id === mealPlan.recipeId);
          if (recipe && recipe.ingredients) {
            for (const ingredient of recipe.ingredients) {
              const newItem: ShoppingListItem = {
                id: Date.now() + Math.random(),
                shoppingListId: shoppingList.id,
                ingredientName: ingredient.name,
                quantity: ingredient.quantity,
                unit: ingredient.unit || '',
                checked: false,
                sourceMealPlanId: mealPlan.id,
                sourceRecipeTitle: recipe.title,
                sourceMealType: mealPlan.mealType,
                sourceDate: mealPlan.plannedDate,
              };
              addShoppingListItem(newItem);
            }
          }
        }
      }

      onMealsAdded();
    } catch (err) {
      console.error('Failed to add meals:', err);
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
              <Utensils className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Add Meals to List</h2>
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
            {mealPlans.map((mealPlan) => {
              const isSelected = selectedMealPlans.has(mealPlan.id);
              return (
                <div
                  key={mealPlan.id}
                  onClick={() => handleToggleMealPlan(mealPlan.id)}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {mealPlan.recipeImage && (
                      <img
                        src={mealPlan.recipeImage}
                        alt={mealPlan.recipeTitle}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{mealPlan.recipeTitle}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(mealPlan.plannedDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{mealPlan.mealType}</span>
                      </div>
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

            {mealPlans.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Utensils className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No meals found in your meal planner</p>
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
              onClick={handleAddMeals}
              disabled={isAdding || selectedMealPlans.size === 0}
              className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? 'Adding...' : `Add ${selectedMealPlans.size} Meal${selectedMealPlans.size > 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
