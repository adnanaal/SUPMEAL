// Mapping des allergènes entre français et anglais pour la détection multilingue
export const ALLERGY_MAPPING: Record<string, string[]> = {
  // Français -> Anglais (et vice versa)
  'eggs': ['œufs', 'eggs', 'egg', 'oeufs', 'oeuf'],
  'peanuts': ['arachides', 'peanuts', 'peanut'],
  'tree nuts': ['fruits à coque', 'noix', 'noisettes', 'amandes', 'pistaches', 'noix de cajou', 'tree nuts', 'nuts', 'almonds', 'hazelnuts', 'cashews', 'pistachios', 'walnuts'],
  'dairy': ['produits laitiers', 'lait', 'fromage', 'beurre', 'crème', 'yaourt', 'dairy', 'milk', 'cheese', 'butter', 'cream', 'yogurt'],
  'wheat': ['blé', 'farine', 'gluten', 'wheat', 'flour', 'gluten'],
  'soy': ['soja', 'soy', 'soybean'],
  'fish': ['poisson', 'fish'],
  'shellfish': ['fruits de mer', 'crevettes', 'crabes', 'homards', 'moules', 'huîtres', 'shellfish', 'shrimp', 'crab', 'lobster', 'mussels', 'oysters'],
  'sesame': ['sésame', 'sesame'],
  'mustard': ['moutarde', 'mustard'],
  'celery': ['céleri', 'celery'],
  'lupin': ['lupin', 'lupin'],
  'molluscs': ['mollusques', 'molluscs', 'snails', 'escargots'],
};

// Fonction pour normaliser un nom d'ingrédient ou d'allergène
export function normalizeAllergenName(name: string): string {
  const lowerName = name.toLowerCase().trim();
  
  // Chercher si ce nom correspond à un allergène connu
  for (const [canonicalName, variants] of Object.entries(ALLERGY_MAPPING)) {
    if (variants.some(variant => lowerName.includes(variant) || variant.includes(lowerName))) {
      return canonicalName;
    }
  }
  
  // Si pas trouvé, retourner le nom normalisé
  return lowerName;
}

// Fonction pour vérifier si un ingrédient contient un allergène
export function containsAllergen(ingredient: string, userAllergies: string[]): boolean {
  const normalizedIngredient = normalizeAllergenName(ingredient);
  const normalizedUserAllergies = userAllergies.map(normalizeAllergenName);
  
  return normalizedUserAllergies.some(allergy => {
    // Vérifier si l'allergène est exactement le même
    if (normalizedIngredient === allergy) return true;
    
    // Vérifier si l'ingrédient contient l'allergène
    if (normalizedIngredient.includes(allergy) || allergy.includes(normalizedIngredient)) return true;
    
    // Vérifier les variantes de l'allergène
    const variants = ALLERGY_MAPPING[allergy];
    if (variants) {
      return variants.some(variant => normalizedIngredient.includes(variant));
    }
    
    return false;
  });
}

// Fonction pour obtenir le nom canonique d'un allergène
export function getCanonicalAllergenName(name: string): string {
  return normalizeAllergenName(name);
}

// Fonction pour traduire un allergène vers la langue de l'utilisateur
export function translateAllergen(allergen: string, language: 'fr' | 'en'): string {
  const canonical = normalizeAllergenName(allergen);
  
  // Mapping des noms canoniques vers les traductions
  const translations: Record<string, { fr: string; en: string }> = {
    'eggs': { fr: 'Œufs', en: 'Eggs' },
    'peanuts': { fr: 'Arachides', en: 'Peanuts' },
    'tree nuts': { fr: 'Fruits à coque', en: 'Tree nuts' },
    'dairy': { fr: 'Produits laitiers', en: 'Dairy' },
    'wheat': { fr: 'Blé', en: 'Wheat' },
    'soy': { fr: 'Soja', en: 'Soy' },
    'fish': { fr: 'Poisson', en: 'Fish' },
    'shellfish': { fr: 'Fruits de mer', en: 'Shellfish' },
    'sesame': { fr: 'Sésame', en: 'Sesame' },
    'mustard': { fr: 'Moutarde', en: 'Mustard' },
    'celery': { fr: 'Céleri', en: 'Celery' },
    'lupin': { fr: 'Lupin', en: 'Lupin' },
    'molluscs': { fr: 'Mollusques', en: 'Molluscs' },
  };
  
  return translations[canonical]?.[language] || allergen;
}
