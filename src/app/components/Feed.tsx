import { useState, useEffect, useRef } from 'react';
import { postService } from '../services/api';
import Image from 'next/image';
import { useProfile } from '@lens-protocol/react-web';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
}

const PostCard = ({ post }: PostCardProps) => {
  const { data: profile } = useProfile({
    forHandle: post.handle 
  });

  return (
    <div className="w-full md:w-[320px] p-3 bg-white border border-gray-500 shadow-sm md:flex-none mx-0 md:mx-2 mb-4 md:mb-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
          <Image 
            src="/chillensAvatarV2.svg" 
            alt="Chillens Avatar V2"
            width={40}
            height={40}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="font-medium">{profile?.metadata?.displayName || `${post.handle.replace('lens/', '')}` || 'Anonymous'}</p>
          <p className="text-sm text-gray-600">@{post.handle.replace('lens/', '')}</p>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed">{post.content}</p>
      <div className="mt-4 text-sm text-gray-500">
        <span>{new Date(post.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
};

interface FeedProps { 
  isUpdated: boolean; 
}

export default function Feed({ isUpdated }: FeedProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State for dragging functionality
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await postService.getLatest();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isUpdated]);

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;

    const cardWidth = 320; // Desktop kart genişliği
    const scrollAmount = direction === 'left' ? -(cardWidth + 16) : (cardWidth + 16);
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current!.offsetLeft);
    setScrollLeft(containerRef.current!.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current!.offsetLeft);
    setScrollLeft(containerRef.current!.scrollLeft);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - containerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current!.scrollLeft = scrollLeft - walk;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="text-center text-gray-500">
        No posts yet. Be the first to share something funny!
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <button 
        onClick={() => scroll('left')}
        className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 shadow-lg hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600" />
      </button>

      <div
        ref={containerRef}
        className="flex flex-col md:flex-row overflow-visible md:overflow-x-hidden py-4 px-2 md:px-8 scroll-smooth"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleMouseUp}
        onTouchMove={handleTouchMove}
      >
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      <button 
        onClick={() => scroll('right')}
        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 shadow-lg hover:bg-white transition-colors"
      >
        <ChevronRight className="w-6 h-6 text-gray-600" />
      </button>
    </div>
  );
}