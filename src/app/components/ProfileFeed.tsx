import { useState, useEffect, useCallback } from 'react';
import { useSession, ProfileSession } from '@lens-protocol/react-web';
import Image from 'next/image';
import { postService } from '../services/api';
import { withAuth } from './hoc/withAuth';
import { PostModal } from './PostModal';

interface Post {
  _id: string;
  content: string;
  ipfsUri: string;
  lensProfileId: string;
  handle: string;
  createdAt: string;
  status: 'posted' | 'failed';
}

interface PostCardProps {
  post: Post;
  displayName: string | null | undefined;
  handle: string | null | undefined;
}

function PostCard({ post, displayName, handle }: PostCardProps) {
  return (
    <div className="w-full p-4 bg-white border border-gray-500">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-gray-200">
          <Image 
            src="/chillensAvatar.svg" 
            alt="Chillens Avatar"
            width={32}
            height={32}
          />
        </div>
        <div>
          <p className="font-medium text-sm">{displayName || 'Anonymous'}</p>
          <p className="text-xs text-gray-600">@{handle?.replace('lens/', '')}</p>
        </div>
      </div>
      <p className="text-sm text-gray-700">{post.content}</p>
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        <span>{new Date(post.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
}

function NoPostsMessage({ onShareClick }: { onShareClick: () => void }) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-xl md:text-4xl text-gray-700 max-w-3xl text-center">
        Oh nooo... There is nothing funny. Looks like you didn&apos;t share something <span className="text-red-500">FUNNY</span> yet.
      </p>
      <p className="text-lg md:text-3xl text-gray-700 mt-4 md:mt-10">
        <span className="text-red-500">Click</span> this button now to
      </p>

      <button 
        className="border border-black mt-4 p-6 mb-4 text-red-400 text-3xl md:text-6xl leading-tight hover:bg-[#ff3131] hover:bg-opacity-10 transition-colors"
        onClick={onShareClick}
      >
        <span className="text-red-500 block text-3xl md:text-5xl">SHARE SOMETHING</span>
      </button>

      <p className="text-lg md:text-3xl text-gray-700">
        <span className="text-red-500">funny</span> on Lens to <span className="text-red-500">feel better</span> and
      </p>
      <p className="text-lg md:text-3xl text-gray-700">
        make others <span className="text-red-500">feel better</span>
      </p>
    </div>
  );
}

function ProfileFeed({ onPostCountFetched }: { onPostCountFetched: (count: number) => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const profileSession = session as ProfileSession;
  const [postIsCreating, setPostIsCreating] = useState(false);

  const fetchPosts = useCallback(async () => {
    if (!profileSession?.profile?.id) return;

    try {
      setLoading(true);
      const data = await postService.getByProfile(profileSession.profile.id);
      setPosts(data);
      onPostCountFetched(data.length);
    } catch (error) {
      console.error('Error fetching profile posts:', error);
    } finally {
      setLoading(false);
    }
  }, [profileSession?.profile?.id, onPostCountFetched]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleShareClick = () => {
      setPostIsCreating(true);
  };

  const handleModalClose = () => {
    setPostIsCreating(false);
    fetchPosts();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {posts.length === 0 ? (
        <NoPostsMessage onShareClick={handleShareClick} />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard 
              key={post._id} 
              post={post}
              displayName={profileSession.profile?.metadata?.displayName}
              handle={profileSession.profile?.handle?.fullHandle}
            />
          ))}
        </div>
      )}

      <PostModal 
        isOpen={postIsCreating}
        onClose={handleModalClose}
      />
    </>
  );
}

export default withAuth(ProfileFeed);