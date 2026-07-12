'use client';

import { useState } from 'react';
import { X, Plus, BookOpen, Upload, X as XIcon } from 'lucide-react';
import { Cookbook, CookbookPermission } from '@/lib/localCookbooks';

interface CreateCookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (cookbook: Cookbook) => void;
  currentUserId: string;
}

export function CreateCookbookModal({ isOpen, onClose, onCreate, currentUserId }: CreateCookbookModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      // Créer un preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCoverFile(null);
    setCoverImage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return;
    }

    try {
      setIsCreating(true);
      
      const newCookbook: Cookbook = {
        id: Date.now(),
        name: name.trim(),
        description: description.trim() || undefined,
        coverImage: coverImage || undefined,
        createdBy: currentUserId,
        creatorName: 'Current User', // Serait remplacé par le vrai nom de l'utilisateur
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        recipeIds: [],
        members: [
          {
            id: Date.now(),
            cookbookId: Date.now(),
            userId: currentUserId,
            userName: 'Current User',
            userEmail: 'user@example.com',
            permission: CookbookPermission.CREATOR,
            joinedAt: new Date().toISOString(),
          },
        ],
      };

      onCreate(newCookbook);
      
      // Reset form
      setName('');
      setDescription('');
      setCoverImage('');
      setCoverFile(null);
    } catch (err) {
      console.error('Failed to create cookbook:', err);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <BookOpen className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create Cookbook</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Cookbook Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Family Favorites"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              disabled={isCreating}
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this cookbook"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              disabled={isCreating}
            />
          </div>

          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image (optional)
            </label>
            {coverImage ? (
              <div className="relative">
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                <input
                  type="file"
                  id="coverImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isCreating}
                />
                <label
                  htmlFor="coverImage"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                </label>
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> After creating the cookbook, you can invite members and add recipes to it.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              disabled={isCreating}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !name.trim()}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              <span>Create Cookbook</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
