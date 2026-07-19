import { apiClient } from '@/lib/api';

export interface Message {
  id: number;
  content: string;
  senderId: number;
  senderFirstname?: string;
  senderLastname?: string;
  receiverId: number;
  cookbookId: number;
  createdAt: string;
}

export const messageService = {
  // Récupérer tous les messages
  async getAllMessages(): Promise<Message[]> {
    return apiClient.get<Message[]>('/messages');
  },

  // Récupérer les messages d'un cookbook
  async getMessagesByCookbook(cookbookId: number): Promise<Message[]> {
    return apiClient.get<Message[]>(`/messages/cookbook/${cookbookId}`);
  },

  // Créer un message
  async createMessage(data: { content: string; receiverId: number; cookbookId: number }): Promise<Message> {
    return apiClient.post<Message>('/messages', data);
  },

  // Mettre à jour un message
  async updateMessage(id: number, data: { content: string }): Promise<Message> {
    return apiClient.put<Message>(`/messages/${id}`, data);
  },

  // Supprimer un message
  async deleteMessage(id: number): Promise<void> {
    return apiClient.delete<void>(`/messages/${id}`);
  },
};
