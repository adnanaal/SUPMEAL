'use client';

import { useState, useMemo } from 'react';
import { Filter, X, ChevronDown, Plus, Tag as TagIcon, Search } from 'lucide-react';
import { Recipe } from '@/types';

interface RecipeFiltersProps {
  onFilterChange: (filters: RecipeFilterValues) => void;
  recipes: Recipe[];
}

export interface RecipeFilterValues {
  category?: string;
  tags?: string[];
  ingredients?: string[];
}

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export function RecipeFilters({ onFilterChange, recipes }: RecipeFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [tagSearchQuery, setTagSearchQuery] = useState('');

  // Extraire tous les tags uniques des recettes existantes
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    recipes.forEach((recipe) => {
      recipe.tags?.forEach((tag) => tagSet.add(tag.name));
    });
    return Array.from(tagSet).sort();
  }, [recipes]);

  // Extraire tous les ingrédients uniques des recettes existantes
  const availableIngredients = useMemo(() => {
    const ingredientSet = new Set<string>();
    recipes.forEach((recipe) => {
      recipe.ingredients?.forEach((ingredient) => ingredientSet.add(ingredient.name));
    });
    return Array.from(ingredientSet).sort();
  }, [recipes]);

  // Filtrer les tags selon la recherche
  const filteredTags = useMemo(() => {
    if (!tagSearchQuery.trim()) return availableTags;
    return availableTags.filter((tag) =>
      tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
    );
  }, [availableTags, tagSearchQuery]);

  const addTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      const newTags = [...selectedTags, tagInput.trim()];
      setSelectedTags(newTags);
      setTagInput('');
      onFilterChange({ category: selectedCategory, tags: newTags, ingredients: selectedIngredients });
    }
  };

  const removeTag = (tag: string) => {
    const newTags = selectedTags.filter((t) => t !== tag);
    setSelectedTags(newTags);
    onFilterChange({ category: selectedCategory, tags: newTags, ingredients: selectedIngredients });
  };

  const addIngredient = () => {
    if (ingredientInput.trim() && !selectedIngredients.includes(ingredientInput.trim())) {
      const newIngredients = [...selectedIngredients, ingredientInput.trim()];
      setSelectedIngredients(newIngredients);
      setIngredientInput('');
      onFilterChange({ category: selectedCategory, tags: selectedTags, ingredients: newIngredients });
    }
  };

  const removeIngredient = (ingredient: string) => {
    const newIngredients = selectedIngredients.filter((i) => i !== ingredient);
    setSelectedIngredients(newIngredients);
    onFilterChange({ category: selectedCategory, tags: selectedTags, ingredients: newIngredients });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onFilterChange({ category, tags: selectedTags, ingredients: selectedIngredients });
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedTags([]);
    setSelectedIngredients([]);
    setTagInput('');
    setIngredientInput('');
    setTagSearchQuery('');
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Advanced Filters</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {(selectedCategory || selectedTags.length > 0 || selectedIngredients.length > 0) && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {isOpen && (
        <div className="space-y-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(selectedCategory === category ? '' : category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            
            {/* Search bar for tags */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={tagSearchQuery}
                onChange={(e) => setTagSearchQuery(e.target.value)}
                placeholder="Search tags..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm text-gray-900"
              />
            </div>

            {/* Available tags from recipes */}
            {filteredTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {filteredTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (!selectedTags.includes(tag)) {
                        const newTags = [...selectedTags, tag];
                        setSelectedTags(newTags);
                        onFilterChange({ category: selectedCategory, tags: newTags, ingredients: selectedIngredients });
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Custom tag input */}
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                placeholder="Or type a custom tag and press Enter"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm text-gray-900"
              />
              <button
                onClick={addTag}
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center space-x-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg"
                  >
                    <TagIcon className="w-4 h-4" />
                    <span className="text-sm">{tag}</span>
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-blue-900 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
            
            {/* Available ingredients from recipes */}
            {availableIngredients.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {availableIngredients.slice(0, 10).map((ingredient) => (
                  <button
                    key={ingredient}
                    onClick={() => {
                      if (!selectedIngredients.includes(ingredient)) {
                        const newIngredients = [...selectedIngredients, ingredient];
                        setSelectedIngredients(newIngredients);
                        onFilterChange({ category: selectedCategory, tags: selectedTags, ingredients: newIngredients });
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedIngredients.includes(ingredient)
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {ingredient}
                  </button>
                ))}
              </div>
            )}

            {/* Custom ingredient input */}
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="text"
                value={ingredientInput}
                onChange={(e) => setIngredientInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                placeholder="Type an ingredient and press Enter"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm text-gray-900"
              />
              <button
                onClick={addIngredient}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {selectedIngredients.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedIngredients.map((ingredient) => (
                  <div
                    key={ingredient}
                    className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-lg"
                  >
                    <span className="text-sm">{ingredient}</span>
                    <button
                      onClick={() => removeIngredient(ingredient)}
                      className="hover:text-green-900 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
