import { MealType } from '@/types';

export interface MealPlan {
  id: number;
  date: string; // YYYY-MM-DD format
  mealType: MealType;
  recipeId?: number;
  recipeTitle?: string;
  recipeImage?: string;
}

// Données manuelles temporaires pour meal planning
let localMealPlans: MealPlan[] = [
  // Aujourd'hui
  {
    id: 1,
    date: new Date().toISOString().split('T')[0], // Aujourd'hui
    mealType: 'BREAKFAST' as MealType,
    recipeId: 3,
    recipeTitle: 'Avocado Toast',
    recipeImage: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
  },
  {
    id: 2,
    date: new Date().toISOString().split('T')[0], // Aujourd'hui
    mealType: 'LUNCH' as MealType,
    recipeId: 5,
    recipeTitle: 'Greek Salad',
    recipeImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
  },
  {
    id: 3,
    date: new Date().toISOString().split('T')[0], // Aujourd'hui
    mealType: 'DINNER' as MealType,
    recipeId: 1,
    recipeTitle: 'Pasta Carbonara',
    recipeImage: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
  },
  // Demain
  {
    id: 4,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Demain
    mealType: 'BREAKFAST' as MealType,
    recipeId: 6,
    recipeTitle: 'French Omelette',
    recipeImage: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',
  },
  {
    id: 5,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Demain
    mealType: 'LUNCH' as MealType,
    recipeId: 5,
    recipeTitle: 'Greek Salad',
    recipeImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
  },
  {
    id: 6,
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Demain
    mealType: 'DINNER' as MealType,
    recipeId: 2,
    recipeTitle: 'Chicken Stir Fry',
    recipeImage: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
  },
  // Dans 2 jours
  {
    id: 7,
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // Dans 2 jours
    mealType: 'BREAKFAST' as MealType,
    recipeId: 3,
    recipeTitle: 'Avocado Toast',
    recipeImage: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
  },
  {
    id: 8,
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // Dans 2 jours
    mealType: 'LUNCH' as MealType,
    recipeId: 4,
    recipeTitle: 'Beef Tacos',
    recipeImage: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400',
  },
  {
    id: 9,
    date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // Dans 2 jours
    mealType: 'DINNER' as MealType,
    recipeId: 1,
    recipeTitle: 'Pasta Carbonara',
    recipeImage: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
  },
  // Dans 3 jours
  {
    id: 10,
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // Dans 3 jours
    mealType: 'BREAKFAST' as MealType,
    recipeId: 6,
    recipeTitle: 'French Omelette',
    recipeImage: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',
  },
  {
    id: 11,
    date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], // Dans 3 jours
    mealType: 'DINNER' as MealType,
    recipeId: 2,
    recipeTitle: 'Chicken Stir Fry',
    recipeImage: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
  },
  // Dans 4 jours
  {
    id: 12,
    date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0], // Dans 4 jours
    mealType: 'BREAKFAST' as MealType,
    recipeId: 3,
    recipeTitle: 'Avocado Toast',
    recipeImage: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
  },
  {
    id: 13,
    date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0], // Dans 4 jours
    mealType: 'LUNCH' as MealType,
    recipeId: 5,
    recipeTitle: 'Greek Salad',
    recipeImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
  },
  {
    id: 14,
    date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0], // Dans 4 jours
    mealType: 'DINNER' as MealType,
    recipeId: 4,
    recipeTitle: 'Beef Tacos',
    recipeImage: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400',
  },
  // Dans 5 jours
  {
    id: 15,
    date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // Dans 5 jours
    mealType: 'BREAKFAST' as MealType,
    recipeId: 6,
    recipeTitle: 'French Omelette',
    recipeImage: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400',
  },
  {
    id: 16,
    date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // Dans 5 jours
    mealType: 'LUNCH' as MealType,
    recipeId: 2,
    recipeTitle: 'Chicken Stir Fry',
    recipeImage: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
  },
  {
    id: 17,
    date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0], // Dans 5 jours
    mealType: 'SNACK' as MealType,
    recipeId: 3,
    recipeTitle: 'Avocado Toast',
    recipeImage: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
  },
  // Dans 6 jours
  {
    id: 18,
    date: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0], // Dans 6 jours
    mealType: 'BREAKFAST' as MealType,
    recipeId: 3,
    recipeTitle: 'Avocado Toast',
    recipeImage: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400',
  },
  {
    id: 19,
    date: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0], // Dans 6 jours
    mealType: 'LUNCH' as MealType,
    recipeId: 5,
    recipeTitle: 'Greek Salad',
    recipeImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
  },
  {
    id: 20,
    date: new Date(Date.now() + 86400000 * 6).toISOString().split('T')[0], // Dans 6 jours
    mealType: 'DINNER' as MealType,
    recipeId: 1,
    recipeTitle: 'Pasta Carbonara',
    recipeImage: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
  },
];

// Fonction pour récupérer tous les meal plans
export const getLocalMealPlans = () => localMealPlans;

// Fonction pour ajouter un meal plan
export const addLocalMealPlan = (mealPlan: MealPlan) => {
  localMealPlans.push(mealPlan);
};

// Fonction pour mettre à jour un meal plan
export const updateLocalMealPlan = (id: number, updatedMealPlan: Partial<MealPlan>) => {
  const index = localMealPlans.findIndex((mp) => mp.id === id);
  if (index !== -1) {
    localMealPlans[index] = { ...localMealPlans[index], ...updatedMealPlan };
  }
};

// Fonction pour supprimer un meal plan
export const deleteLocalMealPlan = (id: number) => {
  localMealPlans = localMealPlans.filter((mp) => mp.id !== id);
};

// Fonction pour récupérer les meal plans par date
export const getMealPlansByDate = (date: string) => {
  return localMealPlans.filter((mp) => mp.date === date);
};

// Fonction pour récupérer les meal plans pour une plage de dates
export const getMealPlansForDateRange = (startDate: string, endDate: string) => {
  return localMealPlans.filter((mp) => mp.date >= startDate && mp.date <= endDate);
};
