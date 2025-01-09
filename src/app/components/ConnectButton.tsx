'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import LensProfiles from '../components/LensProfiles';
import { useAppKit } from '@reown/appkit/react';
import '@reown/appkit-wallet-button/react';
import '../globals.css';

export default function ConnectButton() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const { open } = useAppKit(); 
  const openModal = () => { open(); };

  useEffect(() => {
    if (isConnected) {
      setShowToast(true); 
    } else {
      setShowToast(false); 
    }
  }, [isConnected]);

  const handleProfileSelect = (profileId: string) => {
    if (profileId) {
      setShowToast(false); 
      router.push('/feed');
    }
  };

  return (
    <div>
      {isConnected ? (
        <button 
          onClick={() => setShowToast(false)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </button>
      ) : (
        <div> 
          <button className="border border-black p-4 px-4 md:px-16 mb-4 text-red-500 text-6xl leading-tight hover:bg-[#ff3131] hover:bg-opacity-10 transition-colors" onClick={openModal} >
             Connect <br/>Lens 
           </button>
        </div>
      )}
      
      {/* LensProfiles bileşenini sadece showToast true olduğunda render et */}
      {showToast && (
        <div>
          <LensProfiles 
            onProfileSelect={handleProfileSelect} 
            onClose={() => setShowToast(false)} 
          />
        </div>
      )}
    </div>
  );
}
