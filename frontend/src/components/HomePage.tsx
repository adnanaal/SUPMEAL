'use client';

import Link from 'next/link';
import { ChefHat, BookOpen, Users, Heart, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function HomePage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">SUPMEAL</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2"
              >
                {t('login')}
              </Link>
              <Link
                href="/register"
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition font-medium"
              >
                {t('signUp')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {t('heroDescription')}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg hover:bg-primary-hover transition font-medium text-lg"
            >
              {t('startFree')}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-gray-400 transition font-medium text-lg"
            >
              {t('signIn')}
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<BookOpen className="w-8 h-8" />}
            title={t('recipeManagement')}
            description={t('recipeManagementDesc')}
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title={t('sharedCookbooks')}
            description={t('sharedCookbooksDesc')}
          />
          <FeatureCard
            icon={<Heart className="w-8 h-8" />}
            title={t('favoritesPlanning')}
            description={t('favoritesPlanningDesc')}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>{t('copyright')}</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
        <div className="text-primary">{icon}</div>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
