export interface ShoppingList {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  mealPlanIds: number[]; // IDs des meal plans inclus dans cette liste
}

export interface ShoppingListItem {
  id: number;
  shoppingListId: number;
  ingredientName: string;
  quantity: number;
  unit: string;
  checked: boolean;
  sourceMealPlanId: number;
  sourceRecipeTitle: string;
  sourceMealType: string;
  sourceDate: string;
}

// Données manuelles temporaires pour shopping lists
let localShoppingLists: ShoppingList[] = [
  {
    id: 1,
    name: 'Weekly Groceries',
    description: 'Ingredients for this week\'s meals',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    mealPlanIds: [1, 2, 3, 4, 5, 6], // IDs des meal plans de cette semaine
  },
  {
    id: 2,
    name: 'Party Supplies',
    description: 'Ingredients for weekend dinner party',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    mealPlanIds: [7, 8, 9],
  },
];

// Données manuelles temporaires pour les items de shopping lists
let localShoppingListItems: ShoppingListItem[] = [
  // Items pour Weekly Groceries
  {
    id: 1,
    shoppingListId: 1,
    ingredientName: 'Avocado',
    quantity: 3,
    unit: 'pieces',
    checked: false,
    sourceMealPlanId: 1,
    sourceRecipeTitle: 'Avocado Toast',
    sourceMealType: 'BREAKFAST',
    sourceDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 2,
    shoppingListId: 1,
    ingredientName: 'Bread',
    quantity: 1,
    unit: 'loaf',
    checked: false,
    sourceMealPlanId: 1,
    sourceRecipeTitle: 'Avocado Toast',
    sourceMealType: 'BREAKFAST',
    sourceDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 3,
    shoppingListId: 1,
    ingredientName: 'Greek Salad ingredients',
    quantity: 1,
    unit: 'set',
    checked: false,
    sourceMealPlanId: 2,
    sourceRecipeTitle: 'Greek Salad',
    sourceMealType: 'LUNCH',
    sourceDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 4,
    shoppingListId: 1,
    ingredientName: 'Pasta',
    quantity: 400,
    unit: 'g',
    checked: false,
    sourceMealPlanId: 3,
    sourceRecipeTitle: 'Pasta Carbonara',
    sourceMealType: 'DINNER',
    sourceDate: new Date().toISOString().split('T')[0],
  },
  {
    id: 5,
    shoppingListId: 1,
    ingredientName: 'Eggs',
    quantity: 12,
    unit: 'pieces',
    checked: false,
    sourceMealPlanId: 3,
    sourceRecipeTitle: 'Pasta Carbonara',
    sourceMealType: 'DINNER',
    sourceDate: new Date().toISOString().split('T')[0],
  },
  // Items pour Party Supplies
  {
    id: 6,
    shoppingListId: 2,
    ingredientName: 'Beef Tacos ingredients',
    quantity: 1,
    unit: 'set',
    checked: false,
    sourceMealPlanId: 7,
    sourceRecipeTitle: 'Beef Tacos',
    sourceMealType: 'LUNCH',
    sourceDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
  },
  {
    id: 7,
    shoppingListId: 2,
    ingredientName: 'Pasta Carbonara ingredients',
    quantity: 1,
    unit: 'set',
    checked: false,
    sourceMealPlanId: 9,
    sourceRecipeTitle: 'Pasta Carbonara',
    sourceMealType: 'DINNER',
    sourceDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
  },
];

// Fonction pour récupérer toutes les shopping lists
export const getLocalShoppingLists = () => localShoppingLists;

// Fonction pour ajouter une shopping list
export const addLocalShoppingList = (shoppingList: ShoppingList) => {
  localShoppingLists.push(shoppingList);
};

// Fonction pour mettre à jour une shopping list
export const updateLocalShoppingList = (id: number, updatedList: Partial<ShoppingList>) => {
  const index = localShoppingLists.findIndex((sl) => sl.id === id);
  if (index !== -1) {
    localShoppingLists[index] = { ...localShoppingLists[index], ...updatedList, updatedAt: new Date().toISOString() };
  }
};

// Fonction pour supprimer une shopping list
export const deleteLocalShoppingList = (id: number) => {
  localShoppingLists = localShoppingLists.filter((sl) => sl.id !== id);
  // Supprimer aussi les items associés
  localShoppingListItems = localShoppingListItems.filter((item) => item.shoppingListId !== id);
};

// Fonction pour récupérer les items d'une shopping list
export const getShoppingListItems = (shoppingListId: number) => {
  return localShoppingListItems.filter((item) => item.shoppingListId === shoppingListId);
};

// Fonction pour ajouter un item à une shopping list
export const addShoppingListItem = (item: ShoppingListItem) => {
  localShoppingListItems.push(item);
};

// Fonction pour mettre à jour un item
export const updateShoppingListItem = (id: number, updatedItem: Partial<ShoppingListItem>) => {
  const index = localShoppingListItems.findIndex((item) => item.id === id);
  if (index !== -1) {
    localShoppingListItems[index] = { ...localShoppingListItems[index], ...updatedItem };
  }
};

// Fonction pour supprimer un item
export const deleteShoppingListItem = (id: number) => {
  localShoppingListItems = localShoppingListItems.filter((item) => item.id !== id);
};

// Fonction pour récupérer une shopping list par ID
export const getShoppingListById = (id: number) => {
  return localShoppingLists.find((sl) => sl.id === id);
};
