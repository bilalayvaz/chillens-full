import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { postService } from '../services/api';
import Image from 'next/image';
import { useProfile } from '@lens-protocol/react-web';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Types
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

interface FeedProps {
  isUpdated: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { data: profile } = useProfile({
    forHandle: post.handle
  });

  const memoizedAvatar = useMemo(() => (
    <Image 
      src="/chillensAvatar.svg"
      alt="Chillens Avatar"
      width={40}
      height={40}
      className="w-full h-full object-cover"
      priority
    />
  ), []);

  // PostCard bileşeninde
return (
  <div className="w-full md:w-[320px] h-[300px] p-3 bg-white border border-gray-500 shadow-sm md:flex-none mx-0 md:mx-2 mb-4 md:mb-0 flex flex-col">
    <div className="flex items-center gap-3 mb-4 flex-shrink-0"> {/* Header kısmı sabit kalacak */}
      <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
        {memoizedAvatar}
      </div>
      <div>
        <p className="font-medium">
          {profile?.metadata?.displayName || post.handle.replace('lens/', '') || 'Anonymous'}
        </p>
        <p className="text-sm text-gray-600">@{post.handle.replace('lens/', '')}</p>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto"> {/* İçerik kısmı scroll olabilir */}
      <p className="text-gray-700 leading-relaxed">{post.content}</p>
    </div>
    <div className="mt-4 text-sm text-gray-500 flex-shrink-0"> {/* Footer kısmı sabit kalacak */}
      <span>{new Date(post.createdAt).toLocaleString()}</span>
    </div>
  </div>
);
};

const Feed: React.FC<FeedProps> = ({ isUpdated }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const loadMorePosts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const data = await postService.getLatest(nextPage);
      if (data.posts?.length) {
        setPosts(prevPosts => [...prevPosts, ...data.posts]);
        setPage(nextPage);
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, page]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await postService.getLatest(1);
        setPosts(data.posts || []);
        setHasMore(data.hasMore || false);
        setPage(1);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Failed to load posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [isUpdated]);

  const scroll = useCallback(async (direction: 'left' | 'right') => {
    const container = containerRef.current;
    if (!container) return;
    
    const cardWidth = 320;
    const gap = 16;
    const scrollAmount = direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap);
    
    // Smooth scroll ile pozisyon değiştirme
    container.scrollTo({
      left: container.scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  
    if (direction === 'right') {
      const maxScroll = container.scrollWidth - container.clientWidth;
      const isNearEnd = container.scrollLeft + container.clientWidth >= maxScroll - (cardWidth + gap);
      
      if (isNearEnd && !isLoadingMore && hasMore) {
        await loadMorePosts();
      }
    }
  }, [hasMore, isLoadingMore, loadMorePosts]);

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth >= 768) return; // Only for mobile

      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500;

      if (scrolledToBottom && !isLoadingMore && hasMore) {
        loadMorePosts();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMore, loadMorePosts]);

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
    <div className="relative w-full md:max-w-[100vw]">  {/* Parent'tan overflow-hidden'ı kaldırdık */}
      <button 
        onClick={() => scroll('left')}
        className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 shadow-lg hover:bg-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6 text-gray-600" />
      </button>
  
      <div
          ref={containerRef}
          className="flex flex-col md:flex-row py-4 px-2 md:px-8 overflow-hidden scroll-smooth"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleMouseUp}
          onTouchMove={handleTouchMove}
>
        {posts.map((post, index) => (
          <PostCard 
            key={`${post._id}-${index}`}
            post={post} 
          />
        ))}
        
        {isLoadingMore && (
          <div className="w-full md:w-[320px] p-3 bg-white border border-gray-500 shadow-sm md:flex-none mx-0 md:mx-2 mb-4 md:mb-0">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-red-500" />
            </div>
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div className="w-full md:w-[320px] p-3 bg-white border border-gray-500 shadow-sm md:flex-none mx-0 md:mx-2 mb-4 md:mb-0">
            <div className="flex justify-center">
              <div className="text-gray-500 text-sm">
                You've seen all posts! 🎉
              </div>
            </div>
          </div>
        )}
      </div>

      <button 
      onClick={() => scroll('right')}
      className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 shadow-lg hover:bg-white transition-colors"
    >
      <ChevronRight className="w-6 h-6 text-gray-600" />
    </button>
  </div>
  );
};

export default Feed;