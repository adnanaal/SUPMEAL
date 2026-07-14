import { apiClient } from '@/lib/api';

export const favoriteService = {
  // Récupérer tous les favoris de l'utilisateur
  async getAllFavorites(): Promise<number[]> {
    return apiClient.get<number[]>('/favorites');
  },

  // Ajouter une recette aux favoris
  async addFavorite(recipeId: number): Promise<void> {
    return apiClient.post<void>('/favorites', { recipeId });
  },

  // Supprimer une recette des favoris
  async removeFavorite(recipeId: number): Promise<void> {
    return apiClient.delete<void>(`/favorites/${recipeId}`);
  },

  // Vérifier si une recette est dans les favoris
  async isFavorite(recipeId: number): Promise<boolean> {
    const favorites = await this.getAllFavorites();
    return favorites.includes(recipeId);
  },
};
