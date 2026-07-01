'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ChefHat, 
  BookOpen, 
  PlusCircle, 
  Calendar, 
  Heart, 
  Settings, 
  LogOut,
  Search,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const navigation = [
  { name: 'Tableau de bord', href: '/dashboard', icon: ChefHat },
  { name: 'Mes Recettes', href: '/recipes', icon: BookOpen },
  { name: 'Cookbooks', href: '/cookbooks', icon: BookOpen },
  { name: 'Nouvelle Recette', href: '/recipes/new', icon: PlusCircle },
  { name: 'Planning', href: '/planning', icon: Calendar },
  { name: 'Favoris', href: '/favorites', icon: Heart },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">SUPMEAL</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-orange-50 text-primary font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-gray-500'}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              <span className="text-gray-600 font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}
