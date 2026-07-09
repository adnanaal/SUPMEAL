'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Utensils, 
  Calendar, 
  BookOpen, 
  Heart, 
  Bell, 
  MessageSquare, 
  Settings,
  ChefHat,
  LucideIcon
} from 'lucide-react';

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { label: 'Recipes', href: '/dashboard', icon: Utensils },
  { label: 'Meal Planner', href: '/dashboard/meal-planner', icon: Calendar },
  { label: 'Cookbooks', href: '/dashboard/cookbooks', icon: BookOpen },
  { label: 'Favorites', href: '/dashboard/favorites', icon: Heart },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

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
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
