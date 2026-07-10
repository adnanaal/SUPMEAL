'use client';

import { useRouter } from 'next/navigation';
import { Recipe } from '@/types';
import { Clock, Users, ChefHat } from 'lucide-react';

interface RecipeListProps {
  recipes: Recipe[];
  title?: string;
}

export function RecipeList({ recipes, title = 'Recent Recipes' }: RecipeListProps) {
  const router = useRouter();

  if (recipes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-500 text-center py-8">No recipes found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-4">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => router.push(`/dashboard/recipes/${recipe.id}`)}
            className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            {recipe.imagePath && (
              <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
                <img
                  src={recipe.imagePath}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 truncate">{recipe.title}</h3>
              {recipe.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{recipe.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                {recipe.preparationTime && (
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {recipe.preparationTime} min
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {recipe.servings} servings
                  </div>
                )}
                {recipe.mealType && (
                  <div className="flex items-center">
                    <ChefHat className="w-4 h-4 mr-1" />
                    {recipe.mealType}
                  </div>
                )}
              </div>
              {recipe.tags && recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {recipe.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag.id}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
