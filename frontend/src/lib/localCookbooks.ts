export enum CookbookPermission {
  CREATOR = 'CREATOR',
  EDITOR = 'EDITOR',
  READER = 'READER',
  COMMENTATOR = 'COMMENTATOR',
}

export interface CookbookMember {
  id: number;
  cookbookId: number;
  userId: string;
  userName: string;
  userEmail: string;
  permission: CookbookPermission;
  joinedAt: string;
  avatar?: string;
}

export interface Cookbook {
  id: number;
  name: string;
  description?: string;
  coverImage?: string;
  createdBy: string;
  creatorName: string;
  createdAt: string;
  updatedAt: string;
  recipeIds: number[]; // IDs des recettes incluses dans ce cookbook
  members: CookbookMember[];
}

export interface CookbookRecipe {
  cookbookId: number;
  recipeId: number;
  addedBy: string;
  addedAt: string;
}

// Données manuelles temporaires pour cookbooks
let localCookbooks: Cookbook[] = [
  {
    id: 1,
    name: 'Family Favorites',
    description: 'Our family\'s best recipes passed down through generations',
    coverImage: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800',
    createdBy: 'user1',
    creatorName: 'John Doe',
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    recipeIds: [1, 2, 3],
    members: [
      {
        id: 1,
        cookbookId: 1,
        userId: 'user1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        permission: CookbookPermission.CREATOR,
        joinedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
      },
      {
        id: 2,
        cookbookId: 1,
        userId: 'user2',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        permission: CookbookPermission.EDITOR,
        joinedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: 3,
        cookbookId: 1,
        userId: 'user3',
        userName: 'Bob Johnson',
        userEmail: 'bob@example.com',
        permission: CookbookPermission.READER,
        joinedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
    ],
  },
  {
    id: 2,
    name: 'Healthy Eating',
    description: 'Collection of nutritious and delicious recipes',
    coverImage: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800',
    createdBy: 'user2',
    creatorName: 'Jane Smith',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    recipeIds: [3, 5],
    members: [
      {
        id: 4,
        cookbookId: 2,
        userId: 'user2',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        permission: CookbookPermission.CREATOR,
        joinedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
      {
        id: 5,
        cookbookId: 2,
        userId: 'user1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        permission: CookbookPermission.COMMENTATOR,
        joinedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
    ],
  },
];

// Fonction pour récupérer tous les cookbooks
export const getLocalCookbooks = () => localCookbooks;

// Fonction pour ajouter un cookbook
export const addLocalCookbook = (cookbook: Cookbook) => {
  localCookbooks.push(cookbook);
};

// Fonction pour mettre à jour un cookbook
export const updateLocalCookbook = (id: number, updatedCookbook: Partial<Cookbook>) => {
  const index = localCookbooks.findIndex((cb) => cb.id === id);
  if (index !== -1) {
    localCookbooks[index] = { ...localCookbooks[index], ...updatedCookbook, updatedAt: new Date().toISOString() };
  }
};

// Fonction pour supprimer un cookbook
export const deleteLocalCookbook = (id: number) => {
  localCookbooks = localCookbooks.filter((cb) => cb.id !== id);
};

// Fonction pour récupérer un cookbook par ID
export const getCookbookById = (id: number) => {
  return localCookbooks.find((cb) => cb.id === id);
};

// Fonction pour ajouter un membre à un cookbook
export const addCookbookMember = (cookbookId: number, member: Omit<CookbookMember, 'id'>) => {
  const cookbook = localCookbooks.find((cb) => cb.id === cookbookId);
  if (cookbook) {
    const newMember: CookbookMember = {
      ...member,
      id: Date.now(),
    };
    cookbook.members.push(newMember);
    cookbook.updatedAt = new Date().toISOString();
  }
};

// Fonction pour mettre à jour la permission d'un membre
export const updateMemberPermission = (cookbookId: number, memberId: number, permission: CookbookPermission) => {
  const cookbook = localCookbooks.find((cb) => cb.id === cookbookId);
  if (cookbook) {
    const member = cookbook.members.find((m) => m.id === memberId);
    if (member) {
      member.permission = permission;
      cookbook.updatedAt = new Date().toISOString();
    }
  }
};

// Fonction pour supprimer un membre d'un cookbook
export const removeCookbookMember = (cookbookId: number, memberId: number) => {
  const cookbook = localCookbooks.find((cb) => cb.id === cookbookId);
  if (cookbook) {
    cookbook.members = cookbook.members.filter((m) => m.id !== memberId);
    cookbook.updatedAt = new Date().toISOString();
  }
};

// Fonction pour ajouter une recette à un cookbook
export const addRecipeToCookbook = (cookbookId: number, recipeId: number) => {
  const cookbook = localCookbooks.find((cb) => cb.id === cookbookId);
  if (cookbook && !cookbook.recipeIds.includes(recipeId)) {
    cookbook.recipeIds.push(recipeId);
    cookbook.updatedAt = new Date().toISOString();
  }
};

// Fonction pour supprimer une recette d'un cookbook
export const removeRecipeFromCookbook = (cookbookId: number, recipeId: number) => {
  const cookbook = localCookbooks.find((cb) => cb.id === cookbookId);
  if (cookbook) {
    cookbook.recipeIds = cookbook.recipeIds.filter((id) => id !== recipeId);
    cookbook.updatedAt = new Date().toISOString();
  }
};

// Fonction pour obtenir la permission d'un utilisateur dans un cookbook
export const getUserPermission = (cookbookId: number, userId: string): CookbookPermission | null => {
  const cookbook = localCookbooks.find((cb) => cb.id === cookbookId);
  if (cookbook) {
    const member = cookbook.members.find((m) => m.userId === userId);
    return member ? member.permission : null;
  }
  return null;
};

// Labels pour les permissions
export const PERMISSION_LABELS: Record<CookbookPermission, string> = {
  [CookbookPermission.CREATOR]: 'Creator',
  [CookbookPermission.EDITOR]: 'Editor',
  [CookbookPermission.READER]: 'Reader',
  [CookbookPermission.COMMENTATOR]: 'Commentator',
};

// Couleurs pour les permissions
export const PERMISSION_COLORS: Record<CookbookPermission, string> = {
  [CookbookPermission.CREATOR]: 'bg-purple-100 text-purple-700 border-purple-300',
  [CookbookPermission.EDITOR]: 'bg-blue-100 text-blue-700 border-blue-300',
  [CookbookPermission.READER]: 'bg-gray-100 text-gray-700 border-gray-300',
  [CookbookPermission.COMMENTATOR]: 'bg-green-100 text-green-700 border-green-300',
};
