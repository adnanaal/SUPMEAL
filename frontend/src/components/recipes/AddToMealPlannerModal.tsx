'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Check } from 'lucide-react';
import { Recipe, MealType } from '@/types';
import { mealPlanningService } from '@/services/mealPlanningService';
import { useAuthStore } from '@/stores/authStore';

interface AddToMealPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
}

const MEAL_TYPES: MealType[] = [MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER, MealType.SNACK];
const MEAL_TYPE_LABELS: Record<MealType, string> = {
  [MealType.BREAKFAST]: 'Breakfast',
  [MealType.LUNCH]: 'Lunch',
  [MealType.DINNER]: 'Dinner',
  [MealType.SNACK]: 'Snack',
};

export function AddToMealPlannerModal({ isOpen, onClose, recipe }: AddToMealPlannerModalProps) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<MealType>(MealType.DINNER);
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useAuthStore();

  // Set default date to today
  useEffect(() => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleAddToMealPlanner = async () => {
    if (!selectedDate || !user) return;

    // Validation: empêcher les dates passées
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);
    
    if (selectedDateObj < today) {
      alert('Please select today or a future date');
      return;
    }

    try {
      setIsAdding(true);

      await mealPlanningService.createMealPlanning({
        plannedDate: selectedDate,
        mealType: selectedMealType,
        recipeId: recipe.id,
      });

      onClose();
    } catch (err) {
      console.error('Failed to add to meal planner:', err);
      alert('Failed to add to meal planner. Please try again.');
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
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Add to Meal Planner</h2>
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
          {recipe.imagePath && (
            <img
              src={recipe.imagePath}
              alt={recipe.title}
              className="w-full h-32 object-cover rounded mt-2"
            />
          )}
        </div>

        {/* Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-900"
            />
          </div>

          <div>
            <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-2">
              Meal Type *
            </label>
            <select
              id="mealType"
              value={selectedMealType}
              onChange={(e) => setSelectedMealType(e.target.value as MealType)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-900"
            >
              {MEAL_TYPES.map((type) => (
                <option key={type} value={type}>
                  {MEAL_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>
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
            onClick={handleAddToMealPlanner}
            disabled={isAdding || !selectedDate}
            className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? 'Adding...' : 'Add to Planner'}
          </button>
        </div>
      </div>
    </div>
  );
}
