'use client';

import { useEffect, useState } from 'react';
import { Recipe, CreateRecipeData, MealType } from '@/types';
import { RecipeList } from '@/components/dashboard/RecipeList';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { SearchBar } from '@/components/layout/SearchBar';
import { RecipeFilters, RecipeFilterValues } from '@/components/recipes/RecipeFilters';
import { CreateRecipeButton } from '@/components/recipes/CreateRecipeButton';
import { ImportFromUrlModal } from '@/components/recipes/ImportFromUrlModal';
import { CreateRecipeModal } from '@/components/recipes/CreateRecipeModal';
import { getLocalRecipes, addLocalRecipe } from '@/lib/localRecipes';
import { apiClient } from '@/lib/api';

export function Recipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(getLocalRecipes());
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(getLocalRecipes());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredRecipes(recipes);
      return;
    }

    const filtered = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(query.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(query.toLowerCase()) ||
      recipe.tags?.some((tag) => tag.name.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredRecipes(filtered);
  };

  const handleFilterChange = (filters: RecipeFilterValues) => {
    let filtered = [...recipes];

    if (filters.category) {
      filtered = filtered.filter((recipe) => 
        recipe.mealType === filters.category!.toUpperCase()
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((recipe) =>
        recipe.tags?.some((tag) => filters.tags!.includes(tag.name))
      );
    }

    if (filters.ingredients && filters.ingredients.length > 0) {
      // Pour l'instant, on filtre par description (sera amélioré avec la base de données)
      filtered = filtered.filter((recipe) =>
        filters.ingredients!.some((ingredient) =>
          recipe.description?.toLowerCase().includes(ingredient.toLowerCase())
        )
      );
    }

    setFilteredRecipes(filtered);
  };

  const handleImportFromUrl = async (url: string) => {
    try {
      // Simuler l'import depuis URL (sera remplacé par l'API backend)
      // Pour l'instant, on crée une recette avec des données basées sur l'URL
      const importedRecipe: Recipe = {
        id: Date.now(),
        title: `Imported Recipe from ${new URL(url).hostname}`,
        description: 'Recipe imported from URL. Please edit to add details.',
        preparationTime: 30,
        cookingTime: 20,
        servings: 4,
        imagePath: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800',
        source: url,
        mealType: MealType.DINNER,
        tags: [
          { id: Date.now(), name: 'Imported', createdAt: new Date().toISOString() },
        ],
        ingredients: [
          { id: Date.now() + 1, name: 'Ingredient 1', quantity: 1, unit: 'cup' },
          { id: Date.now() + 2, name: 'Ingredient 2', quantity: 2, unit: 'tbsp' },
        ],
        steps: [
          { id: Date.now() + 3, stepOrder: 1, instruction: 'Step 1: Prepare ingredients.' },
          { id: Date.now() + 4, stepOrder: 2, instruction: 'Step 2: Cook according to recipe.' },
          { id: Date.now() + 5, stepOrder: 3, instruction: 'Step 3: Serve and enjoy.' },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Ajouter la recette aux données locales
      addLocalRecipe(importedRecipe);
      
      // Mettre à jour l'état local
      setRecipes(getLocalRecipes());
      setFilteredRecipes(getLocalRecipes());

      console.log('Recipe imported from URL:', url);

      // TODO: Quand connecté au backend, utiliser l'API
      // const importedRecipe = await apiClient.post('/recipes/import', { url });
      // addLocalRecipe(importedRecipe);
      // setRecipes(getLocalRecipes());
      // setFilteredRecipes(getLocalRecipes());
    } catch (err) {
      console.error('Failed to import recipe:', err);
      throw err;
    }
  };

  const handleCreateManual = async (data: CreateRecipeData & { addToMealPlanning?: boolean; plannedDate?: string; plannedMealType?: MealType }) => {
    try {
      // Créer la recette manuellement (données locales)
      const newRecipe: Recipe = {
        id: Date.now(), // ID temporaire
        title: data.title,
        description: data.description || '',
        preparationTime: data.preparationTime,
        cookingTime: data.cookingTime,
        servings: data.servings,
        imagePath: data.imagePath,
        source: data.source || '',
        mealType: data.mealType || MealType.DINNER,
        tags: (data.tags || []).map((tag, index) => ({
          id: Date.now() + index,
          name: tag,
          createdAt: new Date().toISOString(),
        })),
        ingredients: (data.ingredients || []).map((ingredient, index) => ({
          id: Date.now() + index,
          name: ingredient,
          quantity: 1,
          unit: '',
          recipeId: Date.now(),
        })),
        steps: (data.steps || []).map((step, index) => ({
          id: Date.now() + index,
          stepOrder: index + 1,
          instruction: step,
          recipeId: Date.now(),
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Ajouter la recette aux données locales
      addLocalRecipe(newRecipe);
      
      // Mettre à jour l'état local
      setRecipes(getLocalRecipes());
      setFilteredRecipes(getLocalRecipes());

      // TODO: Quand connecté au backend, utiliser l'API
      // const createdRecipe = await apiClient.post<Recipe>('/recipes', data);
      // addLocalRecipe(createdRecipe);
      // setRecipes(getLocalRecipes());
      // setFilteredRecipes(getLocalRecipes());
      
      // Ajouter au meal planning si demandé
      if (data.addToMealPlanning && data.plannedDate && data.plannedMealType) {
        console.log('Adding to meal planning:', {
          plannedDate: data.plannedDate,
          mealType: data.plannedMealType,
          recipeId: newRecipe.id,
        });
        // TODO: await apiClient.post('/meal-planning', { ... });
      }
    } catch (err) {
      console.error('Failed to create recipe:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      
      <div className="ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with Search and Create Button */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} placeholder="Search recipes..." />
            </div>
            <CreateRecipeButton
              onImportFromUrl={() => setIsImportModalOpen(true)}
              onCreateManual={() => setIsCreateModalOpen(true)}
            />
          </div>

          {/* Advanced Filters */}
          <div className="mb-6">
            <RecipeFilters onFilterChange={handleFilterChange} recipes={recipes} />
          </div>

          {/* Recipes List */}
          <RecipeList recipes={filteredRecipes} title="All Recipes" />
        </div>
      </div>

      {/* Modals */}
      <ImportFromUrlModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportFromUrl}
      />
      <CreateRecipeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateManual}
      />
    </div>
  );
}
