export interface DietaryPreferences {
  diet: string[];
  allergies: string[];
  cuisineTypes: string[];
  defaultServings: number;
}

// Données manuelles temporaires pour les préférences alimentaires
let localPreferences: DietaryPreferences = {
  diet: ['Vegetarian'],
  allergies: ['Peanuts', 'Dairy'],
  cuisineTypes: ['Italian', 'Asian'],
  defaultServings: 4,
};

// Fonctions pour les préférences alimentaires
export const getLocalPreferences = (): DietaryPreferences => {
  return localPreferences;
};

export const updateLocalPreferences = (preferences: DietaryPreferences): void => {
  localPreferences = preferences;
};

export const addDietPreference = (diet: string): void => {
  if (!localPreferences.diet.includes(diet)) {
    localPreferences.diet.push(diet);
  }
};

export const removeDietPreference = (diet: string): void => {
  localPreferences.diet = localPreferences.diet.filter((d) => d !== diet);
};

export const addAllergy = (allergy: string): void => {
  if (!localPreferences.allergies.includes(allergy)) {
    localPreferences.allergies.push(allergy);
  }
};

export const removeAllergy = (allergy: string): void => {
  localPreferences.allergies = localPreferences.allergies.filter((a) => a !== allergy);
};

export const addCuisineType = (cuisine: string): void => {
  if (!localPreferences.cuisineTypes.includes(cuisine)) {
    localPreferences.cuisineTypes.push(cuisine);
  }
};

export const removeCuisineType = (cuisine: string): void => {
  localPreferences.cuisineTypes = localPreferences.cuisineTypes.filter((c) => c !== cuisine);
};

export const updateDefaultServings = (servings: number): void => {
  localPreferences.defaultServings = servings;
};
