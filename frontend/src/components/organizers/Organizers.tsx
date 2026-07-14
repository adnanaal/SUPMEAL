'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, X, Clock, Heart, BookOpen, Tag, ChefHat, Users, Utensils } from 'lucide-react';
import { Recipe } from '@/lib/localRecipes';
import { Cookbook } from '@/lib/localCookbooks';
import { recipeService } from '@/services/recipeService';
import { cookbookService } from '@/services/cookbookService';
import { favoriteService } from '@/services/favoriteService';
import { MealType } from '@/types';

export function Organizers() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [cookbooks, setCookbooks] = useState<Cookbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCookbook, setSelectedCookbook] = useState<number | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [maxPrepTime, setMaxPrepTime] = useState<number | null>(null);
  const [maxCookTime, setMaxCookTime] = useState<number | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [favoriteRecipeIds, setFavoriteRecipeIds] = useState<Set<number>>(new Set());

  // Charger les données au montage
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [recipesData, cookbooksData, favoritesData] = await Promise.all([
          recipeService.getAllRecipes(),
          cookbookService.getAllCookbooks(),
          favoriteService.getAllFavorites(),
        ]);
        setRecipes(recipesData);
        setCookbooks(cookbooksData);
        setFavoriteRecipeIds(new Set(favoritesData));
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Rafraîchir les favoris quand le composant reçoit le focus
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        try {
          const favoritesData = await favoriteService.getAllFavorites();
          setFavoriteRecipeIds(new Set(favoritesData));
        } catch (err) {
          console.error('Failed to refresh favorites:', err);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Extraire tous les tags uniques
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    recipes.forEach((recipe) => {
      recipe.tags?.forEach((tag) => tags.add(tag.name));
    });
    return Array.from(tags).sort();
  }, [recipes]);

  // Extraire tous les ingrédients uniques
  const allIngredients = useMemo(() => {
    const ingredients = new Set<string>();
    recipes.forEach((recipe) => {
      recipe.ingredients?.forEach((ing) => ingredients.add(ing.name));
    });
    return Array.from(ingredients).sort();
  }, [recipes]);

  // Filtrer les recettes
  const filteredRecipes = useMemo(() => {
    console.log('Filtering recipes with selectedMealType:', selectedMealType);
    console.log('All recipes:', recipes.map(r => ({ id: r.id, title: r.title, mealType: r.mealType })));
    
    return recipes.filter((recipe) => {
      // Recherche plein texte
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          recipe.title.toLowerCase().includes(query) ||
          recipe.description?.toLowerCase().includes(query) ||
          recipe.tags?.some((tag) => tag.name.toLowerCase().includes(query)) ||
          recipe.ingredients?.some((ing) => ing.name.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Filtrage par cookbook
      if (selectedCookbook) {
        const cookbook = cookbooks.find((cb) => cb.id === selectedCookbook);
        if (!cookbook || !cookbook.recipeIds.includes(recipe.id)) return false;
      }

      // Filtrage par meal type
      if (selectedMealType && recipe.mealType !== selectedMealType) {
        console.log('Meal type filter:', selectedMealType, 'Recipe meal type:', recipe.mealType, 'Match:', recipe.mealType === selectedMealType);
        return false;
      }

      // Filtrage par tags
      if (selectedTags.size > 0) {
        const recipeTagNames = new Set(recipe.tags?.map((tag) => tag.name) || []);
        const hasAllTags = Array.from(selectedTags).every((tag) => recipeTagNames.has(tag));
        if (!hasAllTags) return false;
      }

      // Filtrage par ingrédients
      if (selectedIngredients.size > 0) {
        const recipeIngredientNames = new Set(recipe.ingredients?.map((ing) => ing.name) || []);
        const hasAllIngredients = Array.from(selectedIngredients).every((ing) =>
          recipeIngredientNames.has(ing)
        );
        if (!hasAllIngredients) return false;
      }

      // Filtrage par temps de préparation
      if (maxPrepTime !== null && recipe.preparationTime && recipe.preparationTime > maxPrepTime) {
        return false;
      }

      // Filtrage par temps de cuisson
      if (maxCookTime !== null && recipe.cookingTime && recipe.cookingTime > maxCookTime) {
        return false;
      }

      // Filtrage par favoris
      if (favoritesOnly && !favoriteRecipeIds.has(recipe.id)) {
        return false;
      }

      return true;
    });
  }, [
    recipes,
    searchQuery,
    selectedCookbook,
    selectedMealType,
    selectedTags,
    selectedIngredients,
    maxPrepTime,
    maxCookTime,
    favoritesOnly,
    favoriteRecipeIds,
    cookbooks,
  ]);

  const toggleTag = (tag: string) => {
    const newTags = new Set(selectedTags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setSelectedTags(newTags);
  };

  const toggleIngredient = (ingredient: string) => {
    const newIngredients = new Set(selectedIngredients);
    if (newIngredients.has(ingredient)) {
      newIngredients.delete(ingredient);
    } else {
      newIngredients.add(ingredient);
    }
    setSelectedIngredients(newIngredients);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCookbook(null);
    setSelectedMealType('');
    setSelectedTags(new Set());
    setSelectedIngredients(new Set());
    setMaxPrepTime(null);
    setMaxCookTime(null);
    setFavoritesOnly(false);
  };

  const activeFiltersCount =
    (selectedCookbook ? 1 : 0) +
    (selectedMealType ? 1 : 0) +
    selectedTags.size +
    selectedIngredients.size +
    (maxPrepTime ? 1 : 0) +
    (maxCookTime ? 1 : 0) +
    (favoritesOnly ? 1 : 0);

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
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Heart className="w-6 h-6 text-orange-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Organizers</h1>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            showFilters ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes by title, description, tags, or ingredients..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-orange-600 hover:text-orange-700"
            >
              Clear All
            </button>
          </div>

          {/* Ingredients Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <ChefHat className="w-4 h-4 inline mr-1" />
              Ingredients
            </label>
            <div className="flex flex-wrap gap-2">
              {allIngredients.map((ingredient) => (
                <button
                  key={ingredient}
                  onClick={() => toggleIngredient(ingredient)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedIngredients.has(ingredient)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {ingredient}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.has(tag)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Favorites Toggle */}
          <div className="mt-4 flex items-center space-x-3">
            <input
              type="checkbox"
              id="favorites"
              checked={favoritesOnly}
              onChange={(e) => setFavoritesOnly(e.target.checked)}
              className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
            />
            <label htmlFor="favorites" className="flex items-center space-x-2 cursor-pointer">
              <Heart className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Favorites Only</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Cookbook Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BookOpen className="w-4 h-4 inline mr-1" />
                Cookbook
              </label>
              <select
                value={selectedCookbook || ''}
                onChange={(e) => setSelectedCookbook(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="">All Cookbooks</option>
                {cookbooks.map((cookbook) => (
                  <option key={cookbook.id} value={cookbook.id}>
                    {cookbook.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Meal Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Utensils className="w-4 h-4 inline mr-1" />
                Meal Type
              </label>
              <select
                value={selectedMealType}
                onChange={(e) => {
                  console.log('Select onChange value:', e.target.value);
                  setSelectedMealType(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="">All Meal Types</option>
                <option value={MealType.BREAKFAST}>Breakfast</option>
                <option value={MealType.LUNCH}>Lunch</option>
                <option value={MealType.DINNER}>Dinner</option>
                <option value={MealType.SNACK}>Snack</option>
              </select>
            </div>

            {/* Preparation Time Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Max Preparation Time (min)
              </label>
              <input
                type="number"
                value={maxPrepTime || ''}
                onChange={(e) => setMaxPrepTime(e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Any"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Cooking Time Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ChefHat className="w-4 h-4 inline mr-1" />
                Max Cooking Time (min)
              </label>
              <input
                type="number"
                value={maxCookTime || ''}
                onChange={(e) => setMaxCookTime(e.target.value ? parseInt(e.target.value) : null)}
                placeholder="Any"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
        </p>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-orange-600 hover:text-orange-700 flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => router.push(`/dashboard/recipes/${recipe.id}`)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            >
              {recipe.imagePath && (
                <img
                  src={recipe.imagePath}
                  alt={recipe.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                {recipe.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{recipe.description}</p>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {recipe.preparationTime && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {recipe.preparationTime} min
                    </div>
                  )}
                  {recipe.servings && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {recipe.servings}
                    </div>
                  )}
                </div>
                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
