'use client';

import { useState, useEffect } from 'react';
import { MealType } from '@/types';
import { 
  getLocalMealPlans, 
  updateLocalMealPlan, 
  deleteLocalMealPlan,
  MealPlan 
} from '@/lib/localMealPlanning';
import { EditMealModal } from '@/components/meal-planning/EditMealModal';
import { ViewMealModal } from '@/components/meal-planning/ViewMealModal';
import { 
  Calendar, 
  Edit, 
  Eye, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Utensils
} from 'lucide-react';

const MEAL_TYPES: MealType[] = [MealType.BREAKFAST, MealType.LUNCH, MealType.DINNER, MealType.SNACK];
const MEAL_TYPE_LABELS: Record<MealType, string> = {
  [MealType.BREAKFAST]: 'Breakfast',
  [MealType.LUNCH]: 'Lunch',
  [MealType.DINNER]: 'Dinner',
  [MealType.SNACK]: 'Snack',
};

const MEAL_TYPE_COLORS: Record<MealType, string> = {
  [MealType.BREAKFAST]: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  [MealType.LUNCH]: 'bg-green-100 text-green-700 border-green-300',
  [MealType.DINNER]: 'bg-orange-100 text-orange-700 border-orange-300',
  [MealType.SNACK]: 'bg-purple-100 text-purple-700 border-purple-300',
};

export function MealPlanner() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now; // Start from today instead of Monday
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null);

  useEffect(() => {
    setMealPlans(getLocalMealPlans());
  }, []);

  // Rafraîchir quand le composant reçoit le focus (pour les mises à jour externes)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setMealPlans(getLocalMealPlans());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const getWeekDates = (startDate: Date) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getMealPlanForDateAndType = (date: string, mealType: MealType) => {
    return mealPlans.find((mp) => mp.date === date && mp.mealType === mealType);
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  };

  const handleMealTypeChange = (mealPlan: MealPlan, newMealType: MealType) => {
    updateLocalMealPlan(mealPlan.id, { mealType: newMealType });
    setMealPlans(getLocalMealPlans());
  };

  const handleDeleteMeal = (mealPlanId: number) => {
    if (confirm('Are you sure you want to delete this meal?')) {
      deleteLocalMealPlan(mealPlanId);
      setMealPlans(getLocalMealPlans());
    }
  };

  const handleEditMeal = (mealPlan: MealPlan) => {
    setSelectedMealPlan(mealPlan);
    setIsEditModalOpen(true);
  };

  const handleViewMeal = (mealPlan: MealPlan) => {
    setSelectedMealPlan(mealPlan);
    setIsViewModalOpen(true);
  };

  const handleMealUpdate = (id: number, updates: Partial<MealPlan>) => {
    updateLocalMealPlan(id, updates);
    setMealPlans(getLocalMealPlans());
  };

  const weekDates = getWeekDates(currentWeekStart);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Meal Planner</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-sm font-medium text-gray-600 min-w-[200px] text-center">
              {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {' '}
              {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <button
              onClick={handleNextWeek}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mode Toggle Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsEditMode(false)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              !isEditMode
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>View</span>
          </button>
          <button
            onClick={() => setIsEditMode(true)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isEditMode
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      {/* Week Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
          <div className="p-3 font-medium text-gray-700 text-center">Meal</div>
          {weekDates.map((date) => {
            const isToday = formatDate(date) === formatDate(new Date());
            return (
              <div
                key={date.toISOString()}
                className={`p-3 font-medium text-center ${
                  isToday ? 'bg-orange-100 text-orange-700' : 'text-gray-700'
                }`}
              >
                <div className="text-sm">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                <div className="text-lg font-bold">{date.getDate()}</div>
              </div>
            );
          })}
        </div>

        {/* Meal Rows */}
        {MEAL_TYPES.map((mealType) => (
          <div key={mealType} className="grid grid-cols-8 border-b border-gray-100 last:border-b-0">
            {/* Meal Type Label */}
            <div className="p-3 flex items-center justify-center border-r border-gray-100">
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${MEAL_TYPE_COLORS[mealType]}`}>
                {MEAL_TYPE_LABELS[mealType]}
              </div>
            </div>

            {/* Days */}
            {weekDates.map((date) => {
              const dateStr = formatDate(date);
              const mealPlan = getMealPlanForDateAndType(dateStr, mealType);

              return (
                <div
                  key={`${dateStr}-${mealType}`}
                  className="p-2 border-r border-gray-100 last:border-r-0 min-h-[100px]"
                >
                  {mealPlan ? (
                    <div className="relative group">
                      <div 
                        onClick={() => isEditMode ? handleEditMeal(mealPlan) : handleViewMeal(mealPlan)}
                        className="bg-gray-50 rounded-lg p-2 h-full border border-gray-200 hover:border-orange-300 transition-colors cursor-pointer"
                      >
                        {mealPlan.recipeImage && (
                          <img
                            src={mealPlan.recipeImage}
                            alt={mealPlan.recipeTitle}
                            className="w-full h-16 object-cover rounded mb-2"
                          />
                        )}
                        <p className="text-xs font-medium text-gray-900 line-clamp-2">
                          {mealPlan.recipeTitle}
                        </p>

                        {isEditMode && (
                          <div className="absolute top-1 right-1 flex space-x-1">
                            {/* Meal Type Dropdown */}
                            <select
                              value={mealPlan.mealType}
                              onChange={(e) => {
                                e.stopPropagation();
                                handleMealTypeChange(mealPlan, e.target.value as MealType);
                              }}
                              className="text-xs px-2 py-1 bg-white border border-gray-300 rounded hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {MEAL_TYPES.map((type) => (
                                <option key={type} value={type}>
                                  {MEAL_TYPE_LABELS[type]}
                                </option>
                              ))}
                            </select>

                            {/* Delete Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteMeal(mealPlan.id);
                              }}
                              className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              title="Delete meal"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      {isEditMode ? (
                        <button className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                          <Utensils className="w-5 h-5" />
                        </button>
                      ) : (
                        <div className="w-2 h-2 bg-gray-200 rounded-full" />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-100 rounded-full border border-orange-300" />
          <span>Today</span>
        </div>
        <div className="flex items-center space-x-2">
          <Utensils className="w-4 h-4" />
          <span>{isEditMode ? 'Click to add meal' : 'Empty slot'}</span>
        </div>
      </div>

      {/* Edit Meal Modal */}
      {selectedMealPlan && (
        <EditMealModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedMealPlan(null);
          }}
          mealPlan={selectedMealPlan}
          onUpdate={handleMealUpdate}
        />
      )}

      {/* View Meal Modal */}
      {selectedMealPlan && (
        <ViewMealModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedMealPlan(null);
          }}
          mealPlan={selectedMealPlan}
        />
      )}
    </div>
  );
}
