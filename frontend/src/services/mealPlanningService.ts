import { apiClient } from '@/lib/api';
import { MealType } from '@/types';

export interface MealPlanning {
  id: number;
  plannedDate: string; // YYYY-MM-DD format
  mealType: MealType;
  userId: number;
  recipeId?: number;
  recipeTitle?: string;
  recipeImage?: string;
  createdAt: string;
}

export interface MealPlanningCreate {
  plannedDate: string;
  mealType: MealType;
  recipeId?: number;
}

export interface MealPlanningUpdate {
  plannedDate?: string;
  mealType?: MealType;
  recipeId?: number;
}

export const mealPlanningService = {
  // Récupérer tous les meal plannings
  async getAllMealPlannings(): Promise<MealPlanning[]> {
    return apiClient.get<MealPlanning[]>('/meal-planning');
  },

  // Récupérer un meal planning par ID
  async getMealPlanningById(id: number): Promise<MealPlanning> {
    return apiClient.get<MealPlanning>(`/meal-planning/${id}`);
  },

  // Récupérer les meal plannings par utilisateur
  async getMealPlanningsByUser(userId: number): Promise<MealPlanning[]> {
    return apiClient.get<MealPlanning[]>(`/meal-planning/user/${userId}`);
  },

  // Récupérer les meal plannings par utilisateur et date
  async getMealPlanningsByUserAndDate(userId: number, date: string): Promise<MealPlanning[]> {
    return apiClient.get<MealPlanning[]>(`/meal-planning/user/${userId}/date/${date}`);
  },

  // Créer un nouveau meal planning
  async createMealPlanning(data: MealPlanningCreate): Promise<MealPlanning> {
    return apiClient.post<MealPlanning>('/meal-planning', data);
  },

  // Mettre à jour un meal planning
  async updateMealPlanning(id: number, data: MealPlanningUpdate): Promise<MealPlanning> {
    return apiClient.put<MealPlanning>(`/meal-planning/${id}`, data);
  },

  // Supprimer un meal planning
  async deleteMealPlanning(id: number): Promise<void> {
    return apiClient.delete<void>(`/meal-planning/${id}`);
  },
};
