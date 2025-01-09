import { useState, useEffect } from 'react';
import { useSession,  } from '@lens-protocol/react-web';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const { data: session, loading: sessionLoading } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!sessionLoading) {
      setIsAuthenticated(session?.type === 'WITH_PROFILE');
    }
  }, [session, sessionLoading]);

  const logout = async () => {
    try {
      router.push('/connect');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    isAuthenticated,
    isLoading: sessionLoading,
    session,
    logout
  };
}