'use client';

import { AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AllergyWarningProps {
  allergens: string[];
  onDismiss?: () => void;
}

export function AllergyWarning({ allergens, onDismiss }: AllergyWarningProps) {
  const { t } = useLanguage();

  if (allergens.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 dark:text-red-300 mb-1">
              {t('allergyWarningTitle')}
            </h3>
            <p className="text-sm text-red-700 dark:text-red-400 mb-2">
              {t('allergyWarningMessage')}
            </p>
            <div className="flex flex-wrap gap-2">
              {allergens.map((allergen) => (
                <span
                  key={allergen}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200"
                >
                  {allergen}
                </span>
              ))}
            </div>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
