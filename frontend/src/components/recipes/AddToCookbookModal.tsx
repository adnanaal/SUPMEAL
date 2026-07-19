'use client';

import { useState, useEffect } from 'react';
import { X, BookOpen } from 'lucide-react';
import { Cookbook } from '@/types';
import { cookbookService } from '@/services/cookbookService';

interface AddToCookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipeId: number;
  currentUserId: string;
}

export function AddToCookbookModal({ isOpen, onClose, recipeId, currentUserId }: AddToCookbookModalProps) {
  const [cookbooks, setCookbooks] = useState<Cookbook[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadCookbooks();
    }
  }, [isOpen]);

  const loadCookbooks = async () => {
    try {
      setLoading(true);
      const data = await cookbookService.getAllCookbooks();
      setCookbooks(data);
    } catch (err) {
      console.error('Failed to load cookbooks:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCookbook = async (cookbookId: number) => {
    try {
      setAdding(cookbookId);
      await cookbookService.addRecipeToCookbook(cookbookId, recipeId);
      onClose();
    } catch (err) {
      console.error('Failed to add recipe to cookbook:', err);
    } finally {
      setAdding(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-orange-500" />
            <span>Add to Cookbook</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : cookbooks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No cookbooks found. Create one first!</p>
          ) : (
            <div className="space-y-2">
              {cookbooks.map((cookbook) => {
                const isInCookbook = cookbook.recipeIds?.includes(recipeId);
                return (
                  <button
                    key={cookbook.id}
                    onClick={() => !isInCookbook && handleAddToCookbook(cookbook.id)}
                    disabled={isInCookbook || adding === cookbook.id}
                    className={`w-full p-4 rounded-lg border transition-colors text-left ${
                      isInCookbook
                        ? 'bg-green-50 border-green-200 cursor-not-allowed'
                        : 'bg-white border-gray-200 hover:bg-orange-50 hover:border-orange-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{cookbook.name}</h3>
                        {cookbook.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{cookbook.description}</p>
                        )}
                      </div>
                      {isInCookbook ? (
                        <span className="text-green-600 text-sm font-medium">Added</span>
                      ) : adding === cookbook.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                      ) : (
                        <span className="text-orange-600 text-sm font-medium">Add</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
