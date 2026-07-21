'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Utensils, 
  Calendar, 
  BookOpen, 
  Layers, 
  Bell, 
  Settings,
  ChefHat,
  ShoppingCart,
  Home,
  Heart,
  LucideIcon
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { invitationService } from '@/services/invitationService';
import { notificationService } from '@/services/notificationService';

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  translationKey: string;
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const pathname = usePathname();
  const { t } = useLanguage();

  const loadPendingCount = async () => {
    try {
      const [invitations, notifications] = await Promise.all([
        invitationService.getInvitations(),
        notificationService.getNotifications()
      ]);
      
      const pendingInvitations = invitations ? invitations.filter(inv => inv.status === 'PENDING') : [];
      const unreadNotifications = notifications ? notifications.filter(n => !n.isRead) : [];
      
      setPendingCount(pendingInvitations.length + unreadNotifications.length);
    } catch (error) {
      console.error('Failed to load pending count:', error);
    }
  };

  useEffect(() => {
    loadPendingCount();
    const interval = setInterval(loadPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const menuItems: MenuItem[] = [
    { label: 'Home Page', href: '/dashboard', icon: Home, translationKey: 'homePage' },
    { label: 'Recipes', href: '/dashboard/recipes', icon: Utensils, translationKey: 'recipes' },
    { label: 'Meal Planner', href: '/dashboard/meal-planner', icon: Calendar, translationKey: 'mealPlanner' },
    { label: 'Shopping Lists', href: '/dashboard/shopping-lists', icon: ShoppingCart, translationKey: 'shoppingLists' },
    { label: 'Cookbooks', href: '/dashboard/cookbooks', icon: BookOpen, translationKey: 'cookbooks' },
    { label: 'Organizers', href: '/dashboard/organizers', icon: Layers, translationKey: 'organizers' },
    { label: 'Notifications', href: '/dashboard/notifications', icon: Bell, translationKey: 'notifications' },
    { label: 'Preferences', href: '/dashboard/preferences', icon: Heart, translationKey: 'preferences' },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings, translationKey: 'settings' },
  ];

  return (
    <div 
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 hover:bg-gray-50 transition-colors z-50"
      >
        {isCollapsed ? (
          <Menu className="w-4 h-4 text-gray-600" />
        ) : (
          <X className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold text-gray-900">SUPMEAL</span>
          )}
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          const showBadge = item.translationKey === 'notifications' && pendingCount > 0;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors relative ${
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
                {showBadge && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </div>
              {!isCollapsed && <span className="font-medium">{t(item.translationKey)}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
