import { apiClient } from '@/lib/api';
import { MealType } from '@/types';

export interface ShoppingList {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  mealPlanIds: number[];
}

export interface ShoppingListItem {
  id: number;
  shoppingListId: number;
  ingredientName: string;
  quantity: string;
  unit: string;
  checked: boolean;
  sourceMealPlanId?: number;
  sourceRecipeTitle?: string;
  sourceMealType?: MealType;
  sourceDate?: string;
}

export interface ShoppingListCreate {
  name: string;
  description?: string;
  mealPlanIds?: number[];
}

export interface ShoppingListUpdate {
  name?: string;
  description?: string;
  mealPlanIds?: number[];
}

export interface ShoppingListItemCreate {
  shoppingListId: number;
  ingredientName: string;
  quantity: string;
  unit: string;
  checked?: boolean;
  sourceMealPlanId?: number;
  sourceRecipeTitle?: string;
  sourceMealType?: MealType;
  sourceDate?: string;
}

export interface ShoppingListItemUpdate {
  ingredientName?: string;
  quantity?: number;
  unit?: string;
  checked?: boolean;
}

export const shoppingListService = {
  // Récupérer toutes les shopping lists de l'utilisateur
  async getAllShoppingLists(): Promise<ShoppingList[]> {
    return apiClient.get<ShoppingList[]>('/shopping-lists');
  },

  // Récupérer une shopping list par ID
  async getShoppingListById(id: number): Promise<ShoppingList> {
    return apiClient.get<ShoppingList>(`/shopping-lists/${id}`);
  },

  // Créer une nouvelle shopping list
  async createShoppingList(data: ShoppingListCreate): Promise<ShoppingList> {
    return apiClient.post<ShoppingList>('/shopping-lists', data);
  },

  // Mettre à jour une shopping list
  async updateShoppingList(id: number, data: ShoppingListUpdate): Promise<ShoppingList> {
    return apiClient.put<ShoppingList>(`/shopping-lists/${id}`, data);
  },

  // Supprimer une shopping list
  async deleteShoppingList(id: number): Promise<void> {
    return apiClient.delete<void>(`/shopping-lists/${id}`);
  },

  // Récupérer tous les items de shopping list
  async getAllShoppingListItems(): Promise<ShoppingListItem[]> {
    return apiClient.get<ShoppingListItem[]>('/shopping-list-items');
  },

  // Récupérer un item de shopping list par ID
  async getShoppingListItemById(id: number): Promise<ShoppingListItem> {
    return apiClient.get<ShoppingListItem>(`/shopping-list-items/${id}`);
  },

  // Récupérer les items d'une shopping list
  async getShoppingListItemsByShoppingList(shoppingListId: number): Promise<ShoppingListItem[]> {
    return apiClient.get<ShoppingListItem[]>(`/shopping-list-items/shopping-list/${shoppingListId}`);
  },

  // Créer un nouveau item de shopping list
  async createShoppingListItem(data: ShoppingListItemCreate): Promise<ShoppingListItem> {
    return apiClient.post<ShoppingListItem>('/shopping-list-items', data);
  },

  // Mettre à jour un item de shopping list
  async updateShoppingListItem(id: number, data: ShoppingListItemUpdate): Promise<ShoppingListItem> {
    return apiClient.put<ShoppingListItem>(`/shopping-list-items/${id}`, data);
  },

  // Supprimer un item de shopping list
  async deleteShoppingListItem(id: number): Promise<void> {
    return apiClient.delete<void>(`/shopping-list-items/${id}`);
  },
};
