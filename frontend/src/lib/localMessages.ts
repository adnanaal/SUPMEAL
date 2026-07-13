import { User } from '@/types';

// Types pour les messages de cookbook
export interface CookbookMessage {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  cookbookId: number;
  userId: number;
  user?: User;
}

// Types pour les commentaires de recette
export interface RecipeComment {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  cookbookId: number;
  recipeId: number;
  userId: number;
  user?: User;
}

// Données manuelles temporaires pour les messages de cookbook
let localCookbookMessages: CookbookMessage[] = [
  {
    id: 1,
    content: 'Hey everyone! I just added a new pasta recipe to the cookbook. Check it out!',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    cookbookId: 1,
    userId: 2,
    user: {
      id: 2,
      firstname: 'Alice',
      lastname: 'Johnson',
      email: 'alice@example.com',
      isVerified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  },
  {
    id: 2,
    content: 'That sounds delicious! I love pasta dishes. Thanks for sharing!',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    cookbookId: 1,
    userId: 3,
    user: {
      id: 3,
      firstname: 'Bob',
      lastname: 'Smith',
      email: 'bob@example.com',
      isVerified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  },
  {
    id: 3,
    content: 'Has anyone tried the carbonara recipe? I want to know if it\'s worth making for dinner tonight.',
    createdAt: new Date(Date.now() - 600000).toISOString(),
    updatedAt: new Date(Date.now() - 600000).toISOString(),
    cookbookId: 1,
    userId: 4,
    user: {
      id: 4,
      firstname: 'Carol',
      lastname: 'Williams',
      email: 'carol@example.com',
      isVerified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  },
];

// Données manuelles temporaires pour les commentaires de recette
let localRecipeComments: RecipeComment[] = [
  {
    id: 1,
    content: 'This recipe is amazing! My family loved it. I added a bit more garlic and it was perfect.',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    cookbookId: 1,
    recipeId: 1,
    userId: 2,
    user: {
      id: 2,
      firstname: 'Alice',
      lastname: 'Johnson',
      email: 'alice@example.com',
      isVerified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  },
  {
    id: 2,
    content: 'I made this last night and it was delicious! The timing was perfect.',
    createdAt: new Date(Date.now() - 5400000).toISOString(),
    updatedAt: new Date(Date.now() - 5400000).toISOString(),
    cookbookId: 1,
    recipeId: 1,
    userId: 3,
    user: {
      id: 3,
      firstname: 'Bob',
      lastname: 'Smith',
      email: 'bob@example.com',
      isVerified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  },
  {
    id: 3,
    content: 'Great recipe! I substituted the pancetta with bacon and it still turned out great.',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    cookbookId: 1,
    recipeId: 2,
    userId: 4,
    user: {
      id: 4,
      firstname: 'Carol',
      lastname: 'Williams',
      email: 'carol@example.com',
      isVerified: true,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  },
];

// Fonctions pour les messages de cookbook
export const getCookbookMessages = (cookbookId: number): CookbookMessage[] => {
  return localCookbookMessages
    .filter((msg) => msg.cookbookId === cookbookId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

export const addCookbookMessage = (message: Omit<CookbookMessage, 'id' | 'createdAt' | 'updatedAt'>): CookbookMessage => {
  const newMessage: CookbookMessage = {
    ...message,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  localCookbookMessages.push(newMessage);
  return newMessage;
};

export const updateCookbookMessage = (messageId: number, content: string): CookbookMessage | null => {
  const index = localCookbookMessages.findIndex((msg) => msg.id === messageId);
  if (index !== -1) {
    localCookbookMessages[index].content = content;
    localCookbookMessages[index].updatedAt = new Date().toISOString();
    return localCookbookMessages[index];
  }
  return null;
};

export const deleteCookbookMessage = (messageId: number): boolean => {
  const index = localCookbookMessages.findIndex((msg) => msg.id === messageId);
  if (index !== -1) {
    localCookbookMessages.splice(index, 1);
    return true;
  }
  return false;
};

// Fonctions pour les commentaires de recette
export const getRecipeComments = (cookbookId: number, recipeId: number): RecipeComment[] => {
  return localRecipeComments
    .filter((comment) => comment.cookbookId === cookbookId && comment.recipeId === recipeId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

export const addRecipeComment = (comment: Omit<RecipeComment, 'id' | 'createdAt' | 'updatedAt'>): RecipeComment => {
  const newComment: RecipeComment = {
    ...comment,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  localRecipeComments.push(newComment);
  return newComment;
};

export const updateRecipeComment = (commentId: number, content: string): RecipeComment | null => {
  const index = localRecipeComments.findIndex((comment) => comment.id === commentId);
  if (index !== -1) {
    localRecipeComments[index].content = content;
    localRecipeComments[index].updatedAt = new Date().toISOString();
    return localRecipeComments[index];
  }
  return null;
};

export const deleteRecipeComment = (commentId: number): boolean => {
  const index = localRecipeComments.findIndex((comment) => comment.id === commentId);
  if (index !== -1) {
    localRecipeComments.splice(index, 1);
    return true;
  }
  return false;
};
