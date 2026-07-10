import { Recipe } from '@/types';

// Données manuelles temporaires (seront remplacées par l'API)
let localRecipes: Recipe[] = [
  {
    id: 1,
    title: 'Pasta Carbonara',
    description: 'Classic Italian pasta dish with eggs, cheese, pancetta, and black pepper.',
    preparationTime: 20,
    cookingTime: 15,
    servings: 4,
    imagePath: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
    source: 'Italian Cuisine',
    mealType: 'DINNER' as any,
    tags: [
      { id: 1, name: 'Italian', createdAt: '2024-01-01' },
      { id: 2, name: 'Quick', createdAt: '2024-01-01' },
    ],
    ingredients: [
      { id: 1, name: 'Spaghetti', quantity: 400, unit: 'g' },
      { id: 2, name: 'Pancetta', quantity: 150, unit: 'g' },
      { id: 3, name: 'Eggs', quantity: 4, unit: '' },
      { id: 4, name: 'Parmesan cheese', quantity: 100, unit: 'g' },
      { id: 5, name: 'Black pepper', quantity: 1, unit: 'tsp' },
    ],
    steps: [
      { id: 1, stepOrder: 1, instruction: 'Cook spaghetti in salted boiling water until al dente.' },
      { id: 2, stepOrder: 2, instruction: 'Fry pancetta in a pan until crispy.' },
      { id: 3, stepOrder: 3, instruction: 'Beat eggs with grated parmesan cheese.' },
      { id: 4, stepOrder: 4, instruction: 'Mix hot pasta with pancetta, then add egg mixture.' },
      { id: 5, stepOrder: 5, instruction: 'Season with black pepper and serve immediately.' },
    ],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 2,
    title: 'Chicken Stir Fry',
    description: 'Quick and healthy Asian-style stir fry with vegetables and chicken.',
    preparationTime: 15,
    cookingTime: 10,
    servings: 2,
    imagePath: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800',
    source: 'Asian Cuisine',
    mealType: 'DINNER' as any,
    tags: [
      { id: 3, name: 'Asian', createdAt: '2024-01-01' },
      { id: 4, name: 'Healthy', createdAt: '2024-01-01' },
    ],
    ingredients: [
      { id: 6, name: 'Chicken breast', quantity: 300, unit: 'g' },
      { id: 7, name: 'Bell peppers', quantity: 2, unit: '' },
      { id: 8, name: 'Broccoli', quantity: 200, unit: 'g' },
      { id: 9, name: 'Soy sauce', quantity: 2, unit: 'tbsp' },
      { id: 10, name: 'Ginger', quantity: 1, unit: 'tsp' },
    ],
    steps: [
      { id: 11, stepOrder: 1, instruction: 'Cut chicken into bite-sized pieces.' },
      { id: 12, stepOrder: 2, instruction: 'Stir fry chicken until golden brown.' },
      { id: 13, stepOrder: 3, instruction: 'Add vegetables and stir fry for 3-4 minutes.' },
      { id: 14, stepOrder: 4, instruction: 'Add soy sauce and ginger, mix well.' },
      { id: 15, stepOrder: 5, instruction: 'Serve hot with rice.' },
    ],
    createdAt: '2024-01-02',
    updatedAt: '2024-01-02',
  },
  {
    id: 3,
    title: 'Avocado Toast',
    description: 'Simple and nutritious breakfast with mashed avocado on toast.',
    preparationTime: 5,
    cookingTime: 0,
    servings: 1,
    imagePath: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800',
    source: 'Healthy Breakfast',
    mealType: 'BREAKFAST' as any,
    tags: [
      { id: 5, name: 'Healthy', createdAt: '2024-01-01' },
      { id: 6, name: 'Vegetarian', createdAt: '2024-01-01' },
    ],
    ingredients: [
      { id: 16, name: 'Bread', quantity: 2, unit: 'slices' },
      { id: 17, name: 'Avocado', quantity: 1, unit: '' },
      { id: 18, name: 'Lemon juice', quantity: 1, unit: 'tbsp' },
      { id: 19, name: 'Salt', quantity: 1, unit: 'pinch' },
      { id: 20, name: 'Red pepper flakes', quantity: 1, unit: 'tsp' },
    ],
    steps: [
      { id: 21, stepOrder: 1, instruction: 'Toast the bread until golden.' },
      { id: 22, stepOrder: 2, instruction: 'Mash avocado with lemon juice and salt.' },
      { id: 23, stepOrder: 3, instruction: 'Spread avocado on toast.' },
      { id: 24, stepOrder: 4, instruction: 'Sprinkle with red pepper flakes.' },
    ],
    createdAt: '2024-01-03',
    updatedAt: '2024-01-03',
  },
];

// Fonction pour mettre à jour une recette dans les données locales
export const updateLocalRecipe = (updatedRecipe: Recipe) => {
  const index = localRecipes.findIndex((r) => r.id === updatedRecipe.id);
  if (index !== -1) {
    localRecipes[index] = updatedRecipe;
  }
};

// Fonction pour ajouter une recette dans les données locales
export const addLocalRecipe = (newRecipe: Recipe) => {
  localRecipes.push(newRecipe);
};

// Fonction pour récupérer les recettes locales
export const getLocalRecipes = () => localRecipes;

// Fonction pour récupérer une recette par ID
export const getLocalRecipeById = (id: number) => {
  return localRecipes.find((r) => r.id === id);
};
