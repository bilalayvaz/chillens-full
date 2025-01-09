'use client';

import { useState } from 'react';
import { useSession, ProfileSession } from '@lens-protocol/react-web';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import ProfileFeed from '../components/ProfileFeed';
import { withAuth } from '../components/hoc/withAuth';
import { PostModal } from '../components/PostModal';

function UserInfoCard({ profile }: { profile: ProfileSession['profile'] }) {
  if (!profile) return null;

  return (
    <div className="bg-white p-6 border border-gray-200">
      <div className="flex flex-row gap-8 md:gap-0 md:flex-col items-center mb-4"> 
        <div className="w-32 h-32 mb-4 md:mb-0"> 
          <Image 
            src="/chillensAvatar.svg" 
            alt="Profile Avatar"
            width={350}
            height={350}
          />
        </div>
        <div className="text-left md:text-left md:mt-6 flex flex-col space-y-2"> 
          <h1 className="text-2xl font-bold mb-1">
            {profile.metadata?.displayName}
          </h1>
          <p className="text-gray-600 mb-2">
            @{profile.handle?.localName}
          </p>
          <p className="text-gray-600 mb-4">
            {profile.metadata?.bio || ""}
          </p>
          <div className="flex gap-4 justify-center md:justify-start">
            <span>{profile.stats?.following || 0} Following</span>
            <span>{profile.stats?.followers || 0} Followers</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const ContentSection = ({ 
  postCount, 
  onShareClick,
  onPostCountUpdate
}: { 
  postCount: number;
  onShareClick: () => void;
  onPostCountUpdate: (count: number) => void;
}) => {
  return (
    <div className="md:col-span-9 col-span-1">
      {postCount > 0 && (
        <div className="flex items-center flex-col md:flex-row gap-4">
          <button 
            className="border border-black my-1 md:my-4 px-4 py-5 text-red-400 text-xl md:text-5xl hover:bg-[#ff3131] hover:bg-opacity-10 transition-colors w-full md:w-auto"
            onClick={onShareClick}
          >
            <span className="text-red-500">SHARE SOMETHING</span>
          </button>
          <p className="text-xl md:text-3xl text-gray-700 flex-1 sm:text-center">
            <span className="text-red-500">funny</span> on Lens to{' '}
            <span className="text-red-500">feel better</span> and make others{' '}
            <span className="text-red-500">feel better</span>
          </p>
        </div>
      )}
      
      <div className="mt-3">
        <h2 className="text-xl md:text-3xl font-medium mb-2 md:mb-8">
          Your <span className="text-red-500">Funny</span> Feed:
        </h2>
        <div className="border-b border-black mb-8 md:mb-10" />
        <div className="space-y-4">
        <ProfileFeed onPostCountFetched={onPostCountUpdate} />
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const { data: session } = useSession();
  const profileSession = session as ProfileSession;
  const [postCount, setPostCount] = useState(0);
  const [postIsCreating, setPostIsCreating] = useState(false);

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-3 md:sticky md:top-8 h-fit">
            <UserInfoCard profile={profileSession?.profile} />
          </div>

          <ContentSection 
            postCount={postCount}
            onShareClick={() => setPostIsCreating(true)}
            onPostCountUpdate={setPostCount}
          />
        </div>
      </div>

      <PostModal 
        isOpen={postIsCreating}
        onClose={() => setPostIsCreating(false)}
      />
    </main>
  );
}

export default withAuth(ProfilePage);