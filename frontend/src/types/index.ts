// Types TypeScript pour l'application SUPMEAL

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  diet?: string;
  allergies?: string[];
  preferredCuisine?: string[];
  defaultPortions?: number;
}

export interface Cookbook {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  members?: CookbookMember[];
}

export interface CookbookMember {
  user_id: string;
  role: 'CREATOR' | 'EDITOR' | 'READER' | 'COMMENTATOR';
  user?: User;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  ingredients: Ingredient[];
  steps: string[];
  prep_time: number;
  cook_time: number;
  portions: number;
  image?: string;
  source?: string;
  is_favorite?: boolean;
  cookbook_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
}

export interface Ingredient {
  name: string;
  quantity: string;
  unit?: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  content: string;
  cookbook_id: string;
  user_id: string;
  user?: User;
  created_at: string;
}

export interface Comment {
  id: string;
  content: string;
  recipe_id: string;
  user_id: string;
  user?: User;
  created_at: string;
}

export interface RecipePlanning {
  recipe_id: string;
  user_id: string;
  planned_date: string;
}

// Types pour les formulaires
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface CreateCookbookData {
  name: string;
  description?: string;
}

export interface CreateRecipeData {
  title: string;
  description?: string;
  ingredients: Ingredient[];
  steps: string[];
  prep_time: number;
  cook_time: number;
  portions: number;
  image?: string;
  source?: string;
  cookbook_id?: string;
  tags?: string[];
}

// Types pour les filtres
export interface RecipeFilters {
  cookbook_id?: string;
  tags?: string[];
  ingredients?: string[];
  max_prep_time?: number;
  max_cook_time?: number;
  favorites_only?: boolean;
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
