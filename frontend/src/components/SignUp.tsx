'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChefHat, Mail, Lock, User, AlertCircle } from 'lucide-react';
import { authService, RegisterRequest } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';

export function SignUp() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    setIsLoading(true);

    try {
      const registerData: RegisterRequest = {
        firstname,
        lastname,
        email,
        password,
        avatar: undefined,
        dietaryPreferences: undefined,
        allergies: undefined,
        favoriteCuisine: undefined,
        defaultServings: undefined,
      };

      console.log('Sending registration data:', registerData);
      const userResponse = await authService.register(registerData);
      console.log('Registration response:', userResponse);
      
      // Après inscription réussie, connecter automatiquement
      const authResponse = await authService.login(email, password);
      
      // Stocker le token et l'utilisateur dans le store
      setToken(authResponse.token);
      setUser({
        id: authResponse.id,
        email: authResponse.email,
        firstname: authResponse.firstname,
        lastname: authResponse.lastname,
        isVerified: userResponse.isVerified || false,
        createdAt: userResponse.createdAt || new Date().toISOString(),
        updatedAt: userResponse.updatedAt || new Date().toISOString(),
      });
      
      // Rediriger vers le dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(err.response?.data?.message || err.response?.data || 'Échec de l\'inscription. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-green-50 px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 hover:opacity-80 transition">
            <ChefHat className="w-8 h-8 text-white" />
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">SUPMEAL</h1>
          <p className="text-gray-600 mt-2">Créez votre compte pour commencer</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Nom */}
            <div>
              <label htmlFor="firstname" className="block text-sm font-medium text-gray-700 mb-2">
                Prénom
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="firstname"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-gray-900"
                  placeholder="Votre prénom"
                  required
                />
              </div>
            </div>

            {/* Nom de famille */}
            <div>
              <label htmlFor="lastname" className="block text-sm font-medium text-gray-700 mb-2">
                Nom de famille
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="lastname"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-gray-900"
                  placeholder="Votre nom de famille"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-gray-900"
                  placeholder="vous@exemple.com"
                  required
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-gray-900"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-gray-900"
                  placeholder="••••••••"
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

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Création du compte...' : 'S\'inscrire'}
            </button>
          </form>

          {/* Lien vers connexion */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Déjà un compte ?{' '}
            <Link href="/login" className="text-primary hover:text-primary-hover font-medium">
              Se connecter
            </Link>
          </p>
        </div>

        {/* Retour à l'accueil */}
        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
