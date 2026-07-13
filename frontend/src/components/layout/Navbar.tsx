'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/contexts/LanguageContext';

export function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { t } = useLanguage();

  const handleLogout = () => {
    logout();
    router.push('/login');
    setIsDropdownOpen(false);
  };

  const handleProfile = () => {
    router.push('/dashboard/profile');
    setIsDropdownOpen(false);
  };

  return (
    <nav className="fixed top-0 right-0 left-0 h-16 bg-white border-b border-gray-200 z-40" style={{ marginLeft: '256px' }}>
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left - Empty space */}
        <div />

        {/* Right - Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.firstname || 'User'}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-orange-600" />
              )}
            </div>
            <span className="font-medium text-gray-900">
              {user?.firstname || 'User'}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <button
                onClick={handleProfile}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">{t('profile')}</span>
              </button>
              <div className="border-t border-gray-200 my-2" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors text-red-600"
              >
                <LogOut className="w-4 h-4" />
                <span>{t('logout')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
