// Données manuelles temporaires pour les favoris
let localFavorites: Set<number> = new Set();

// Fonction pour récupérer les favoris
export const getLocalFavorites = () => localFavorites;

// Fonction pour ajouter un favori
export const addLocalFavorite = (recipeId: number) => {
  localFavorites.add(recipeId);
};

// Fonction pour supprimer un favori
export const removeLocalFavorite = (recipeId: number) => {
  localFavorites.delete(recipeId);
};

// Fonction pour vérifier si une recette est en favori
export const isFavorite = (recipeId: number) => {
  return localFavorites.has(recipeId);
};

// Fonction pour basculer le statut de favori
export const toggleFavorite = (recipeId: number) => {
  if (localFavorites.has(recipeId)) {
    localFavorites.delete(recipeId);
    return false;
  } else {
    localFavorites.add(recipeId);
    return true;
  }
};
