import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const exportService = {
  exportUserData: async () => {
    try {
      const token = useAuthStore.getState().token;
      const userId = localStorage.getItem('userId');
      
      const response = await axios.get(`${API_BASE_URL}/export`, {
        responseType: 'blob',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(userId && { 'X-User-Id': userId }),
        },
      });
      
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extraire le nom du fichier du header Content-Disposition
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'supmeal-export.json';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    }
  },

  importUserData: async (file: File) => {
    try {
      const token = useAuthStore.getState().token;
      const userId = localStorage.getItem('userId');
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_BASE_URL}/export/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...(userId && { 'X-User-Id': userId }),
        },
      });
      
      return { success: true, message: response.data };
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  },
};
