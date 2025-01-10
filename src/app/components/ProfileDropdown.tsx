import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogout, ProfileSession } from '@lens-protocol/react-web';
import { useDisconnect } from 'wagmi';
import Image from 'next/image';
import { authService } from '../services/authService';
import { useAppStore } from '../store/useAppStore';

interface ProfileDropdownProps {
  session: ProfileSession;
}

const ProfileDropdown = ({ session }: ProfileDropdownProps) => {
  const router = useRouter();
  const { execute: lensLogout } = useLogout();
  const { disconnect } = useDisconnect();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { reset } = useAppStore();

  const handleProfileClick = () => {
    setDropdownOpen(false);
    router.push('/profile');
  };

  const handleAddCreditClick = () => {
    setDropdownOpen(false);
    router.push('/add-credit');
  };

  const handleSettingsClick = () => {
    setDropdownOpen(false);
    router.push('/profile/settings');
  };

  const handleLogoutClick = async () => {
    try {
      setIsLoggingOut(true);
      setDropdownOpen(false);
      
      // Önce Lens logout
      if (session) {
        await lensLogout();
      }
  
      // Sonra wallet disconnect
      disconnect();
  
      // En son bizim auth sisteminden çık
      await authService.logout();
      reset();
      
  
      // Ana sayfaya yönlendir
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setDropdownOpen(!dropdownOpen)} 
        className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-300 focus:outline-none mt-1"
        disabled={isLoggingOut}
      >
        <Image 
          src="/chillensAvatar.svg" 
          alt="Profile Image"
          layout="fill"
          objectFit="cover"
        />
      </button>
      {dropdownOpen && !isLoggingOut && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button 
            onClick={handleProfileClick} 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Profile
          </button>
          <button 
            onClick={handleAddCreditClick} 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Add Credit
          </button>
          <button 
            onClick={handleSettingsClick} 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
          >
            Settings
          </button>
          <button 
            onClick={handleLogoutClick} 
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;