import { apiClient } from '@/lib/api';
import { Recipe, CreateRecipeData, MealType } from '@/types';

export const recipeService = {
  // Récupérer toutes les recettes
  async getAllRecipes(): Promise<Recipe[]> {
    return apiClient.get<Recipe[]>('/recipes');
  },

  // Récupérer une recette par ID
  async getRecipeById(id: number): Promise<Recipe> {
    return apiClient.get<Recipe>(`/recipes/${id}`);
  },

  // Créer une nouvelle recette
  async createRecipe(data: CreateRecipeData): Promise<Recipe> {
    return apiClient.post<Recipe>('/recipes', data);
  },

  // Mettre à jour une recette
  async updateRecipe(id: number, data: Partial<CreateRecipeData>): Promise<Recipe> {
    return apiClient.put<Recipe>(`/recipes/${id}`, data);
  },

  // Supprimer une recette
  async deleteRecipe(id: number): Promise<void> {
    return apiClient.delete<void>(`/recipes/${id}`);
  },

  // Importer une recette depuis une URL
  async importFromUrl(data: { url: string; title?: string; mealType?: MealType }): Promise<Recipe> {
    return apiClient.post<Recipe>('/recipes/import', data);
  },

  // Rechercher des recettes
  async searchRecipes(query: string): Promise<Recipe[]> {
    return apiClient.get<Recipe[]>('/recipes/search', { query });
  },
};
