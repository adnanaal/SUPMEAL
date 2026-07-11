'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Recipe, CreateRecipeData } from '@/types';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { EditRecipeModal } from '@/components/recipes/EditRecipeModal';
import { AddToShoppingListModal } from '@/components/recipes/AddToShoppingListModal';
import { AddToMealPlannerModal } from '@/components/recipes/AddToMealPlannerModal';
import { getLocalRecipeById, updateLocalRecipe } from '@/lib/localRecipes';
import { ArrowLeft, Clock, Users, Tag, ChefHat, Utensils, Heart, Share2, Edit, Trash2, Check, ShoppingCart, Calendar } from 'lucide-react';

export function RecipeDetail() {
  const params = useParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddToShoppingListModalOpen, setIsAddToShoppingListModalOpen] = useState(false);
  const [isAddToMealPlannerModalOpen, setIsAddToMealPlannerModalOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  
  // Récupérer l'ID depuis l'URL
  const recipeId = parseInt(params.id as string);
  
  // Trouver la recette correspondante
  const recipe = currentRecipe || getLocalRecipeById(recipeId);

  // Mettre à jour la recette courante quand elle change
  useEffect(() => {
    const foundRecipe = getLocalRecipeById(recipeId);
    if (foundRecipe) {
      setCurrentRecipe(foundRecipe);
    }
  }, [recipeId]);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    // TODO: Quand connecté au backend, appeler l'API pour ajouter/supprimer des favoris
    // if (isFavorite) {
    //   await apiClient.delete(`/favorites/${recipeId}`);
    // } else {
    //   await apiClient.post('/favorites', { recipeId });
    // }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (data: CreateRecipeData) => {
    try {
      // Créer la recette mise à jour avec les nouvelles données
      const updatedRecipe: Recipe = {
        ...recipe!,
        title: data.title,
        description: data.description || '',
        preparationTime: data.preparationTime,
        cookingTime: data.cookingTime,
        servings: data.servings,
        imagePath: data.imagePath,
        source: data.source || '',
        mealType: data.mealType || recipe!.mealType,
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
          recipeId: recipe!.id,
        })),
        steps: (data.steps || []).map((step, index) => ({
          id: Date.now() + index,
          stepOrder: index + 1,
          instruction: step,
          recipeId: recipe!.id,
        })),
        updatedAt: new Date().toISOString(),
      };

      // Mettre à jour les données locales
      updateLocalRecipe(updatedRecipe);
      setCurrentRecipe(updatedRecipe);

      // TODO: Quand connecté au backend, utiliser l'API
      // await apiClient.put(`/recipes/${recipeId}`, data);
      console.log('Recipe updated locally:', updatedRecipe);
    } catch (err) {
      console.error('Failed to update recipe:', err);
      throw err;
    }
  };

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <Navbar />
        <div className="ml-64 pt-16 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-20">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Recipe not found</h1>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalTime = (recipe.preparationTime || 0) + (recipe.cookingTime || 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      
      <div className="ml-64 pt-16">
        {/* Hero Image */}
        <div className="relative h-96 bg-gray-200">
          {recipe.imagePath ? (
            <img
              src={recipe.imagePath}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <Utensils className="w-16 h-16 text-gray-400" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-900" />
          </button>

          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <button
              onClick={handleFavoriteToggle}
              className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-900 hover:bg-white'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
              title="Share recipe"
            >
              {shareCopied ? <Check className="w-5 h-5 text-green-600" /> : <Share2 className="w-5 h-5 text-gray-900" />}
            </button>
            <button
              onClick={() => setIsAddToShoppingListModalOpen(true)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
              title="Add to shopping list"
            >
              <ShoppingCart className="w-5 h-5 text-gray-900" />
            </button>
            <button
              onClick={() => setIsAddToMealPlannerModalOpen(true)}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
              title="Add to meal planner"
            >
              <Calendar className="w-5 h-5 text-gray-900" />
            </button>
            <button
              onClick={handleEdit}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
              title="Edit recipe"
            >
              <Edit className="w-5 h-5 text-gray-900" />
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Title and Basic Info */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{recipe.description}</p>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center space-x-2 text-gray-700">
                <Clock className="w-5 h-5 text-orange-500" />
                <span>
                  <span className="font-medium">{totalTime}</span> min total
                  <span className="text-gray-500 ml-1">
                    ({recipe.preparationTime} prep + {recipe.cookingTime} cook)
                  </span>
                </span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Users className="w-5 h-5 text-orange-500" />
                <span>
                  <span className="font-medium">{recipe.servings}</span> servings
                </span>
              </div>
              {recipe.source && (
                <div className="flex items-center space-x-2 text-gray-700">
                  <ChefHat className="w-5 h-5 text-orange-500" />
                  <span>{recipe.source}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {recipe.tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center space-x-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                  >
                    <Tag className="w-4 h-4" />
                    <span>{tag.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Ingredients */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Utensils className="w-5 h-5 text-orange-500" />
                  <span>Ingredients</span>
                </h2>
                <ul className="space-y-3">
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    recipe.ingredients.map((ingredient) => (
                      <li
                        key={ingredient.id}
                        className="flex items-start space-x-2 text-gray-700"
                      >
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span>
                          <span className="font-medium">
                            {ingredient.quantity} {ingredient.unit}
                          </span>{' '}
                          {ingredient.name}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No ingredients listed</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Steps */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <ChefHat className="w-5 h-5 text-orange-500" />
                <span>Instructions</span>
              </h2>
              <div className="space-y-4">
                {recipe.steps && recipe.steps.length > 0 ? (
                  recipe.steps
                    .sort((a, b) => a.stepOrder - b.stepOrder)
                    .map((step) => (
                      <div
                        key={step.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                            {step.stepOrder}
                          </div>
                          <p className="text-gray-700 flex-1">{step.instruction}</p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-gray-500">
                    No instructions listed
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Modal */}
        <EditRecipeModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          recipe={recipe}
          onUpdate={handleUpdate}
        />

        {/* Add to Shopping List Modal */}
        {recipe && (
          <AddToShoppingListModal
            isOpen={isAddToShoppingListModalOpen}
            onClose={() => setIsAddToShoppingListModalOpen(false)}
            recipe={recipe}
          />
        )}

        {/* Add to Meal Planner Modal */}
        {recipe && (
          <AddToMealPlannerModal
            isOpen={isAddToMealPlannerModalOpen}
            onClose={() => setIsAddToMealPlannerModalOpen(false)}
            recipe={recipe}
          />
        )}
      </div>
    </div>
  );
}
