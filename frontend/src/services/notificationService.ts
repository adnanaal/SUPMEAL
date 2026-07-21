import { apiClient } from '@/lib/api';

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  cookbookId?: number;
  cookbookName?: string;
  recipeId?: number;
  recipeName?: string;
  messageId?: number;
  commentId?: number;
  link?: string;
  createdAt: string;
}

export const notificationService = {
  // Récupérer toutes les notifications pour l'utilisateur courant
  getNotifications: async (): Promise<Notification[]> => {
    return apiClient.get<Notification[]>('/notifications');
  },

  // Marquer une notification comme lue
  markAsRead: async (notificationId: number): Promise<void> => {
    await apiClient.put(`/notifications/${notificationId}/read`);
  },

  // Supprimer une notification
  deleteNotification: async (notificationId: number): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}`);
  },
};
