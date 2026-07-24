'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, CheckCheck, Trash2, MessageSquare, BookOpen, UserPlus, ChefHat, X, Book } from 'lucide-react';
import { invitationService, CookbookInvitation } from '@/services/invitationService';
import { notificationService, Notification } from '@/services/notificationService';
import { useLanguage } from '@/contexts/LanguageContext';

export function Notifications() {
  const router = useRouter();
  const { t } = useLanguage();
  const [receivedInvitations, setReceivedInvitations] = useState<CookbookInvitation[]>([]);
  const [sentInvitations, setSentInvitations] = useState<CookbookInvitation[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Charger les invitations et notifications depuis le backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const [received, sent, notifs] = await Promise.all([
          invitationService.getInvitations(),
          invitationService.getSentInvitations(),
          notificationService.getNotifications()
        ]);
        setReceivedInvitations(received || []);
        setSentInvitations(sent || []);
        setNotifications(notifs || []);
        const pendingInvitations = (received || []).filter(inv => inv.status === 'PENDING').length;
        const unreadNotifs = (notifs || []).filter(n => !n.isRead).length;
        setUnreadCount(pendingInvitations + unreadNotifs);
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };

    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAcceptInvitation = async (invitationId: number) => {
    try {
      await invitationService.acceptInvitation(invitationId);
      const [received, sent, notifs] = await Promise.all([
        invitationService.getInvitations(),
        invitationService.getSentInvitations(),
        notificationService.getNotifications()
      ]);
      setReceivedInvitations(received || []);
      setSentInvitations(sent || []);
      setNotifications(notifs || []);
      const pendingInvitations = (received || []).filter(inv => inv.status === 'PENDING').length;
      const unreadNotifs = (notifs || []).filter(n => !n.isRead).length;
      setUnreadCount(pendingInvitations + unreadNotifs);
    } catch (error) {
      console.error('Failed to accept invitation:', error);
    }
  };

  const handleDeclineInvitation = async (invitationId: number) => {
    try {
      await invitationService.declineInvitation(invitationId);
      const [received, sent, notifs] = await Promise.all([
        invitationService.getInvitations(),
        invitationService.getSentInvitations(),
        notificationService.getNotifications()
      ]);
      setReceivedInvitations(received || []);
      setSentInvitations(sent || []);
      setNotifications(notifs || []);
      const pendingInvitations = (received || []).filter(inv => inv.status === 'PENDING').length;
      const unreadNotifs = (notifs || []).filter(n => !n.isRead).length;
      setUnreadCount(pendingInvitations + unreadNotifs);
    } catch (error) {
      console.error('Failed to decline invitation:', error);
    }
  };

  const handleDeleteInvitation = async (invitationId: number) => {
    try {
      await invitationService.deleteInvitation(invitationId);
      setSentInvitations(sentInvitations.filter(inv => inv.id !== invitationId));
    } catch (error) {
      console.error('Failed to delete invitation:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
      if (notifications.find(n => n.id === notificationId)?.isRead === false) {
        setUnreadCount(Math.max(0, unreadCount - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (notification.link) {
      console.log('Navigating to:', notification.link);
      router.push(notification.link);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('justNow');
    if (diffMins < 60) return `${diffMins}${t('minutesAgo')}`;
    if (diffHours < 24) return `${diffHours}${t('hoursAgo')}`;
    if (diffDays < 7) return `${diffDays}${t('daysAgo')}`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'ACCEPTED':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'DECLINED':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'COOKBOOK_MESSAGE':
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'RECIPE_COMMENT':
        return <ChefHat className="w-5 h-5 text-orange-500" />;
      case 'COOKBOOK_INVITATION':
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case 'MEMBER_ADDED':
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      case 'RECIPE_ADDED':
        return <BookOpen className="w-5 h-5 text-pink-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'COOKBOOK_MESSAGE':
        return 'bg-blue-50 border-blue-200';
      case 'RECIPE_COMMENT':
        return 'bg-orange-50 border-orange-200';
      case 'COOKBOOK_INVITATION':
        return 'bg-green-50 border-green-200';
      case 'MEMBER_ADDED':
        return 'bg-purple-50 border-purple-200';
      case 'RECIPE_ADDED':
        return 'bg-pink-50 border-pink-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bell className="w-8 h-8 text-orange-600" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('notificationsTitle')}</h1>
            <p className="text-sm text-gray-500">{unreadCount} {t('unread')}</p>
          </div>
        </div>
      </div>

      {/* Received Invitations */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <UserPlus className="w-5 h-5" />
          <span>{t('receivedInvitations')}</span>
        </h2>
        <div className="space-y-3">
          {receivedInvitations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <UserPlus className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t('noPendingInvitations')}</p>
            </div>
          ) : (
            receivedInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className={`bg-white rounded-xl shadow-sm border p-4 ${
                  invitation.status === 'PENDING' ? 'border-orange-200 border-l-4' : 'border-gray-100'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <Book className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {invitation.senderName} {t('invitedYouToJoin')} <span className="font-semibold">{invitation.cookbookName}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{t('role')}: {invitation.permission}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatTime(invitation.sentAt)}</p>
                    <div className="mt-3 flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                        {invitation.status}
                      </span>
                    </div>
                  </div>
                  {invitation.status === 'PENDING' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAcceptInvitation(invitation.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        <Check className="w-4 h-4" />
                        <span>{t('accept')}</span>
                      </button>
                      <button
                        onClick={() => handleDeclineInvitation(invitation.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                      >
                        <X className="w-4 h-4" />
                        <span>{t('decline')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sent Invitations */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <BookOpen className="w-5 h-5" />
          <span>{t('sentInvitations')}</span>
        </h2>
        <div className="space-y-3">
          {sentInvitations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t('noSentInvitations')}</p>
            </div>
          ) : (
            sentInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-3 rounded-lg bg-purple-50">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {t('youInvited')} {invitation.receiverName} {t('toJoin')} <span className="font-semibold">{invitation.cookbookName}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{t('role')}: {invitation.permission}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatTime(invitation.sentAt)}</p>
                    <div className="mt-3 flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
                        {invitation.status}
                      </span>
                    </div>
                  </div>
                  {invitation.status === 'PENDING' && (
                    <button
                      onClick={() => handleDeleteInvitation(invitation.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={t('deleteInvitation')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Other Notifications */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Bell className="w-5 h-5" />
          <span>{t('activityNotifications')}</span>
        </h2>
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">{t('noActivityNotifications')}</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-white rounded-xl shadow-sm border p-4 cursor-pointer transition-all hover:shadow-md ${
                  notification.isRead ? 'border-gray-100 opacity-70' : 'border-orange-200 border-l-4'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                      {notification.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatTime(notification.createdAt)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.isRead && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title={t('markAsRead')}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={t('delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
