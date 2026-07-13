'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, CheckCheck, Trash2, MessageSquare, BookOpen, UserPlus, ChefHat, X } from 'lucide-react';
import { Notification, NotificationType, getLocalNotifications, getUnreadNotifications, markAsRead, markAllAsRead, deleteNotification } from '@/lib/localNotifications';

export function Notifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const currentUserId = 1; // Simuler l'utilisateur connecté

  // Charger les notifications
  useEffect(() => {
    const loadNotifications = () => {
      const allNotifications = getLocalNotifications(currentUserId);
      const unread = getUnreadNotifications(currentUserId);
      setNotifications(allNotifications);
      setUnreadCount(unread.length);
    };

    loadNotifications();

    // Auto-refresh des notifications
    const interval = setInterval(loadNotifications, 5000);
    return () => clearInterval(interval);
  }, [currentUserId]);

  const handleNotificationClick = (notification: Notification) => {
    // Marquer comme lu
    markAsRead(notification.id);
    setNotifications(notifications.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)));
    setUnreadCount(Math.max(0, unreadCount - 1));

    // Naviguer vers le contenu spécifique
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleMarkAsRead = (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(notificationId);
    setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n)));
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead(currentUserId);
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const handleDelete = (notificationId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(notificationId);
    setNotifications(notifications.filter((n) => n.id !== notificationId));
    if (notifications.find((n) => n.id === notificationId)?.isRead === false) {
      setUnreadCount(Math.max(0, unreadCount - 1));
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.COOKBOOK_MESSAGE:
        return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case NotificationType.RECIPE_COMMENT:
        return <ChefHat className="w-5 h-5 text-orange-500" />;
      case NotificationType.COOKBOOK_INVITE:
        return <UserPlus className="w-5 h-5 text-green-500" />;
      case NotificationType.MEMBER_ADDED:
        return <UserPlus className="w-5 h-5 text-purple-500" />;
      case NotificationType.RECIPE_ADDED:
        return <BookOpen className="w-5 h-5 text-pink-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.COOKBOOK_MESSAGE:
        return 'bg-blue-50 border-blue-200';
      case NotificationType.RECIPE_COMMENT:
        return 'bg-orange-50 border-orange-200';
      case NotificationType.COOKBOOK_INVITE:
        return 'bg-green-50 border-green-200';
      case NotificationType.MEMBER_ADDED:
        return 'bg-purple-50 border-purple-200';
      case NotificationType.RECIPE_ADDED:
        return 'bg-pink-50 border-pink-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (dateString: string) => {
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
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500">{unreadCount} unread</p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">You're all caught up!</p>
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
                {/* Icon */}
                <div className={`p-3 rounded-lg ${getNotificationColor(notification.type)}`}>
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{notification.content}</p>
                      <p className="text-xs text-gray-400 mt-2">{formatTime(notification.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {!notification.isRead && (
                    <button
                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDelete(notification.id, e)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
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
  );
}
