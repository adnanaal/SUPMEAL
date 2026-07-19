'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Users, BookOpen, Settings, UserPlus, Trash2, Edit } from 'lucide-react';
import { Cookbook, CookbookPermission, PERMISSION_LABELS, PERMISSION_COLORS } from '@/types';
import { cookbookService } from '@/services/cookbookService';
import { recipeService } from '@/services/recipeService';
import { InviteMemberModal } from '@/components/cookbooks/InviteMemberModal';
import { AddRecipeModal } from '@/components/cookbooks/AddRecipeModal';
import { EditMemberModal } from '@/components/cookbooks/EditMemberModal';
import { CookbookMessaging } from '@/components/cookbooks/CookbookMessaging';
import { RecipeComments } from '@/components/cookbooks/RecipeComments';
import { Recipe } from '@/types';

export function CookbookDetail() {
  const params = useParams();
  const router = useRouter();
  const [cookbook, setCookbook] = useState<Cookbook | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAddRecipeModalOpen, setIsAddRecipeModalOpen] = useState(false);
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  
  const cookbookId = parseInt(params.id as string);
  const [currentUserId, setCurrentUserId] = useState('10'); // Valeur par défaut
  
  useEffect(() => {
    // Accéder à localStorage seulement côté client
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    }
  }, []);
  
  // Mock user pour la messagerie - utiliser currentUserId dynamique
  const currentUser = {
    id: parseInt(currentUserId),
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    isVerified: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  useEffect(() => {
    const loadCookbookData = async () => {
      try {
        setLoading(true);
        const cookbookData = await cookbookService.getCookbookById(cookbookId);
        setCookbook(cookbookData);
        
        // Charger les recettes du cookbook
        const allRecipes = await recipeService.getAllRecipes();
        const cookbookRecipes = allRecipes.filter((r) => cookbookData.recipeIds?.includes(r.id) || false);
        setRecipes(cookbookRecipes);
      } catch (err) {
        console.error('Failed to load cookbook:', err);
        setError('Failed to load cookbook');
      } finally {
        setLoading(false);
      }
    };
    loadCookbookData();
  }, [cookbookId]);

  const getUserPermission = (): string | null => {
    if (!cookbook || !cookbook.members) return null;
    const member = cookbook.members.find((m) => m.userId === Number(currentUserId));
    return member ? member.permission : null;
  };

  const canEdit = (): boolean => {
    const permission = getUserPermission();
    return permission === 'OWNER' || permission === 'CREATOR' || permission === 'EDITOR';
  };

  const canInvite = (): boolean => {
    const permission = getUserPermission();
    return permission === 'OWNER' || permission === 'CREATOR' || permission === 'EDITOR';
  };

  const canManageMembers = (): boolean => {
    const permission = getUserPermission();
    return permission === 'OWNER' || permission === 'CREATOR';
  };

  const handleRemoveRecipe = async (recipeId: number) => {
    if (confirm('Are you sure you want to remove this recipe from the cookbook?')) {
      try {
        await cookbookService.removeRecipeFromCookbook(cookbookId, recipeId);
        const cookbookData = await cookbookService.getCookbookById(cookbookId);
        setCookbook(cookbookData);
        const allRecipes = await recipeService.getAllRecipes();
        const cookbookRecipes = allRecipes.filter((r: Recipe) => cookbookData.recipeIds?.includes(r.id) || false);
        setRecipes(cookbookRecipes);
      } catch (err) {
        console.error('Failed to remove recipe:', err);
      }
    }
  };

  const handleRemoveMember = async (memberId: number) => {
    if (confirm('Are you sure you want to remove this member?')) {
      try {
        await cookbookService.removeMember(cookbookId, memberId.toString());
        const cookbookData = await cookbookService.getCookbookById(cookbookId);
        setCookbook(cookbookData);
      } catch (err) {
        console.error('Failed to remove member:', err);
      }
    }
  };

  const handleDeleteCookbook = async () => {
    if (confirm('Are you sure you want to delete this cookbook? This action cannot be undone.')) {
      try {
        await cookbookService.deleteCookbook(cookbookId);
        router.push('/dashboard/cookbooks');
      } catch (err) {
        console.error('Failed to delete cookbook:', err);
      }
    }
  };

  const handleEditMember = (member: any) => {
    setSelectedMember(member);
    setIsEditMemberModalOpen(true);
  };

  const handleMemberUpdate = async (memberId: number, permission: CookbookPermission) => {
    try {
      await cookbookService.updateMemberPermission(cookbookId, memberId.toString(), permission);
      const cookbookData = await cookbookService.getCookbookById(cookbookId);
      setCookbook(cookbookData);
      setIsEditMemberModalOpen(false);
    } catch (err) {
      console.error('Failed to update member permission:', err);
    }
  };

  const handleRecipeAdded = async () => {
    try {
      const cookbookData = await cookbookService.getCookbookById(cookbookId);
      setCookbook(cookbookData);
      const allRecipes = await recipeService.getAllRecipes();
      const cookbookRecipes = allRecipes.filter((r: Recipe) => cookbookData.recipeIds?.includes(r.id) || false);
      setRecipes(cookbookRecipes);
      setIsAddRecipeModalOpen(false);
    } catch (err) {
      console.error('Failed to refresh recipes:', err);
    }
  };

  const handleMemberInvited = async () => {
    try {
      const cookbookData = await cookbookService.getCookbookById(cookbookId);
      setCookbook(cookbookData);
      setIsInviteModalOpen(false);
    } catch (err) {
      console.error('Failed to refresh cookbook:', err);
    }
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

  if (!cookbook) {
    return (
      <div className="p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Cookbooks</span>
        </button>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500">Cookbook not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <div className="flex items-center space-x-3">
              {cookbook.coverImage && (
                <img
                  src={cookbook.coverImage}
                  alt={cookbook.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{cookbook.name}</h1>
                {cookbook.description && (
                  <p className="text-sm text-gray-500 mt-1">{cookbook.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {canInvite() && (
            <button
              onClick={() => setIsInviteModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              <span>Invite</span>
            </button>
          )}
          {canEdit() && (
            <button
              onClick={() => setIsAddRecipeModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Recipe</span>
            </button>
          )}
          {getUserPermission() === 'OWNER' && (
            <button
              onClick={handleDeleteCookbook}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete</span>
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Recipes</p>
              <p className="text-2xl font-bold text-gray-900">{recipes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Members</p>
              <p className="text-2xl font-bold text-gray-900">{cookbook.members?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Settings className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Your Role</p>
              <p className="text-lg font-bold text-gray-900">{PERMISSION_LABELS[getUserPermission()!] || getUserPermission()! || 'None'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Members</h2>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {cookbook.members?.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                    {member.userName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.userName || 'Unknown User'}</p>
                    <p className="text-sm text-gray-500">{member.userEmail || 'No email'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${PERMISSION_COLORS[member.permission] || 'bg-gray-100 text-gray-800'}`}>
                    {PERMISSION_LABELS[member.permission] || member.permission || 'None'}
                  </span>
                  {canManageMembers() && member.userId !== Number(currentUserId) && (
                    <>
                      <button
                        onClick={() => handleEditMember(member)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit permission"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recipes Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recipes</h2>
        </div>
        {recipes.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recipes yet</h3>
            <p className="text-gray-500 mb-4">Add recipes to this cookbook to get started</p>
            {canEdit() && (
              <button
                onClick={() => setIsAddRecipeModalOpen(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Add Recipe
              </button>
            )}
          </div>
        ) : (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-gray-50 rounded-lg overflow-hidden"
                >
                  {recipe.imagePath && (
                    <img
                      src={recipe.imagePath}
                      alt={recipe.title}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-2">{recipe.title}</h3>
                    {canEdit() && (
                      <button
                        onClick={() => handleRemoveRecipe(recipe.id)}
                        className="text-sm text-red-600 hover:text-red-700 mb-3"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <RecipeComments
                    cookbookId={cookbookId}
                    recipeId={recipe.id}
                    recipeTitle={recipe.title}
                    currentUser={currentUser}
                    userPermission={getUserPermission() || undefined}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cookbook Messaging */}
      <div className="mt-6">
        <CookbookMessaging 
          cookbookId={cookbookId} 
          currentUser={currentUser} 
          userPermission={getUserPermission() || undefined}
        />
      </div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        cookbookId={cookbookId}
        onInvited={handleMemberInvited}
      />

      {/* Add Recipe Modal */}
      <AddRecipeModal
        isOpen={isAddRecipeModalOpen}
        onClose={() => setIsAddRecipeModalOpen(false)}
        cookbookId={cookbookId}
        onRecipeAdded={handleRecipeAdded}
      />

      {/* Edit Member Modal */}
      {selectedMember && (
        <EditMemberModal
          isOpen={isEditMemberModalOpen}
          onClose={() => {
            setIsEditMemberModalOpen(false);
            setSelectedMember(null);
          }}
          member={selectedMember}
          onUpdate={handleMemberUpdate}
        />
      )}
    </div>
  );
}
