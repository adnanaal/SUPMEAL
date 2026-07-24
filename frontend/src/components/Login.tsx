'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChefHat, Mail, Lock, AlertCircle } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import { useLanguage } from '@/contexts/LanguageContext';

export function Login() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authService.login(email, password);
      
      // Stocker l'userId dans localStorage pour le filtrage côté serveur
      localStorage.setItem('userId', response.id.toString());
      
      // Stocker le token et l'utilisateur dans le store
      setToken(response.token);
      setUser({
        id: response.id,
        email: response.email,
        firstname: response.firstname,
        lastname: response.lastname,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      // Rediriger vers le dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || t('loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-green-50 px-4">
      <div className="max-w-md w-full">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 hover:opacity-80 transition">
            <ChefHat className="w-8 h-8 text-white" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{t('loginTitle')}</h1>
          <p className="text-gray-600 mt-2">{t('loginSubtitle')}</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('emailLabel')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  placeholder={t('emailPlaceholder')}
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('passwordLabel')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                  placeholder={t('passwordPlaceholder')}
                  required
                />
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('loginButtonLoading') : t('loginButton')}
            </button>
          </form>

          {/* Lien vers inscription */}
          <p className="text-center text-sm text-gray-600 mt-6">
            {t('noAccount')}{' '}
            <Link href="/register" className="text-primary hover:text-primary-hover font-medium">
              {t('signUpLink')}
            </Link>
          </p>
        </div>

        {/* Retour à l'accueil */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            {t('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
