'use client';

import { useState } from 'react';
import { Plus, Link, PenTool, ChevronDown } from 'lucide-react';

interface CreateRecipeButtonProps {
  onImportFromUrl: () => void;
  onCreateManual: () => void;
}

export function CreateRecipeButton({ onImportFromUrl, onCreateManual }: CreateRecipeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
      >
        <Plus className="w-5 h-5" />
        <span>Create Recipe</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
            <button
              onClick={() => {
                onImportFromUrl();
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <Link className="w-5 h-5 text-blue-600" />
              <span className="text-gray-700">Import from URL</span>
            </button>
            <button
              onClick={() => {
                onCreateManual();
                setIsOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <PenTool className="w-5 h-5 text-green-600" />
              <span className="text-gray-700">Create Manually</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
