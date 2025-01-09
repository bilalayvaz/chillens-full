// services/authService.ts
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
      const response = await fetch(`${API_URL}/api/auth/verify`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
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
    const response = await fetch(`${API_URL}/api/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        lensProfileId: profileId,
        handle: handle
      })
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    return response.json();
  },

  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
};