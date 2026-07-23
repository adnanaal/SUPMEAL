'use client';

import { useState, useEffect } from 'react';
import { Utensils, AlertTriangle, Heart, Users, Check, X, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DietaryPreferencesProps {
  preferences: {
    diet: string[];
    allergies: string[];
    cuisineTypes: string[];
    defaultServings: number;
  };
  onSave: (preferences: any) => void;
}

const getDietOptions = (t: any) => [
  t('vegetarian'),
  t('vegan'),
  t('glutenFree'),
  t('dairyFree'),
  t('keto'),
  t('paleo'),
  t('lowCarb'),
  t('mediterranean'),
  t('pescatarian'),
  t('raw'),
];

const getCommonAllergies = (t: any) => [
  t('peanuts'),
  t('treeNuts'),
  t('dairy'),
  t('eggs'),
  t('soy'),
  t('wheat'),
  t('fish'),
  t('shellfish'),
  t('sesame'),
  t('mustard'),
];

const getCuisineTypes = (t: any) => [
  t('italian'),
  t('french'),
  t('chinese'),
  t('japanese'),
  t('indian'),
  t('mexican'),
  t('thai'),
  t('greek'),
  t('spanish'),
  t('american'),
  t('middleEastern'),
  t('korean'),
  t('vietnamese'),
  t('brazilian'),
  t('moroccan'),
];

export function DietaryPreferences({ preferences, onSave }: DietaryPreferencesProps) {
  const { t } = useLanguage();
  const [diet, setDiet] = useState<string[]>(preferences.diet);
  const [allergies, setAllergies] = useState<string[]>(preferences.allergies);
  const [cuisineTypes, setCuisineTypes] = useState<string[]>(preferences.cuisineTypes);
  const [defaultServings, setDefaultServings] = useState(preferences.defaultServings);
  const [customAllergy, setCustomAllergy] = useState('');
  const [customCuisine, setCustomCuisine] = useState('');
  const [customDiet, setCustomDiet] = useState('');

  // Synchroniser l'état avec les props quand elles changent
  useEffect(() => {
    console.log('DietaryPreferences - props changed:', preferences);
    setDiet(preferences.diet);
    setAllergies(preferences.allergies);
    setCuisineTypes(preferences.cuisineTypes);
    setDefaultServings(preferences.defaultServings);
    console.log('DietaryPreferences - state updated:', {
      diet: preferences.diet,
      allergies: preferences.allergies,
      cuisineTypes: preferences.cuisineTypes,
      defaultServings: preferences.defaultServings
    });
  }, [preferences]);

  const DIET_OPTIONS = getDietOptions(t);
  const COMMON_ALLERGIES = getCommonAllergies(t);
  const CUISINE_TYPES = getCuisineTypes(t);

  const toggleDiet = (dietType: string) => {
    setDiet(diet.includes(dietType) ? diet.filter((d) => d !== dietType) : [...diet, dietType]);
  };

  const toggleAllergy = (allergy: string) => {
    setAllergies(allergies.includes(allergy) ? allergies.filter((a) => a !== allergy) : [...allergies, allergy]);
  };

  const toggleCuisine = (cuisine: string) => {
    setCuisineTypes(cuisineTypes.includes(cuisine) ? cuisineTypes.filter((c) => c !== cuisine) : [...cuisineTypes, cuisine]);
  };

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !allergies.includes(customAllergy.trim())) {
      setAllergies([...allergies, customAllergy.trim()]);
      setCustomAllergy('');
    }
  };

  const removeCustomAllergy = (allergy: string) => {
    setAllergies(allergies.filter((a) => a !== allergy));
  };

  const addCustomCuisine = () => {
    if (customCuisine.trim() && !cuisineTypes.includes(customCuisine.trim())) {
      setCuisineTypes([...cuisineTypes, customCuisine.trim()]);
      setCustomCuisine('');
    }
  };

  const removeCustomCuisine = (cuisine: string) => {
    setCuisineTypes(cuisineTypes.filter((c) => c !== cuisine));
  };

  const addCustomDiet = () => {
    if (customDiet.trim() && !diet.includes(customDiet.trim())) {
      setDiet([...diet, customDiet.trim()]);
      setCustomDiet('');
    }
  };

  const removeCustomDiet = (dietType: string) => {
    setDiet(diet.filter((d) => d !== dietType));
  };

  const handleSave = () => {
    onSave({
      diet,
      allergies,
      cuisineTypes,
      defaultServings,
    });
  };

  const handleCancel = () => {
    setDiet(preferences.diet);
    setAllergies(preferences.allergies);
    setCuisineTypes(preferences.cuisineTypes);
    setDefaultServings(preferences.defaultServings);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Diet Preferences */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Utensils className="w-5 h-5 text-orange-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dietaryPreferencesTitle')}</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('selectDietaryPreferences')}</p>
        <div className="flex flex-wrap gap-2">
          {DIET_OPTIONS.map((dietOption) => (
            <button
              key={dietOption}
              onClick={() => toggleDiet(dietOption)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                diet.includes(dietOption)
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {dietOption}
            </button>
          ))}
          {/* Custom diet options */}
          {diet.filter(d => !DIET_OPTIONS.includes(d)).map((customDietOption) => (
            <button
              key={customDietOption}
              onClick={() => toggleDiet(customDietOption)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                diet.includes(customDietOption)
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {customDietOption}
              <X className="w-3 h-3" onClick={(e) => { e.stopPropagation(); removeCustomDiet(customDietOption); }} />
            </button>
          ))}
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('customDietaryPreferences')}</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={customDiet}
              onChange={(e) => setCustomDiet(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomDiet()}
              placeholder={t('addCustomDiet')}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
            />
            <button
              onClick={addCustomDiet}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
            >
              {t('add')}
            </button>
          </div>
        </div>
      </div>

      {/* Allergies */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('allergies')}</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('selectAllergies')}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {COMMON_ALLERGIES.map((allergy) => (
            <button
              key={allergy}
              onClick={() => toggleAllergy(allergy)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                allergies.includes(allergy)
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {allergy}
            </button>
          ))}
        </div>

        {/* Custom Allergies */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('customAllergies')}</p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={customAllergy}
              onChange={(e) => setCustomAllergy(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomAllergy()}
              placeholder={t('addCustomAllergy')}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
            />
            <button
              onClick={addCustomAllergy}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {allergies.filter((a) => !COMMON_ALLERGIES.includes(a)).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {allergies.filter((a) => !COMMON_ALLERGIES.includes(a)).map((allergy) => (
                <div
                  key={allergy}
                  className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                >
                  <span>{allergy}</span>
                  <button
                    onClick={() => removeCustomAllergy(allergy)}
                    className="hover:text-red-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preferred Cuisine Types */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Heart className="w-5 h-5 text-pink-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('preferredCuisineTypes')}</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('selectFavoriteCuisine')}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {CUISINE_TYPES.map((cuisine) => (
            <button
              key={cuisine}
              onClick={() => toggleCuisine(cuisine)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                cuisineTypes.includes(cuisine)
                  ? 'bg-pink-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {cuisine}
            </button>
          ))}
        </div>

        {/* Custom Cuisine Types */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('customCuisineTypes')}</p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={customCuisine}
              onChange={(e) => setCustomCuisine(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomCuisine()}
              placeholder={t('addCustomCuisine')}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
            />
            <button
              onClick={addCustomCuisine}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          {cuisineTypes.filter((c) => !CUISINE_TYPES.includes(c)).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {cuisineTypes.filter((c) => !CUISINE_TYPES.includes(c)).map((cuisine) => (
                <div
                  key={cuisine}
                  className="flex items-center space-x-2 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                >
                  <span>{cuisine}</span>
                  <button
                    onClick={() => removeCustomCuisine(cuisine)}
                    className="hover:text-pink-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Default Servings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{t('defaultServings')}</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('setDefaultServings')}</p>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDefaultServings(Math.max(1, defaultServings - 1))}
            className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="w-20 text-center">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">{defaultServings}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{t('people')}</span>
          </div>
          <button
            onClick={() => setDefaultServings(Math.min(20, defaultServings + 1))}
            className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors"
          >
            <Plus className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={handleCancel}
          className="flex items-center space-x-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
          <span>{t('cancel')}</span>
        </button>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Check className="w-4 h-4" />
          <span>{t('savePreferences')}</span>
        </button>
      </div>
    </div>
  );
}
