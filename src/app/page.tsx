'use client';

import Image from 'next/image';
import Navbar from './components/Navbar';
import { useSession } from '@lens-protocol/react-web';
import { useRouter } from 'next/navigation';
import Footer from './components/Footer';

export default function LandingPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleButtonClick = () => {
    if (session?.type === 'WITH_PROFILE') {
      router.push('/feed');
    } else {
      router.push('/connect');
    }
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-12 p-24 border border-black m-2 md:m-0 mt-0 md:mt-8">
          <div className="w-70 h-70">
            <Image  
              src="/chillensAvatar.svg" 
              alt="Chillens Avatar"
              width={275}
              height={275}
              priority
              className="w-70 h-70"
            />
          </div>

          <div className="flex-1 text-center text-[#545454]" style={{ transform: 'scaleY(1)' }}>
            <h2 className="text-7xl md:text-8xl mb-6 flex items-center gap-3 justify-center mt-6">
              JUST FOR 
              <span className="text-[#ff3131] transform -rotate-12 inline-block">FUN</span>
            </h2>
            <p className="text-2xl mb-4 text-[#545454]">
              DID YOU SHARE SOMETHING <span className="text-[#ff3131]">FUNNY</span> TODAY ON LENS?
            </p>
            <div className="flex justify-center">
              <button 
                onClick={handleButtonClick}
                className="border border-black font-bold text-[#ff3131] px-8 py-3 text-xl hover:bg-[#ff3131] hover:bg-opacity-10 transition-colors">
                SHARE NOW
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}