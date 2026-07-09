import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, description }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : '-'}{trend.value}%
              </span>
              <span className="text-sm text-gray-500 ml-2">vs last month</span>
            </div>
          )}
          {description && (
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          )}
        </div>
        <div className="ml-4 p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
}
