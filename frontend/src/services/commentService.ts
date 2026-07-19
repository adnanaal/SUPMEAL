import { apiClient } from '@/lib/api';
import { Comment } from '@/types';

export const commentService = {
  // Récupérer tous les commentaires
  async getAllComments(): Promise<Comment[]> {
    return apiClient.get<Comment[]>('/comments');
  },

  // Récupérer les commentaires d'une recette
  async getCommentsByRecipe(recipeId: number): Promise<Comment[]> {
    return apiClient.get<Comment[]>(`/comments/recipe/${recipeId}`);
  },

  // Créer un commentaire
  async createComment(data: { content: string; recipeId: number }): Promise<Comment> {
    return apiClient.post<Comment>('/comments', data);
  },

  // Mettre à jour un commentaire
  async updateComment(id: number, data: { content: string }): Promise<Comment> {
    return apiClient.put<Comment>(`/comments/${id}`, data);
  },

  // Supprimer un commentaire
  async deleteComment(id: number): Promise<void> {
    return apiClient.delete<void>(`/comments/${id}`);
  },
};
