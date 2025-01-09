// services/authService.ts
import { fetchWithRetry } from './api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface AuthResponse {
  success: boolean;
  user: {
    lensProfileId: string;
    handle: string;
    credits: number;
  } | null;
}

interface VerifyResponse {
  valid: boolean;
  user?: {
    lensProfileId: string;
    handle: string;
    credits: number;
  };
}

export const authService = {
  verifyToken: async (): Promise<VerifyResponse> => {
    try {
      const response = await fetchWithRetry(`${API_URL}/api/auth/verify`, {
        method: 'GET'
      });

      if (response.ok) {
        const data = await response.json();
        return { valid: true, user: data.user };
      }

      return { valid: false };
    } catch (error) {
      console.error('Token verification error:', error);
      return { valid: false };
    }
  },

  signin: async (profileId: string, handle: string): Promise<AuthResponse> => {
    try {
      console.log('Attempting signin with:', { profileId, handle });

      const response = await fetchWithRetry(`${API_URL}/api/auth/signin`, {
        method: 'POST',
        body: JSON.stringify({
          lensProfileId: profileId,
          handle: handle
        })
      });

      const data = await response.json();
      console.log('Signin response:', data);

      return data;
    } catch (error) {
      console.error('Signin error:', error);
      throw new Error('Authentication failed');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await fetchWithRetry(`${API_URL}/api/auth/logout`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};