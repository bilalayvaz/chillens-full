'use client';

import { useState } from 'react';
import Feed from '../components/Feed';
import Navbar from '../components/Navbar';
import { useSession } from '@lens-protocol/react-web';
import { useRouter } from 'next/navigation';
import { PostModal } from '../components/PostModal';

export default function FeedPage() {
  const [postIsCreating, setPostIsCreating] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleShareClick = () => {
    // Önce session kontrolü
    if (!session || session.type !== 'WITH_PROFILE') {
      router.push('/connect');
      return;
    }
    setPostIsCreating(true);
  };

  const handleModalClose = () => {
    setPostIsCreating(false);
    setIsUpdated(prev => !prev); // Feed'i yenile
  };
 
  // page.tsx'i düzenleyelim
return (
  <>
    <Navbar/>
    <main className="container">
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-8">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-8">
            <p className="text-gray-700 flex-1 text-center md:text-right text-lg md:text-3xl md:ml-20">
              <span className="text-red-500">GM</span>, Lensfrens! are you bored?{' '}
              <span className="text-red-500">click</span> this button now to
            </p>
            <button 
              className="border border-black px-4 py-4 mb-4 text-red-400 text-3xl md:text-6xl leading-tight flex-1 hover:bg-[#ff3131] hover:bg-opacity-10 transition-colors"
              onClick={handleShareClick}
            >
              <span className="text-red-500 block text-3xl md:text-6xl">SHARE</span>
              <span className="text-red-500 block text-3xl md:text-6xl">SOMETHING</span>
            </button>
            <p className="text-gray-700 flex-1 text-center md:text-left text-lg md:text-3xl md:mr-20">
              <span className="text-red-500">funny</span> on Lens to{' '}
              <span className="text-red-500">feel better</span> and make others{' '}
              <span className="text-red-500">feel better</span>
            </p>
          </div>
        </div>

        <h2 className="text-center md:text-left text-lg md:text-4xl font-medium mb-6 md:mb-8">
          Recent <span className="text-red-500">Funny</span> Contents:
        </h2>

        {/* Feed component'ini direkt çağırıyoruz */}
        <Feed isUpdated={isUpdated} />

        <PostModal 
          isOpen={postIsCreating} 
          onClose={handleModalClose}
        />
      </div>
    </main>
  </>
);
}