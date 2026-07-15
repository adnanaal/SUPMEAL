'use client';

import { useState } from 'react';
import { X, UserPlus, Mail } from 'lucide-react';
import { CookbookPermission } from '@/types';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  cookbookId: number;
  onInvited: () => void;
}

export function InviteMemberModal({ isOpen, onClose, cookbookId, onInvited }: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<CookbookPermission>(CookbookPermission.READER);
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }

    try {
      setIsInviting(true);
      
      // Simuler l'invitation (sera remplacé par l'API)
      console.log('Inviting member:', { email, permission, cookbookId });
      
      // Pour l'instant, on pourrait ajouter un membre temporaire
      // addCookbookMember(cookbookId, { ... });
      
      onInvited();
      setEmail('');
      setPermission(CookbookPermission.READER);
    } catch (err) {
      console.error('Failed to invite member:', err);
    } finally {
      setIsInviting(false);
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Invite Member</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@example.com"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                disabled={isInviting}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="permission" className="block text-sm font-medium text-gray-700 mb-2">
              Permission Level
            </label>
            <select
              id="permission"
              value={permission}
              onChange={(e) => setPermission(e.target.value as CookbookPermission)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              disabled={isInviting}
            >
              <option value={CookbookPermission.READER}>Reader - Can only view recipes</option>
              <option value={CookbookPermission.COMMENTATOR}>Commentator - Can view and comment</option>
              <option value={CookbookPermission.EDITOR}>Editor - Can add/edit recipes</option>
              <option value={CookbookPermission.CREATOR}>Creator - Full access</option>
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> An invitation email will be sent to the member. They will need to accept the invitation to join the cookbook.
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              disabled={isInviting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isInviting || !email.trim()}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-5 h-5" />
              <span>{isInviting ? 'Inviting...' : 'Send Invite'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
