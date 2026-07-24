'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Filter, X, Clock, Heart, BookOpen, Tag, ChefHat, Users, Utensils } from 'lucide-react';
import { Recipe, Cookbook, Tag as TagType, Ingredient } from '@/types';
import { cookbookService } from '@/services/cookbookService';
import { favoriteService } from '@/services/favoriteService';
import { MealType } from '@/types';
import { recipeService } from '@/services/recipeService';
import { useLanguage } from '@/contexts/LanguageContext';

// Types d'union pour tags et ingredients
type TagOrString = string | TagType;
type IngredientOrString = string | Ingredient;

export function Organizers() {
  const router = useRouter();
  const { t } = useLanguage();
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
        setError(t('organizersError'));
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
      if (recipe.tags) {
        recipe.tags.forEach((tag) => {
          const tagName = typeof tag === 'string' ? tag : tag.name;
          tags.add(tagName);
        });
      }
    });
    return Array.from(tags).sort();
  }, [recipes]);

  // Extraire tous les ingrédients uniques
  const allIngredients = useMemo(() => {
    const ingredients = new Set<string>();
    recipes.forEach((recipe) => {
      if (recipe.ingredients) {
        recipe.ingredients.forEach((ing) => {
          const ingName = typeof ing === 'string' ? ing : ing.name;
          ingredients.add(ingName);
        });
      }
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
          recipe.tags?.some((tag) => {
            const tagName = typeof tag === 'string' ? tag : tag.name;
            return tagName.toLowerCase().includes(query);
          }) ||
          recipe.ingredients?.some((ing) => {
            const ingName = typeof ing === 'string' ? ing : ing.name;
            return ingName.toLowerCase().includes(query);
          });
        if (!matchesSearch) return false;
      }

      // Filtrage par cookbook
      if (selectedCookbook) {
        const cookbook = cookbooks.find((cb) => cb.id === selectedCookbook);
        if (!cookbook || !cookbook.recipeIds?.includes(recipe.id)) return false;
      }

      // Filtrage par meal type
      if (selectedMealType && recipe.mealType !== selectedMealType) {
        console.log('Meal type filter:', selectedMealType, 'Recipe meal type:', recipe.mealType, 'Match:', recipe.mealType === selectedMealType);
        return false;
      }

      // Filtrage par tags
      if (selectedTags.size > 0) {
        const recipeTagNames = recipe.tags?.map((tag) => typeof tag === 'string' ? tag : tag.name) || [];
        const hasAllTags = Array.from(selectedTags).every((tag) => recipeTagNames.includes(tag));
        if (!hasAllTags) return false;
      }

      // Filtrage par ingrédients
      if (selectedIngredients.size > 0) {
        const recipeIngredientNames = recipe.ingredients?.map((ing) => typeof ing === 'string' ? ing : ing.name) || [];
        const hasAllIngredients = Array.from(selectedIngredients).every((ing) =>
          recipeIngredientNames.includes(ing)
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
          <h1 className="text-2xl font-bold text-gray-900">{t('organizersTitle')}</h1>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            showFilters ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-5 h-5" />
          <span>{t('filters')} {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
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
            placeholder={t('searchRecipesPlaceholder')}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('filters')}</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
            >
              {t('clearAll')}
            </button>
          </div>

          {/* Ingredients Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <ChefHat className="w-4 h-4 inline mr-1" />
              {t('ingredients')}
            </label>
            <div className="flex flex-wrap gap-2">
              {allIngredients.map((ingredient) => (
                <button
                  key={ingredient}
                  onClick={() => toggleIngredient(ingredient)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedIngredients.has(ingredient)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {ingredient}
                </button>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              {t('tags')}
            </label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedTags.has(tag)
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
              <Heart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('favoritesOnly')}</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Cookbook Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <BookOpen className="w-4 h-4 inline mr-1" />
                {t('cookbook')}
              </label>
              <select
                value={selectedCookbook || ''}
                onChange={(e) => setSelectedCookbook(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="">{t('allCookbooks')}</option>
                {cookbooks.map((cookbook) => (
                  <option key={cookbook.id} value={cookbook.id}>
                    {cookbook.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Meal Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Utensils className="w-4 h-4 inline mr-1" />
                {t('mealType')}
              </label>
              <select
                value={selectedMealType}
                onChange={(e) => {
                  console.log('Select onChange value:', e.target.value);
                  setSelectedMealType(e.target.value);
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              >
                <option value="">{t('allMealTypes')}</option>
                <option value={MealType.BREAKFAST}>{t('breakfast')}</option>
                <option value={MealType.LUNCH}>{t('lunch')}</option>
                <option value={MealType.DINNER}>{t('dinner')}</option>
                <option value={MealType.SNACK}>{t('snack')}</option>
              </select>
            </div>

            {/* Preparation Time Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                {t('maxPrepTime')}
              </label>
              <input
                type="number"
                value={maxPrepTime || ''}
                onChange={(e) => setMaxPrepTime(e.target.value ? parseInt(e.target.value) : null)}
                placeholder={t('any')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Cooking Time Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <ChefHat className="w-4 h-4 inline mr-1" />
                {t('maxCookTime')}
              </label>
              <input
                type="number"
                value={maxCookTime || ''}
                onChange={(e) => setMaxCookTime(e.target.value ? parseInt(e.target.value) : null)}
                placeholder={t('any')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredRecipes.length} {t('recipesFound')}
        </p>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-orange-600 hover:text-orange-700 flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>{t('clearFilters')}</span>
          </button>
        )}
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noRecipesFound')}</h3>
          <p className="text-gray-500 mb-4">{t('tryAdjustingFilters')}</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            {t('clearFilters')}
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
                      {recipe.preparationTime} {t('minutes')}
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
                    {recipe.tags.slice(0, 3).map((tag, index) => {
                      const tagName = typeof tag === 'string' ? tag : tag.name;
                      const tagKey = typeof tag === 'string' ? tag : tag.id || index;
                      return (
                        <span
                          key={tagKey}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tagName}
                        </span>
                      );
                    })}
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
