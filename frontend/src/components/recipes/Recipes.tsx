'use client';

import { useEffect, useState } from 'react';
import { Recipe, CreateRecipeData, MealType } from '@/types';
import { RecipeList } from '@/components/dashboard/RecipeList';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { SearchBar } from '@/components/layout/SearchBar';
import { CreateRecipeButton } from '@/components/recipes/CreateRecipeButton';
import { ImportFromUrlModal } from '@/components/recipes/ImportFromUrlModal';
import { CreateRecipeModal } from '@/components/recipes/CreateRecipeModal';
import { recipeService } from '@/services/recipeService';
import { mealPlanningService } from '@/services/mealPlanningService';
import { useLanguage } from '@/contexts/LanguageContext';

export function Recipes() {
  const { t } = useLanguage();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Charger les recettes depuis l'API au montage
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        setLoading(true);
        const data = await recipeService.getAllRecipes();
        setRecipes(data);
        setFilteredRecipes(data);
      } catch (err) {
        console.error('Failed to load recipes:', err);
        setError(t('recipesError'));
      } finally {
        setLoading(false);
      }
    };
    loadRecipes();
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredRecipes(recipes);
      return;
    }

    const filtered = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(query.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(query.toLowerCase()) ||
      recipe.tags?.some((tag) => {
        const tagName = typeof tag === 'string' ? tag : tag.name;
        return tagName.toLowerCase().includes(query.toLowerCase());
      })
    );
    setFilteredRecipes(filtered);
  };

  const handleImportFromUrl = async (data: { url: string; title?: string; mealType?: MealType }) => {
    try {
      const importedRecipe = await recipeService.importFromUrl(data);
      
      // Mettre à jour l'état local
      setRecipes([...recipes, importedRecipe]);
      setFilteredRecipes([...filteredRecipes, importedRecipe]);

      console.log('Recipe imported from URL:', data.url);
    } catch (err) {
      console.error('Failed to import recipe:', err);
      throw err;
    }
  };

  const handleCreateManual = async (data: CreateRecipeData & { addToMealPlanning?: boolean; plannedDate?: string; plannedMealType?: MealType }) => {
    try {
      const createdRecipe = await recipeService.createRecipe(data);
      
      // Mettre à jour l'état local
      setRecipes([...recipes, createdRecipe]);
      setFilteredRecipes([...filteredRecipes, createdRecipe]);
      
      // Ajouter au meal planning si demandé
      if (data.addToMealPlanning && data.plannedDate && data.plannedMealType) {
        console.log('Adding to meal planning:', {
          plannedDate: data.plannedDate,
          mealType: data.plannedMealType,
          recipeId: createdRecipe.id,
        });
        await mealPlanningService.createMealPlanning({
          plannedDate: data.plannedDate,
          mealType: data.plannedMealType,
          recipeId: createdRecipe.id,
        });
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
        {/* Header with Search and Create Button */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex-1">
            <SearchBar onSearch={handleSearch} placeholder={t('searchRecipes')} />
          </div>
          <CreateRecipeButton
            onImportFromUrl={() => setIsImportModalOpen(true)}
            onCreateManual={() => setIsCreateModalOpen(true)}
          />
        </div>

        {/* Recipes List */}
        <RecipeList recipes={filteredRecipes} title={t('allRecipes')} />
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
