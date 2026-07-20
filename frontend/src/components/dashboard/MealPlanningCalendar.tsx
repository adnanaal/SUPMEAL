import { MealPlanning, MealType } from '@/types';
import { Calendar, Clock, Utensils } from 'lucide-react';
import { format } from 'date-fns';

interface MealPlanningCalendarProps {
  mealPlannings: MealPlanning[];
  title?: string;
}

const mealTypeColors: Record<MealType, string> = {
  BREAKFAST: 'bg-orange-100 text-orange-700',
  LUNCH: 'bg-green-100 text-green-700',
  DINNER: 'bg-purple-100 text-purple-700',
  SNACK: 'bg-blue-100 text-blue-700',
};

const mealTypeIcons: Record<MealType, string> = {
  BREAKFAST: '☕',
  LUNCH: '🍽️',
  DINNER: '🍲',
  SNACK: '🍎',
};

export function MealPlanningCalendar({ mealPlannings, title = 'Meal Planning' }: MealPlanningCalendarProps) {
  if (mealPlannings.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-500 text-center py-8">No meal plans found</p>
      </div>
    );
  }

  // Group meal plannings by date
  const groupedByDate = mealPlannings.reduce((acc, planning) => {
    const date = planning.plannedDate;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(planning);
    return acc;
  }, {} as Record<string, MealPlanning[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedByDate).sort();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-4">
        {sortedDates.map((date) => (
          <div key={date} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Calendar className="w-5 h-5 text-gray-500 mr-2" />
              <span className="font-medium text-gray-900">{format(new Date(date), 'EEEE, MMMM d, yyyy')}</span>
            </div>
            <div className="space-y-2">
              {groupedByDate[date].map((planning) => (
                <div
                  key={planning.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    {planning.recipe?.imagePath ? (
                      <img
                        src={planning.recipe.imagePath}
                        alt={planning.recipe.title || 'Recipe'}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <span className="text-2xl">{mealTypeIcons[planning.mealType]}</span>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{planning.recipe?.title || 'Recipe not found'}</p>
                      <p className="text-sm text-gray-500">{planning.mealType}</p>
                    </div>
                  </div>
                  {planning.recipe && (
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      {planning.recipe.preparationTime && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {planning.recipe.preparationTime} min
                        </div>
                      )}
                      <div className="flex items-center">
                        <Utensils className="w-4 h-4 mr-1" />
                        {planning.recipe.servings} servings
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
