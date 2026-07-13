'use client';

import { DietaryPreferences } from '@/components/preferences/DietaryPreferences';
import { Sidebar } from '@/components/layout/Sidebar';
import { Navbar } from '@/components/layout/Navbar';
import { getLocalPreferences, updateLocalPreferences } from '@/lib/localPreferences';

export default function PreferencesPage() {
  const preferences = getLocalPreferences();

  const handleSave = (savedPreferences: any) => {
    updateLocalPreferences(savedPreferences);
    console.log('Saving preferences:', savedPreferences);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />
      <div className="ml-64 pt-16 p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Dietary Preferences</h1>
          <p className="text-gray-500 mt-1">Customize your dietary preferences and cooking habits</p>
        </div>
        <DietaryPreferences preferences={preferences} onSave={handleSave} />
      </div>
    </div>
  );
}
