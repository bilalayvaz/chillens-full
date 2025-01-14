// services/api.ts
import { authService } from './authService';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const MAX_RETRY_ATTEMPTS = process.env.NODE_ENV === 'production' ? 2 : 3;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json'
});

const retryDelay = (attempt: number) => Math.min(1000 * Math.pow(2, attempt), 5000);

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxAttempts = MAX_RETRY_ATTEMPTS
): Promise<Response> {
  let lastError: Error;
  let currentAttempt = 0;
  
  while (currentAttempt < maxAttempts) {
    try {
      console.log(`Attempt ${currentAttempt + 1} for ${url}`);
      
      const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          ...getHeaders(),
          ...options.headers
        }
      });

      if (response.status === 401) {
        try {
          const verifyResult = await authService.verifyToken();
          if (verifyResult.valid) {
            currentAttempt++;
            await new Promise(resolve => setTimeout(resolve, retryDelay(currentAttempt)));
            continue;
          }
        } catch (verifyError) {
          console.error('Token verification failed:', verifyError);
        }
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error(`Request failed (attempt ${currentAttempt + 1}):`, error);
      lastError = error as Error;
      
      if (currentAttempt < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, retryDelay(currentAttempt)));
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
    return response.json();
  },

  getByProfile: async (profileId: string) => {
    const response = await fetchWithRetry(
      `${API_URL}/api/posts/profile/${profileId}`,
      { method: 'GET' }
    );
    return response.json();
  },

  getLatest: async (page: number = 1) => {
    try {
      const response = await fetchWithRetry(
        `${API_URL}/api/posts?page=${page}`,  // page parametresini URL'e ekledik
        { method: 'GET' }
      );
      const data = await response.json();
      return {
        posts: data.posts || [],
        hasMore: data.hasMore
      };
    } catch (error) {
      console.error('Error in getLatest:', error);
      return { posts: [], hasMore: false };
    }
  }
};

// AI Post Service
export const aipostService = {
  getRandomPost: async () => {
    const response = await fetchWithRetry(
      `${API_URL}/api/aiposts/random`,
      { method: 'GET' }
    );
    return response.json();
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
    return response.json();
  },

  useCredit: async (lensProfileId: string) => {
    const response = await fetchWithRetry(
      `${API_URL}/api/users/use-credit`,
      {
        method: 'POST',
        body: JSON.stringify({ 
          lensProfileId,
          lastPostTime: new Date().toISOString()
        })
      }
    );
    return response.json();
  },

  getPostingStatus: async (lensProfileId: string) => {
    const response = await fetchWithRetry(
      `${API_URL}/api/users/posting-status/${lensProfileId}`,
      { method: 'GET' }
    );
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
    return response.json();
  },

  getPaymentHistory: async (lensProfileId: string) => {
    const response = await fetchWithRetry(
      `${API_URL}/api/payments/history/${lensProfileId}`,
      { method: 'GET' }
    );
    return response.json();
  },

  getPlans: async () => {
    const response = await fetchWithRetry(
      `${API_URL}/api/payments/plans`,
      { method: 'GET' }
    );
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