'use client'

import { useProfiles, useLogin } from '@lens-protocol/react-web'
import { useAccount, useDisconnect } from 'wagmi'
import { authService } from '../services/authService';
import { useAppStore } from '../store/useAppStore';

interface Props {
  onProfileSelect: (profileId: string) => void;
  onClose: () => void;
}

const LensProfiles: React.FC<Props> = ({ onProfileSelect, onClose }) => {
  const { address } = useAccount();
  const { execute: login } = useLogin();
  const { disconnect } = useDisconnect();
  const { data: profiles, loading } = useProfiles({
    where: {
      ownedBy: [address as string]
    }
  });

  const handleProfileSelect = async (profile: any) => {
    if (!address || !profile?.id) return;
    
    try {
      // Önce Lens login
      const loginResult = await login({ 
        address: address as string,
        profileId: profile.id,
      });
  
      if (loginResult.isFailure()) {
        throw new Error('Lens login failed');
      }
  
      // Lens login başarılı olduktan sonra kendi auth sistemimizle login ol
      await authService.signin(
        profile.id,
        profile.handle?.fullHandle || ''
      );
  
      // Auth başarılı olduktan sonra kredileri yükle
      const refreshCredits = useAppStore.getState().refreshCredits;
      await refreshCredits(
        profile.id,
        profile.handle?.fullHandle || ''
      );
      
      //analytics
      window.dataLayer?.push({
        event: 'user_login',
        category: 'authentication',
        user: profile.handle?.fullHandle || 'unknown_user'
      });
  
      onProfileSelect(profile.id);
      onClose();
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  };

  const handleButtonClick = () => {
    disconnect();
    onClose();
  };

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 w-72 md:w-96">
      <h2 className="text-lg font-semibold">Lens Profiles</h2>
      {loading && <div>Loading...</div>}
      {!loading && profiles?.length === 0 && (
        <div>There is no Lens profile in this wallet. Please choose another wallet or mint a new one at <a href="https://x.com/chillens_xyz"><span className="text-[#ff3131]">https://onboarding.lens.xyz/mint</span></a></div>
      )}
      {profiles?.map((profile) => (
        <div 
          key={profile.id}
          className="p-4 border rounded mt-2 cursor-pointer hover:bg-blue-50"
          onClick={() => handleProfileSelect(profile)}
        >
          {`@${profile.handle?.fullHandle.replace('lens/', '')}`}
        </div>
      ))}
      <button 
        onClick={handleButtonClick}
        className="border border-black px-6 py-3 mt-3 text-md text-gray-700 hover:bg-gray-100 w-full"
      >
        Disconnect
      </button>
    </div>
  );
};

export default LensProfiles;