import { Cookbook } from '@/types';
import { BookOpen, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface CookbookListProps {
  cookbooks: Cookbook[];
  title?: string;
}

export function CookbookList({ cookbooks, title = 'My Cookbooks' }: CookbookListProps) {
  if (cookbooks.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-500 text-center py-8">No cookbooks found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cookbooks.map((cookbook) => (
          <div
            key={cookbook.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 truncate">{cookbook.name}</h3>
                {cookbook.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{cookbook.description}</p>
                )}
              </div>
              <div className="ml-2 p-2 bg-blue-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>Owner: {cookbook.owner?.firstname || 'Unknown'}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {cookbook.createdAt && format(new Date(cookbook.createdAt), 'MMM d, yyyy')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
