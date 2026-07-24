'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Moon, Sun, Globe, User, Bell, ChevronRight, Check, LucideIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import ExportImport from './ExportImport';

interface SettingsItem {
  label: string;
  description: string;
  onClick?: () => void;
  customAction?: React.ReactNode;
}

interface SettingsSection {
  title: string;
  icon: LucideIcon;
  items: SettingsItem[];
}

export function Settings() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const handleLanguageChange = (newLanguage: 'fr' | 'en') => {
    console.log('=== LANGUAGE CHANGE ===');
    console.log('Current language:', language);
    console.log('New language:', newLanguage);
    setLanguage(newLanguage);
    setShowLanguageDropdown(false);
    console.log('Set localStorage language to:', newLanguage);
  };

  const settingsSections: SettingsSection[] = [
    {
      title: t('account'),
      icon: User,
      items: [
        {
          label: t('profile'),
          description: t('manageProfileInfo'),
          onClick: () => router.push('/dashboard/profile'),
        },
        {
          label: t('preferences'),
          description: t('dietaryPreferencesDesc'),
          onClick: () => router.push('/dashboard/preferences'),
        },
      ],
    },
    {
      title: t('appearance'),
      icon: theme === 'dark' ? Moon : Sun,
      items: [
        {
          label: t('theme'),
          description: theme === 'light' ? t('lightMode') : t('darkMode'),
          customAction: (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {theme === 'light' ? (
                <Sun className="w-5 h-5 text-orange-500" />
              ) : (
                <Moon className="w-5 h-5 text-blue-500" />
              )}
            </button>
          ),
        },
      ],
    },
    {
      title: t('language'),
      icon: Globe,
      items: [
        {
          label: t('language'),
          description: language === 'fr' ? t('frenchLanguage') : t('englishLanguage'),
          customAction: (
            <div className="relative z-50">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Globe className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {language === 'fr' ? 'FR' : 'EN'}
                </span>
              </button>
              {showLanguageDropdown && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-[100]">
                  <button
                    onClick={() => handleLanguageChange('fr')}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-700">{t('frenchLanguage')}</span>
                    {language === 'fr' && <Check className="w-4 h-4 text-orange-500" />}
                  </button>
                  <button
                    onClick={() => handleLanguageChange('en')}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-700">{t('englishLanguage')}</span>
                    {language === 'en' && <Check className="w-4 h-4 text-orange-500" />}
                  </button>
                </div>
              )}
            </div>
          ),
        },
      ],
    },
    {
      title: t('notifications'),
      icon: Bell,
      items: [
        {
          label: t('notificationsSettings'),
          description: t('manageNotificationPreferences'),
          onClick: () => router.push('/dashboard/notifications'),
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6" key={`${theme}-${language}`}>
      {settingsSections.map((section) => (
        <div key={`${section.title}-${theme}-${language}`} className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <section.icon className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {section.items.map((item) => (
              <div
                key={`${item.label}-${theme}-${language}`}
                className={`flex items-center justify-between p-6 hover:bg-gray-50 transition-colors ${
                  item.onClick ? 'cursor-pointer' : ''
                }`}
                onClick={item.onClick}
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.label}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                </div>
                {item.customAction ? (
                  <div onClick={(e) => e.stopPropagation()}>
                    {item.customAction}
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <ExportImport />
    </div>
  );
}
