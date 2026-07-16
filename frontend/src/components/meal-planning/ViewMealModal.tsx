'use client';

import { X, Clock, Users, Utensils, ChefHat } from 'lucide-react';
import { MealType } from '@/types';

interface MealPlan {
  id: number;
  date: string;
  mealType: MealType;
  recipeId?: number;
  recipeTitle?: string;
  recipeImage?: string;
}

const MEAL_TYPE_LABELS: Record<MealType, string> = {
  [MealType.BREAKFAST]: 'Breakfast',
  [MealType.LUNCH]: 'Lunch',
  [MealType.DINNER]: 'Dinner',
  [MealType.SNACK]: 'Snack',
};

interface ViewMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  mealPlan: MealPlan;
}

export function ViewMealModal({ isOpen, onClose, mealPlan }: ViewMealModalProps) {
  if (!isOpen) return null;

  const formattedDate = new Date(mealPlan.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Utensils className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Meal Details</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Recipe Image */}
          {mealPlan.recipeImage && (
            <div className="relative">
              <img
                src={mealPlan.recipeImage}
                alt={mealPlan.recipeTitle}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Recipe Title */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{mealPlan.recipeTitle}</h3>
          </div>

          {/* Meal Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium text-gray-900">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <ChefHat className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-500">Meal Type</p>
                <p className="font-medium text-gray-900">{MEAL_TYPE_LABELS[mealPlan.mealType]}</p>
              </div>
            </div>

            {mealPlan.recipeId && (
              <div className="flex items-center space-x-3">
                <Utensils className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Recipe ID</p>
                  <p className="font-medium text-gray-900">#{mealPlan.recipeId}</p>
                </div>
              </div>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
