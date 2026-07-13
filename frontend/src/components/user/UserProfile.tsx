'use client';

import { useState, useRef } from 'react';
import { User, Mail, Lock, Camera, Edit2, Check, X } from 'lucide-react';

interface UserProfileProps {
  user: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    avatar?: string;
  };
}

export function UserProfile({ user }: UserProfileProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [firstname, setFirstname] = useState(user.firstname);
  const [lastname, setLastname] = useState(user.lastname);
  const [email, setEmail] = useState(user.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(user.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // Save name logic here
    setIsEditingName(false);
  };

  const handleCancelName = () => {
    setFirstname(user.firstname);
    setLastname(user.lastname);
    setIsEditingName(false);
  };

  const handleSaveEmail = () => {
    // Save email logic here
    setIsEditingEmail(false);
  };

  const handleCancelEmail = () => {
    setEmail(user.email);
    setIsEditingEmail(false);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    // Change password logic here
    setIsChangingPassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    alert('Password changed successfully');
  };

  const handleCancelPassword = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsChangingPassword(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
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
                Verified
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
              <h2 className="text-lg font-semibold text-gray-900">Name</h2>
            </div>
            {!isEditingName && (
              <button
                onClick={() => setIsEditingName(true)}
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm">Edit</span>
              </button>
            )}
          </div>

          {isEditingName ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={lastname}
                    onChange={(e) => setLastname(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveName}
                  className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancelName}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">First Name</p>
                <p className="text-gray-900 font-medium">{firstname}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Last Name</p>
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
              <h2 className="text-lg font-semibold text-gray-900">Email</h2>
            </div>
            {!isEditingEmail && (
              <button
                onClick={() => setIsEditingEmail(true)}
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm">Edit</span>
              </button>
            )}
          </div>

          {isEditingEmail ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
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
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancelEmail}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-1">Email Address</p>
              <p className="text-gray-900 font-medium">{email}</p>
            </div>
          )}
        </div>

        {/* Password Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Password</h2>
            </div>
            {!isChangingPassword && (
              <button
                onClick={() => setIsChangingPassword(true)}
                className="flex items-center space-x-2 text-orange-600 hover:text-orange-700"
              >
                <Edit2 className="w-4 h-4" />
                <span className="text-sm">Change</span>
              </button>
            )}
          </div>

          {isChangingPassword ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
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
                  <span>Change Password</span>
                </button>
                <button
                  onClick={handleCancelPassword}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-1">Password</p>
              <p className="text-gray-900 font-medium">••••••••••••</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
