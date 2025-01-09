'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@lens-protocol/react-web';
import { Loader2 } from 'lucide-react';

export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithAuthComponent(props: P) {
    const { data: session, loading: sessionLoading } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (!sessionLoading && (!session || session.type !== 'WITH_PROFILE')) {
        router.push('/connect');
      }
    }, [session, sessionLoading, router]);

    if (sessionLoading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      );
    }

    if (!session || session.type !== 'WITH_PROFILE') {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};