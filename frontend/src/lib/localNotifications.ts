import { User } from '@/types';

export enum NotificationType {
  COOKBOOK_MESSAGE = 'COOKBOOK_MESSAGE',
  RECIPE_COMMENT = 'RECIPE_COMMENT',
  COOKBOOK_INVITE = 'COOKBOOK_INVITE',
  MEMBER_ADDED = 'MEMBER_ADDED',
  RECIPE_ADDED = 'RECIPE_ADDED',
}

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  userId: number;
  user?: User;
  // Navigation data
  link?: string;
  cookbookId?: number;
  recipeId?: number;
  messageId?: number;
  commentId?: number;
}

// Données manuelles temporaires pour les notifications
let localNotifications: Notification[] = [
  {
    id: 1,
    type: NotificationType.COOKBOOK_MESSAGE,
    title: 'New message in Italian Family Recipes',
    content: 'Alice Johnson sent a message in the cookbook chat',
    isRead: false,
    createdAt: new Date(Date.now() - 300000).toISOString(),
    userId: 1,
    link: '/dashboard/cookbooks/1',
    cookbookId: 1,
    messageId: 1,
  },
  {
    id: 2,
    type: NotificationType.RECIPE_COMMENT,
    title: 'New comment on Pasta Carbonara',
    content: 'Bob Smith commented on your recipe',
    isRead: false,
    createdAt: new Date(Date.now() - 900000).toISOString(),
    userId: 1,
    link: '/dashboard/cookbooks/1',
    cookbookId: 1,
    recipeId: 1,
    commentId: 2,
  },
  {
    id: 3,
    type: NotificationType.RECIPE_COMMENT,
    title: 'New comment on Chicken Stir Fry',
    content: 'Carol Williams commented on your recipe',
    isRead: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    userId: 1,
    link: '/dashboard/cookbooks/1',
    cookbookId: 1,
    recipeId: 2,
    commentId: 3,
  },
  {
    id: 4,
    type: NotificationType.COOKBOOK_MESSAGE,
    title: 'New message in Italian Family Recipes',
    content: 'Bob Smith sent a message in the cookbook chat',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    userId: 1,
    link: '/dashboard/cookbooks/1',
    cookbookId: 1,
    messageId: 2,
  },
  {
    id: 5,
    type: NotificationType.MEMBER_ADDED,
    title: 'New member in Italian Family Recipes',
    content: 'Carol Williams joined the cookbook',
    isRead: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    userId: 1,
    link: '/dashboard/cookbooks/1',
    cookbookId: 1,
  },
  {
    id: 6,
    type: NotificationType.RECIPE_ADDED,
    title: 'New recipe in Italian Family Recipes',
    content: 'Alice Johnson added "Avocado Toast" to the cookbook',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    userId: 1,
    link: '/dashboard/cookbooks/1',
    cookbookId: 1,
  },
];

// Fonctions pour les notifications
export const getLocalNotifications = (userId: number): Notification[] => {
  return localNotifications
    .filter((notif) => notif.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getUnreadNotifications = (userId: number): Notification[] => {
  return getLocalNotifications(userId).filter((notif) => !notif.isRead);
};

export const markAsRead = (notificationId: number): boolean => {
  const index = localNotifications.findIndex((notif) => notif.id === notificationId);
  if (index !== -1) {
    localNotifications[index].isRead = true;
    return true;
  }
  return false;
};

export const markAllAsRead = (userId: number): boolean => {
  let updated = false;
  localNotifications.forEach((notif) => {
    if (notif.userId === userId && !notif.isRead) {
      notif.isRead = true;
      updated = true;
    }
  });
  return updated;
};

export const addNotification = (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Notification => {
  const newNotification: Notification = {
    ...notification,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    isRead: false,
  };
  localNotifications.push(newNotification);
  return newNotification;
};

export const deleteNotification = (notificationId: number): boolean => {
  const index = localNotifications.findIndex((notif) => notif.id === notificationId);
  if (index !== -1) {
    localNotifications.splice(index, 1);
    return true;
  }
  return false;
};

// Fonctions utilitaires pour créer des notifications spécifiques
export const createCookbookMessageNotification = (
  userId: number,
  cookbookId: number,
  cookbookName: string,
  senderName: string,
  messageId: number
): Notification => {
  return addNotification({
    type: NotificationType.COOKBOOK_MESSAGE,
    title: `New message in ${cookbookName}`,
    content: `${senderName} sent a message in the cookbook chat`,
    userId,
    link: `/dashboard/cookbooks/${cookbookId}`,
    cookbookId,
    messageId,
  });
};

export const createRecipeCommentNotification = (
  userId: number,
  cookbookId: number,
  recipeId: number,
  recipeTitle: string,
  commenterName: string,
  commentId: number
): Notification => {
  return addNotification({
    type: NotificationType.RECIPE_COMMENT,
    title: `New comment on ${recipeTitle}`,
    content: `${commenterName} commented on your recipe`,
    userId,
    link: `/dashboard/cookbooks/${cookbookId}`,
    cookbookId,
    recipeId,
    commentId,
  });
};

export const createCookbookInviteNotification = (
  userId: number,
  cookbookId: number,
  cookbookName: string,
  inviterName: string
): Notification => {
  return addNotification({
    type: NotificationType.COOKBOOK_INVITE,
    title: `Invited to ${cookbookName}`,
    content: `${inviterName} invited you to join this cookbook`,
    userId,
    link: `/dashboard/cookbooks/${cookbookId}`,
    cookbookId,
  });
};

export const createMemberAddedNotification = (
  userId: number,
  cookbookId: number,
  cookbookName: string,
  memberName: string
): Notification => {
  return addNotification({
    type: NotificationType.MEMBER_ADDED,
    title: `New member in ${cookbookName}`,
    content: `${memberName} joined the cookbook`,
    userId,
    link: `/dashboard/cookbooks/${cookbookId}`,
    cookbookId,
  });
};

export const createRecipeAddedNotification = (
  userId: number,
  cookbookId: number,
  cookbookName: string,
  recipeTitle: string,
  adderName: string
): Notification => {
  return addNotification({
    type: NotificationType.RECIPE_ADDED,
    title: `New recipe in ${cookbookName}`,
    content: `${adderName} added "${recipeTitle}" to the cookbook`,
    userId,
    link: `/dashboard/cookbooks/${cookbookId}`,
    cookbookId,
  });
};
