import { apiClient } from '@/lib/api';
import { Cookbook } from '@/types';

export const cookbookService = {
  // Récupérer tous les cookbooks
  async getAllCookbooks(): Promise<Cookbook[]> {
    return apiClient.get<Cookbook[]>('/cookbooks');
  },

  // Récupérer un cookbook par ID
  async getCookbookById(id: number): Promise<Cookbook> {
    return apiClient.get<Cookbook>(`/cookbooks/${id}`);
  },

  // Créer un nouveau cookbook
  async createCookbook(data: { name: string; description?: string; coverImage?: string }): Promise<Cookbook> {
    return apiClient.post<Cookbook>('/cookbooks', data);
  },

  // Mettre à jour un cookbook
  async updateCookbook(id: number, data: Partial<Cookbook>): Promise<Cookbook> {
    return apiClient.put<Cookbook>(`/cookbooks/${id}`, data);
  },

  // Supprimer un cookbook
  async deleteCookbook(id: number): Promise<void> {
    return apiClient.delete<void>(`/cookbooks/${id}`);
  },

  // Ajouter une recette à un cookbook
  async addRecipeToCookbook(cookbookId: number, recipeId: number): Promise<void> {
    return apiClient.post<void>(`/cookbooks/${cookbookId}/recipes`, { recipeId });
  },

  // Récupérer les recettes d'un cookbook
  async getCookbookRecipes(cookbookId: number): Promise<Recipe[]> {
    return apiClient.get<Recipe[]>(`/cookbooks/${cookbookId}/recipes`);
  },

  // Supprimer une recette d'un cookbook
  async removeRecipeFromCookbook(cookbookId: number, recipeId: number): Promise<void> {
    return apiClient.delete<void>(`/cookbooks/${cookbookId}/recipes/${recipeId}`);
  },

  // Inviter un membre à un cookbook
  async inviteMember(cookbookId: number, email: string, permission: string): Promise<void> {
    return apiClient.post<void>(`/cookbooks/${cookbookId}/members`, { email, permission });
  },

  // Mettre à jour les permissions d'un membre
  async updateMemberPermission(cookbookId: number, userId: string, permission: string): Promise<void> {
    return apiClient.put<void>(`/cookbooks/${cookbookId}/members/${userId}`, { permission });
  },

  // Supprimer un membre d'un cookbook
  async removeMember(cookbookId: number, userId: number): Promise<void> {
    return apiClient.delete<void>(`/cookbooks/${cookbookId}/members/${userId}`);
  },
};
