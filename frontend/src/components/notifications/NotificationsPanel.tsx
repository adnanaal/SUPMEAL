'use client';

import { useState, useEffect } from 'react';
import { Bell, X, Check, X as XIcon, BookOpen, User } from 'lucide-react';
import { invitationService, CookbookInvitation } from '@/services/invitationService';
import { cookbookService } from '@/services/cookbookService';

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [invitations, setInvitations] = useState<CookbookInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const data = await invitationService.getInvitations();
      const pending = data ? data.filter(inv => inv.status === 'PENDING') : [];
      setInvitations(pending);
      setPendingCount(pending.length);
    } catch (error) {
      console.error('Failed to load invitations:', error);
      setInvitations([]);
      setPendingCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvitations();
    // Recharger toutes les 30 secondes
    const interval = setInterval(loadInvitations, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (invitationId: number) => {
    try {
      await invitationService.acceptInvitation(invitationId);
      await loadInvitations();
      // Recharger les cookbooks pour inclure le nouveau cookbook
      await cookbookService.getAllCookbooks();
    } catch (error) {
      console.error('Failed to accept invitation:', error);
    }
  };

  const handleDecline = async (invitationId: number) => {
    try {
      await invitationService.declineInvitation(invitationId);
      await loadInvitations();
    } catch (error) {
      console.error('Failed to decline invitation:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {pendingCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {pendingCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Invitations</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : invitations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No pending invitations</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {invitations.map((invitation) => (
                  <div key={invitation.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {invitation.senderName} invited you to join
                        </p>
                        <p className="text-sm text-gray-600 font-medium mt-1">
                          {invitation.cookbookName}
                        </p>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <User className="w-3 h-3 mr-1" />
                          <span>Role: {invitation.permission}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{formatDate(invitation.sentAt)}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3 ml-13">
                      <button
                        onClick={() => handleAccept(invitation.id)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleDecline(invitation.id)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                      >
                        <XIcon className="w-4 h-4" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
