'use client';

import { useEffect, useState } from 'react';
import { Recipe, Cookbook, MealPlanning } from '@/types';
import { StatsCard } from './StatsCard';
import { RecipeList } from './RecipeList';
import { MealPlanningCalendar } from './MealPlanningCalendar';
import { CookbookList } from './CookbookList';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { SearchBar } from '@/components/layout/SearchBar';
import { apiClient } from '@/lib/api';
import { BookOpen, Utensils, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [cookbooks, setCookbooks] = useState<Cookbook[]>([]);
  const [mealPlannings, setMealPlannings] = useState<MealPlanning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [recipesData, cookbooksData, mealPlanningsData] = await Promise.all([
          apiClient.get<Recipe[]>('/recipes').catch(() => []),
          apiClient.get<Cookbook[]>('/cookbooks').catch(() => []),
          apiClient.get<MealPlanning[]>('/meal-planning').catch(() => []),
        ]);
        
        setRecipes(recipesData);
        setFilteredRecipes(recipesData.slice(0, 10)); // Show only 10 recent recipes
        setCookbooks(cookbooksData.slice(0, 6)); // Show only 6 cookbooks
        setMealPlannings(mealPlanningsData.slice(0, 7)); // Show only 7 days of meal plans
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredRecipes(recipes.slice(0, 10));
      return;
    }

    const filtered = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(query.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(query.toLowerCase()) ||
      recipe.tags?.some((tag) => tag.name.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredRecipes(filtered);
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
          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar onSearch={handleSearch} placeholder="Search your recipes..." />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Recipes"
              value={recipes.length}
              icon={Utensils}
              trend={{ value: 12, isPositive: true }}
              description="Recipes in your collection"
            />
            <StatsCard
              title="Cookbooks"
              value={cookbooks.length}
              icon={BookOpen}
              trend={{ value: 8, isPositive: true }}
              description="Shared cookbooks"
            />
            <StatsCard
              title="Meal Plans"
              value={mealPlannings.length}
              icon={CalendarIcon}
              trend={{ value: 5, isPositive: true }}
              description="Upcoming meals"
            />
            <StatsCard
              title="This Week"
              value="Active"
              icon={TrendingUp}
              description="Planning progress"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Left Column - Recent Recipes */}
            <div className="lg:col-span-2">
              <RecipeList recipes={filteredRecipes} title="My Recipes" />
            </div>

            {/* Right Column - Meal Planning */}
            <div className="lg:col-span-1">
              <MealPlanningCalendar mealPlannings={mealPlannings} title="Meal Planning" />
            </div>
          </div>

          {/* Bottom Section - Cookbooks */}
          <div>
            <CookbookList cookbooks={cookbooks} title="My Cookbooks" />
          </div>
        </div>
      </div>
    </div>
  );
}
