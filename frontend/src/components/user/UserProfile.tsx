'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, Camera, Edit2, Check, X, ArrowLeft } from 'lucide-react';
import { authService, UserResponse } from '@/services/authService';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuthStore } from '@/stores/authStore';

export function UserProfile() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch from API only - no local fallback
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setFirstname(userData.firstname);
      setLastname(userData.lastname);
      setEmail(userData.email);
      setAvatar(userData.avatar || '');
    } catch (error) {
      console.error('Failed to load user data:', error);
      setError(t('failedToLoadProfile') || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveName = () => {
    setIsEditingName(false);
  };

  const handleCancelName = () => {
    if (user) {
      setFirstname(user.firstname);
      setLastname(user.lastname);
    }
    setIsEditingName(false);
  };

  const handleSaveEmail = () => {
    setIsEditingEmail(false);
  };

  const handleCancelEmail = () => {
    if (user) {
      setEmail(user.email);
    }
    setIsEditingEmail(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert(t('passwordsDoNotMatch') || 'Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      alert(t('passwordMinLength') || 'Password must be at least 8 characters');
      return;
    }
    if (!currentPassword) {
      alert(t('currentPasswordRequired') || 'Current password is required');
      return;
    }
    
    try {
      await authService.changePassword({
        currentPassword,
        newPassword,
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);
      alert(t('passwordChangedSuccess') || 'Password changed successfully');
    } catch (error) {
      console.error('Failed to change password:', error);
      alert(t('passwordChangeError') || 'Failed to change password. Please check your current password.');
    }
  };

  const handleCancelPassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsChangingPassword(false);
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      
      // Call API to update profile in database
      const updatedUser = await authService.updateProfile({
        firstname,
        lastname,
        email,
        avatar,
      });
      
      // Update authStore with the new data
      const userForAuthStore = {
        id: updatedUser.id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        dietaryPreferences: updatedUser.dietaryPreferences,
        allergies: updatedUser.allergies,
        favoriteCuisine: updatedUser.favoriteCuisine,
        defaultServings: updatedUser.defaultServings,
        isVerified: updatedUser.isVerified || false,
        createdAt: updatedUser.createdAt || new Date().toISOString(),
        updatedAt: updatedUser.updatedAt || new Date().toISOString(),
      };
      
      const { setUser: setAuthUser } = useAuthStore.getState();
      setAuthUser(userForAuthStore);
      
      // Update local state
      setUser(updatedUser);
      
      alert(t('profileSavedSuccess') || 'Profile saved successfully');
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert(t('profileSaveError') || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{t('failedToLoadProfile') || 'Failed to load profile'}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => router.push('/dashboard/settings')}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{t('profile')}</h1>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">{error}</p>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-6">
        <div className="flex items-center space-x-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-100 bg-orange-50">
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 text-orange-300" />
                </div>
              )}
            </div>
            <button
              onClick={handleAvatarClick}
              className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors shadow-lg"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {firstname} {lastname}
            </h1>
            <p className="text-gray-500 mt-1">{email}</p>
            <div className="flex items-center space-x-2 mt-3">
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {t('verified')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="space-y-6">
        {/* Name Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">{t('name')}</h2>
            </div>
            {!isEditingName && (
              <button
                onClick={() => setIsEditingName(true)}
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm">{t('edit')}</span>
              </button>
            )}
          </div>

          {isEditingName ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('firstName')}</label>
                  <input
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('lastName')}</label>
                  <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-gray-900"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveName}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>{t('save')}</span>
                </button>
                <button
                  onClick={handleCancelName}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>{t('cancel')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('firstName')}</p>
                <p className="text-gray-900 font-medium">{firstname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('lastName')}</p>
                <p className="text-gray-900 font-medium">{lastname}</p>
              </div>
            </div>
          )}
        </div>

        {/* Email Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">{t('email')}</h2>
            </div>
            {!isEditingEmail && (
              <button
                onClick={() => setIsEditingEmail(true)}
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm">{t('edit')}</span>
              </button>
            )}
          </div>

          {isEditingEmail ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('emailAddress')}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveEmail}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>{t('save')}</span>
                </button>
                <button
                  onClick={handleCancelEmail}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>{t('cancel')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('emailAddress')}</p>
              <p className="text-gray-900 font-medium">{email}</p>
            </div>
          )}
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">{t('password')}</h2>
            </div>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm">{t('change')}</span>
              </button>
            )}
          </div>

          {isChangingPassword ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('currentPassword')}</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('newPassword')}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('confirmNewPassword')}</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleChangePassword}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>{t('changePassword')}</span>
                </button>
                <button
                  onClick={handleCancelPassword}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>{t('cancel')}</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('password')}</p>
              <p className="text-gray-900 font-medium">••••••••••••</p>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center space-x-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>{t('loading')}</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>{t('saveProfile')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
