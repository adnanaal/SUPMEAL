import { apiClient } from '@/lib/api';

export interface UserPreferences {
  dietaryPreferences: string[];
  allergies: string[];
  favoriteCuisine: string[];
  defaultServings: number;
}

export interface UserPreferencesUpdate {
  dietaryPreferences?: string[];
  allergies?: string[];
  favoriteCuisine?: string[];
  defaultServings?: number;
}

class PreferencesService {
  private readonly baseUrl = '/users';

  async getUserPreferences(userId: number): Promise<UserPreferences> {
    console.log('Fetching preferences for user:', userId);
    const response = await apiClient.get<any>(`${this.baseUrl}/${userId}/preferences`);
    console.log('Full response:', response);
    console.log('Response data:', response.data);
    console.log('Response status:', response.status);
    // Utiliser response.data si disponible, sinon response
    const data = response.data !== undefined ? response.data : response;
    console.log('Final data to return:', data);
    return data;
  }

  async updateUserPreferences(userId: number, preferences: UserPreferencesUpdate): Promise<UserPreferences> {
    console.log('Updating preferences for user:', userId, preferences);
    const response = await apiClient.put<any>(`${this.baseUrl}/${userId}/preferences`, preferences);
    console.log('Full update response:', response);
    console.log('Update response data:', response.data);
    // Utiliser response.data si disponible, sinon response
    const data = response.data !== undefined ? response.data : response;
    console.log('Final update data to return:', data);
    return data;
  }

  // Helper methods to convert between formats
  parseStringArray(value: string | null): string[] {
    if (!value) return [];
    try {
      return JSON.parse(value);
    } catch {
      return value.split(',').map(s => s.trim()).filter(s => s);
    }
  }

  stringifyArray(array: string[]): string {
    return JSON.stringify(array);
  }
}

export const preferencesService = new PreferencesService();
