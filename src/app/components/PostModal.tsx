import { useState, useCallback } from 'react';
import { useCreatePost, useSession, ProfileSession, Session } from '@lens-protocol/react-web';
import { textOnly } from '@lens-protocol/metadata';
import lighthouse from '@lighthouse-web3/sdk';
import { postService, userService, aipostService } from '../services/api';
import { useAppStore } from '../store/useAppStore';


interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function isAuthenticatedSession(session: Session | null | undefined): session is ProfileSession {
  if (!session) return false;
  return session.type === 'WITH_PROFILE' && !!session.profile?.id;
}

export function PostModal({ isOpen, onClose }: PostModalProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'signing' | 'success' | 'error' | 'waiting'>('idle');
  const { execute: create } = useCreatePost();
  const { data: session } = useSession();
  const { credits, refreshCredits, updateLastPostTime } = useAppStore();

  const createPost = useCallback(async () => {
    if (!isAuthenticatedSession(session)) {
      setStatus('error');
      return;
    }

    if (!credits || credits <= 0) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    try {
      const randomPost = await aipostService.getRandomPost();

      if (!randomPost?.createdContent) {
        throw new Error('No content available');
      }

      const metadata = textOnly({
        content: randomPost.createdContent,
        locale: 'eu',
        tags: ['chillens'],
        appId: 'chillens',
      });

      const ipfsResponse = await lighthouse.uploadText(
        JSON.stringify(metadata),
        process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY || ''
      );

      if (!ipfsResponse.data.Hash) {
        throw new Error('IPFS upload failed');
      }

      const metadataURI = `https://gateway.lighthouse.storage/ipfs/${ipfsResponse.data.Hash}`;
      
      setStatus('signing');
      const result = await create({ metadata: metadataURI });

      if (!result || result.isFailure()) {
        throw new Error('Failed to create post on Lens');
      }

      await Promise.all([
        postService.create({
          content: randomPost.createdContent,
          ipfsUri: metadataURI,
          lensProfileId: session.profile.id,
          handle: session.profile.handle?.fullHandle || '',
        }),
        userService.useCredit(session.profile.id),
        aipostService.updateStatus(randomPost._id)
      ]);

      updateLastPostTime();
      await refreshCredits(session.profile.id, session.profile.handle?.fullHandle || '');
      
      //analytics
      window.dataLayer?.push({
        event: 'share_post',
        category: 'engagement',
        user: session.profile.handle?.fullHandle || 'unknown_user'
      });

      setStatus('success');
    } catch (error: any) {
      console.error('Post creation error:', error);
      
      if (error?.message?.includes('task while another is in progress')) {
        return;
      }
    
      // 3 dakika bekleme hatası kontrolü
      if (
        error?.message?.includes('Please wait before creating another post') ||
        error?.response?.data?.message?.includes('Please wait before creating another post') ||
        error?.response?.status === 429
      ) {
        setStatus('waiting');
        return;
      }
      
      setStatus('error');
    }
  }, [session, credits, create, refreshCredits, updateLastPostTime]);

  // Modal kapandığında state'i resetle
  if (!isOpen) {
    if (status !== 'idle') setStatus('idle');
    return null;
  }

  // Modal ilk açıldığında post oluşturmayı başlat
  if (isOpen && status === 'idle') {
    createPost();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={!['loading', 'signing'].includes(status) ? onClose : undefined} />
      
      <div className="relative bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
        {!['loading', 'signing'].includes(status) && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}

        {(status === 'loading' || status === 'signing') && (
          <div className="text-center mb-4">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto" />
            </div>
            <h3 className="text-xl font-medium mb-2">
              {status === 'signing' ? 'WAITING FOR SIGNATURE...' : 'WAIT, WE ARE PREPARING'}
            </h3>
            <p className="text-xl mb-2">
              <span className="text-red-500 font-medium">FUNNIEST</span> POST FOR YOU!
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center mb-6">
            <h3 className="text-xl mb-2">
              <span className="text-red-500 font-medium">FUNNIEST</span> POST IS PUBLISHED
            </h3>
            <p className="text-lg">FOR YOU! GO AND CHECK YOUR</p>
            <p className="text-lg mb-4">PROFILE TO SEE IT.</p>
            <button
              onClick={onClose}
              className="mt-4 px-8 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              OK
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <h3 className="text-xl mb-4">Something went wrong!</h3>
            <p className="text-gray-600 mb-4">
              There was an error while creating your post. Please try again.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              OK
            </button>
          </div>
        )}
            {status === 'waiting' && (
      <div className="text-center">
        <h3 className="text-xl mb-4">Please Wait</h3>
        <p className="text-gray-600 mb-4">
        You must wait 3 minutes before posting again.
        </p>
        <button
          onClick={onClose}
          className="px-8 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          OK
        </button>
      </div>
    )}
      </div>
    </div>
  );
}