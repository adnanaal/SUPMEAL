'use client';

import { useState, useEffect } from 'react';
import { DietaryPreferences } from '@/components/preferences/DietaryPreferences';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { useLanguage } from '@/contexts/LanguageContext';
import { preferencesService, UserPreferences } from '@/services/preferencesService';

export default function PreferencesPage() {
  const { t } = useLanguage();
  const [preferences, setPreferences] = useState<UserPreferences>({
    dietaryPreferences: [],
    allergies: [],
    favoriteCuisine: [],
    defaultServings: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem('userId');
      if (userId) {
        console.log('Loading preferences for user:', userId);
        const userPrefs = await preferencesService.getUserPreferences(parseInt(userId));
        console.log('Loaded preferences from backend:', userPrefs);
        setPreferences(userPrefs);
        console.log('Set preferences state:', userPrefs);
      } else {
        console.log('No userId found, using default preferences');
      }
    } catch (err) {
      console.error('Failed to load preferences:', err);
      setError('Failed to load preferences');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (savedPreferences: any) => {
    try {
      const userId = localStorage.getItem('userId');
      if (userId) {
        console.log('Saving preferences:', savedPreferences);
        const result = await preferencesService.updateUserPreferences(parseInt(userId), {
          dietaryPreferences: savedPreferences.diet,
          allergies: savedPreferences.allergies,
          favoriteCuisine: savedPreferences.cuisineTypes,
          defaultServings: savedPreferences.defaultServings,
        });
        console.log('Save result from backend:', result);
        // Recharger les préférences après sauvegarde
        console.log('Reloading preferences after save...');
        await loadPreferences();
        console.log('Preferences reloaded');
      }
    } catch (err) {
      console.error('Failed to save preferences:', err);
      setError('Failed to save preferences');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <Navbar />
        <div className="ml-64 pt-16 p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <Navbar />
      <div className="ml-64 pt-16 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('dietaryPreferencesTitle')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('dietaryPreferencesSubtitle')}</p>
        </div>
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}
        <DietaryPreferences 
          preferences={{
            diet: preferences?.dietaryPreferences || [],
            allergies: preferences?.allergies || [],
            cuisineTypes: preferences?.favoriteCuisine || [],
            defaultServings: preferences?.defaultServings || 1,
          }} 
          onSave={handleSave} 
        />
      </div>
    </div>
  );
}
