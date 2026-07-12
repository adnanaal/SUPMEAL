'use client';

import { useState, useEffect } from 'react';
import { X, Edit, Shield } from 'lucide-react';
import { CookbookPermission, PERMISSION_LABELS } from '@/lib/localCookbooks';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: any;
  onUpdate: (memberId: number, permission: CookbookPermission) => void;
}

export function EditMemberModal({ isOpen, onClose, member, onUpdate }: EditMemberModalProps) {
  const [permission, setPermission] = useState<CookbookPermission>(member.permission);

  useEffect(() => {
    setPermission(member.permission);
  }, [member]);

  const handleSave = () => {
    onUpdate(member.id, permission);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Member Permission</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Member Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-500 mb-1">Member</p>
          <p className="font-medium text-gray-900">{member.userName}</p>
          <p className="text-sm text-gray-500">{member.userEmail}</p>
        </div>

        {/* Permission Selection */}
        <div className="space-y-3 mb-6">
          <p className="text-sm font-medium text-gray-700">Permission Level</p>
          {Object.values(CookbookPermission).map((perm) => (
            <div
              key={perm}
              onClick={() => setPermission(perm)}
              className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                permission === perm
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div>
                <p className="font-medium text-gray-900">{PERMISSION_LABELS[perm]}</p>
                <p className="text-sm text-gray-500">
                  {perm === CookbookPermission.CREATOR && 'Full access to all features'}
                  {perm === CookbookPermission.EDITOR && 'Can add, edit, and remove recipes'}
                  {perm === CookbookPermission.COMMENTATOR && 'Can view recipes and add comments'}
                  {perm === CookbookPermission.READER && 'Can only view recipes'}
                </p>
              </div>
              {permission === perm && (
                <div className="p-2 bg-blue-500 rounded-full">
                  <Edit className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
