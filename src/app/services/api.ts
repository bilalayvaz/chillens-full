// services/api.ts
import { authService } from './authService';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const getHeaders = () => ({
  'Content-Type': 'application/json'
});
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxAttempts = 3
): Promise<Response> {
  let lastError: Error;
  let currentAttempt = 0;
  
  while (currentAttempt < maxAttempts) {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          ...getHeaders(),
          ...options.headers
        }
      });
      // 401 hatası alırsak
      if (response.status === 401) {
        try {
          const verifyResult = await authService.verifyToken();
          if (verifyResult.valid) {
            // Token hala geçerliyse tekrar dene
            currentAttempt++;
            continue;
          }
          // Token geçersizse ve son deneme değilse yeni token al
          if (currentAttempt < maxAttempts - 1) {
            currentAttempt++;
            // 1 saniye bekle
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }
        } catch (verifyError) {
          console.error('Token verify error:', verifyError);
        }
      }
      // Diğer tüm hata kodları için
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error(`Attempt ${currentAttempt + 1} failed:`, error);
      lastError = error as Error;
      
      if (currentAttempt < maxAttempts - 1) {
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, currentAttempt) * 1000)
        );
      }
      currentAttempt++;
    }
  }
  throw lastError!;
}
// Post Service
export const postService = {
  create: async (postData: CreatePostDTO) => {
    const response = await fetchWithRetry(`${API_URL}/api/posts`, {
      method: 'POST',
      body: JSON.stringify(postData)
    });
    if (!response.ok) {
      throw new Error('Failed to create post');
    }
    return response.json();
  },
  getByProfile: async (profileId: string) => {
    const response = await fetchWithRetry(
      `${API_URL}/api/posts/profile/${profileId}`,
      { method: 'GET' }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch profile posts');
    }
    return response.json();
  },
  getLatest: async () => {
    const response = await fetchWithRetry(
      `${API_URL}/api/posts`,
      { method: 'GET' }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return response.json();
  }
};
// AI Post Service
export const aipostService = {
  getRandomPost: async () => {
    try {
      console.log('Fetching random post...');
      const response = await fetchWithRetry(
        `${API_URL}/api/aiposts/random`,
        { 
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        },
        5
      );
  
      if (response.status === 429) {
        throw new Error('Please wait a few minutes before creating another post');
      }
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Random post error:', errorData);
        throw new Error(errorData.message || 'Failed to fetch random post');
      }
  
      return response.json();
    } catch (error) {
      console.error('Get random post error:', error);
      throw error;
    }
  },
  updateStatus: async (postId: string) => {
    const response = await fetchWithRetry(
      `${API_URL}/api/aiposts/${postId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status: true })
      }
    );
    if (!response.ok) {
      throw new Error('Failed to update post status');
    }
  }
};
// User Service
export const userService = {
  getOrCreate: async (lensProfileId: string, handle: string) => {
    const response = await fetchWithRetry(
      `${API_URL}/api/users/get-or-create`,
      {
        method: 'POST',
        body: JSON.stringify({ lensProfileId, handle })
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get or create user');
    }
    return response.json();
  },
  useCredit: async (lensProfileId: string) => {
    const response = await fetchWithRetry(
      `${API_URL}/api/users/use-credit`,
      {
        method: 'POST',
        body: JSON.stringify({ 
          lensProfileId,
          lastPostTime: new Date().toISOString() // Post zamanını da gönder
        })
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to use credit');
    }
    return response.json();
  },
  getPostingStatus: async (lensProfileId: string) => {
    const response = await fetchWithRetry(
      `${API_URL}/api/users/posting-status/${lensProfileId}`,
      { method: 'GET' }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get posting status');
    }
    return response.json();
  }
};
// Payment Service
export const paymentService = {
  verifyPayment: async (params: VerifyPaymentParams) => {
    const response = await fetchWithRetry(
      `${API_URL}/api/payments/verify`,
      {
        method: 'POST',
        body: JSON.stringify(params)
      }
    );
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Payment verification failed');
    }
    return response.json();
  },
  getPaymentHistory: async (lensProfileId: string) => {
    const response = await fetchWithRetry(
      `${API_URL}/api/payments/history/${lensProfileId}`,
      { method: 'GET' }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch payment history');
    }
    return response.json();
  },
  getPlans: async () => {
    const response = await fetchWithRetry(
      `${API_URL}/api/payments/plans`,
      { method: 'GET' }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch plans');
    }
    return response.json();
  }
};
// Types
interface CreatePostDTO {
  content: string;
  ipfsUri: string;
  lensProfileId: string;
  handle: string;
}
interface VerifyPaymentParams {
  paymentId: string;
  userAddress: string;
  token: string;
  amount: string;
  txHash: string;
  creditAmount: number;
  price: number;
}