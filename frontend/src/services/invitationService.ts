import { apiClient } from '@/lib/api';

export interface CookbookInvitation {
  id: number;
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  permission: 'OWNER' | 'EDITOR' | 'READER' | 'CREATOR' | 'COMMENTATOR';
  senderId: number;
  senderName: string;
  receiverId: number;
  receiverName: string;
  cookbookId: number;
  cookbookName: string;
  sentAt: string;
}

export interface CreateInvitationRequest {
  receiverId: number;
  cookbookId: number;
  permission: 'OWNER' | 'EDITOR' | 'READER' | 'CREATOR' | 'COMMENTATOR';
}

export const invitationService = {
  // Créer une invitation
  createInvitation: async (request: CreateInvitationRequest): Promise<CookbookInvitation> => {
    return apiClient.post<CookbookInvitation>('/cookbook-invitations', request);
  },

  // Récupérer toutes les invitations pour l'utilisateur courant
  getInvitations: async (): Promise<CookbookInvitation[]> => {
    return apiClient.get<CookbookInvitation[]>('/cookbook-invitations');
  },

  // Récupérer les invitations envoyées par l'utilisateur courant
  getSentInvitations: async (): Promise<CookbookInvitation[]> => {
    return apiClient.get<CookbookInvitation[]>('/cookbook-invitations/sent');
  },

  // Récupérer une invitation par ID
  getInvitationById: async (invitationId: number): Promise<CookbookInvitation> => {
    return apiClient.get<CookbookInvitation>(`/cookbook-invitations/${invitationId}`);
  },

  // Accepter une invitation
  acceptInvitation: async (invitationId: number): Promise<void> => {
    await apiClient.post(`/cookbook-invitations/${invitationId}/accept`);
  },

  // Refuser une invitation
  declineInvitation: async (invitationId: number): Promise<void> => {
    await apiClient.post(`/cookbook-invitations/${invitationId}/decline`);
  },

  // Supprimer une invitation (pour l'expéditeur)
  deleteInvitation: async (invitationId: number): Promise<void> => {
    await apiClient.delete(`/cookbook-invitations/${invitationId}`);
  },
};
