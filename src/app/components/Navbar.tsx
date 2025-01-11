import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, ProfileSession } from '@lens-protocol/react-web';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../store/useAppStore';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar() {
  const currentPath = usePathname();
  const { data: session } = useSession();
  const { isAuthenticated } = useAuth();
  const credits = useAppStore(state => state.credits);
  const router = useRouter();

  const handleButtonClick = () => {
    if (session?.type === 'WITH_PROFILE') {
      router.push('/profile');
    } else {
      router.push('/connect');
    }
  };

  const handleAddCreditClick = () => {
    if (session?.type === 'WITH_PROFILE') {
      router.push('/add-credit');
    } else {
      router.push('/connect');
    }
  };

  const showCredits = isAuthenticated && credits !== null;

  return (
    <nav className="bg-white m-2 md:m-0">
      <div className="container flex justify-between items-center py-2">
        <div className="flex flex-col items-left">
          <Link 
            href="/feed" 
            className={`font-bold text-red-500 ${showCredits ? 'text-2xl' : 'text-3xl'} mb-1`}
          >
            CHILLENS
          </Link>
          
          {showCredits && (
            <div className="flex items-center justify-center w-full">
              <div className="text-2xl text-center">
                Credit: {credits}
              </div>
              <button 
                className="text-red-500 text-3xl ml-1 border border-2 border-red-500 rounded-full w-7 h-7 flex items-center justify-center font-bold hover:bg-red-50 transition-colors"
                onClick={handleAddCreditClick}
                aria-label="Add credits"
              >
                +
              </button>
            </div>
          )}
        </div>

        <div className="flex gap-4 md:gap-8 items-center">
          <Link 
            href="/faq" 
            className="border border-white text-gray-700 hover:bg-gray-100 px-6 py-3 text-xl text-[#545454]"
          >
            FAQ
          </Link>

          {session?.type === 'WITH_PROFILE' ? (
            <ProfileDropdown session={session as ProfileSession} />
          ) : (
            currentPath !== '/connect' && (
              <button 
                onClick={handleButtonClick}
                className="border border-black font-bold text-red-500 px-6 py-3 text-xl hover:bg-red-50 transition-colors"
              >
                LOGIN
              </button>
            )
          )}
        </div>
      </div>
      
      <div className="container border-b border-black" />
    </nav>
  );
}