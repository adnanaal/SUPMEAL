// Types TypeScript pour l'application SUPMEAL

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string;
  dietaryPreferences?: string;
  allergies?: string;
  favoriteCuisine?: string;
  defaultServings?: number;
  oauthProvider?: string;
  providerId?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Cookbook {
  id: number;
  name: string;
  description?: string;
  ownerId: number;
  owner?: User;
  ownerFirstname?: string;
  ownerLastname?: string;
  coverImage?: string;
  recipeIds?: number[];
  members?: CookbookMember[];
  createdAt: string;
  updatedAt: string;
}

export interface CookbookMember {
  id: number;
  userId: number;
  user?: User;
  cookbookId: number;
  permission: string;
  joinedAt: string;
  userName?: string;
  userEmail?: string;
}

export enum CookbookPermission {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER',
  CREATOR = 'CREATOR',
  COMMENTATOR = 'COMMENTATOR',
  READER = 'READER'
}

export const PERMISSION_LABELS: Record<string, string> = {
  'OWNER': 'Propriétaire',
  'EDITOR': 'Éditeur',
  'VIEWER': 'Lecteur',
  'CREATOR': 'Créateur',
  'COMMENTATOR': 'Commentateur',
  'READER': 'Lecteur'
};

export const PERMISSION_COLORS: Record<string, string> = {
  'OWNER': 'bg-purple-100 text-purple-800',
  'EDITOR': 'bg-blue-100 text-blue-800',
  'VIEWER': 'bg-gray-100 text-gray-800',
  'CREATOR': 'bg-green-100 text-green-800',
  'COMMENTATOR': 'bg-yellow-100 text-yellow-800',
  'READER': 'bg-gray-100 text-gray-800'
};

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  preparationTime?: number;
  cookingTime?: number;
  servings?: number;
  imagePath?: string;
  source?: string;
  sourceUrl?: string;
  mealType: MealType;
  ownerId?: number;
  owner?: User;
  ingredients?: string[];
  steps?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit?: string;
  recipeId?: number;
}

export interface RecipeStep {
  id: number;
  instruction: string;
  stepOrder: number;
  recipeId?: number;
}

export interface Tag {
  id: number;
  name: string;
  createdAt: string;
}

export interface MealPlanning {
  id: number;
  plannedDate: string;
  mealType: MealType;
  createdAt: string;
  userId: number;
  user?: User;
  recipeId: number;
  recipe?: Recipe;
}

export enum MealType {
  BREAKFAST = "BREAKFAST",
  LUNCH = "LUNCH",
  DINNER = "DINNER",
  SNACK = "SNACK"
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  userId: number;
  user?: User;
  recipeId: number;
  recipe?: Recipe;
}

export interface FavoriteRecipe {
  id: number;
  createdAt: string;
  userId: number;
  user?: User;
  recipeId: number;
  recipe?: Recipe;
}

// Types pour les formulaires
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface CreateCookbookData {
  name: string;
  description?: string;
}

export interface CreateRecipeData {
  title: string;
  description?: string;
  ingredients: string[];
  steps: string[];
  preparationTime?: number;
  cookingTime?: number;
  servings?: number;
  imagePath?: string;
  source?: string;
  mealType: MealType;
  tags?: string[];
}

export interface UpdateRecipeData {
  title?: string;
  description?: string;
  ingredients?: string[];
  steps?: string[];
  preparationTime?: number;
  cookingTime?: number;
  servings?: number;
  imagePath?: string;
  source?: string;
  mealType?: MealType;
  tags?: string[];
}

export interface CreateMealPlanningData {
  plannedDate: string;
  mealType: MealType;
  recipeId: number;
}

// Types pour les filtres
export interface RecipeFilters {
  tags?: string[];
  ingredients?: string[];
  maxPreparationTime?: number;
  maxCookingTime?: number;
  mealType?: MealType;
  search?: string;
}

// Types pour la pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
