'use client';

import { useState } from 'react';
import { X, Link, Download, Loader2 } from 'lucide-react';
import { MealType } from '@/types';

interface ImportFromUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: { url: string; title?: string; mealType?: MealType }) => Promise<void>;
}

export function ImportFromUrlModal({ isOpen, onClose, onImport }: ImportFromUrlModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [mealType, setMealType] = useState<MealType>(MealType.DINNER);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    try {
      setIsImporting(true);
      setError('');
      await onImport({ url, title: title.trim() || undefined, mealType });
      setUrl('');
      setTitle('');
      setMealType(MealType.DINNER);
      onClose();
    } catch (err) {
      setError('Failed to import recipe from URL. Please check the URL and try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleClose = () => {
    setUrl('');
    setTitle('');
    setMealType(MealType.DINNER);
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Link className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Import Recipe from URL</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Recipe URL *
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/recipe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-900"
              disabled={isImporting}
              required
            />
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Recipe Name (optional)
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a name for this recipe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-900"
              disabled={isImporting}
            />
          </div>

          <div>
            <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 mb-2">
              Meal Type
            </label>
            <select
              id="mealType"
              value={mealType}
              onChange={(e) => setMealType(e.target.value as MealType)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-900"
              disabled={isImporting}
            >
              <option value="BREAKFAST">Breakfast</option>
              <option value="LUNCH">Lunch</option>
              <option value="DINNER">Dinner</option>
              <option value="SNACK">Snack</option>
            </select>
          </div>

          <p className="text-sm text-gray-500">
            Paste the URL of a recipe from any website to import it automatically.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              disabled={isImporting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isImporting || !url.trim()}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isImporting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Importing...</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Import Recipe</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
