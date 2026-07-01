import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { apiClient } from '@/lib/api';
import { User } from '@/types';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await apiClient.get<User>('/auth/me');
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (isLoading) {
      checkAuth();
    }
  }, [isLoading, setUser, setLoading]);

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
  };
}
