'use client'

import React from 'react';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function FAQPage() {
  const router = useRouter();

  const handleShareNowClick = () => {
    router.push('/connect');
  };

  return (
    <>
      <Navbar />
      <main className="container">
        <div className="p-6 border border-black flex flex-col md:flex-row mt-0 md:mt-8 m-2 md:m-0">
          <div className="order-2 md:order-1 flex-1 mb-4 md:mb-0">
            <h2 className="text-3xl mb-6">FAQ</h2>
            <p className="text-md mb-4">
              <strong>1. Who we are?</strong><br />
              We are <span className="text-[#ff3131]">degens</span> who realized that many contents on Lens are boring and want to fix it. Here our Lens handles: <a href="https://hey.xyz/u/dollowen" target="_blank" rel="noopener noreferrer"><span className="text-[#ff3131]">dollowen</span></a> | <a href="https://hey.xyz/u/mcelil" target="_blank" rel="noopener noreferrer"><span className="text-[#ff3131]">mcelil</span></a> | <a href="https://hey.xyz/u/bilalayvazoglu" target="_blank" rel="noopener noreferrer"><span className="text-[#ff3131]">bilalayvazoglu</span></a> | <a href="https://hey.xyz/u/oflu61" target="_blank" rel="noopener noreferrer"><span className="text-[#ff3131]">oflu61</span></a>
            </p>
            <p className="text-md mb-4">
              <strong>2. What’s CHILLENS?</strong><br />
              <span className="text-[#ff3131]">CHILLENS</span> is a <span className="text-[#ff3131]">FUN</span> tool on Lens Protocol. You can share funny posts with just one simple click.
            </p>
            <p className="text-md mb-4">
              <strong>3. What’s our vision?</strong><br />
              Vision is simple, share something <span className="text-[#ff3131]">funny</span> on-chain.
            </p>
            <p className="text-md mb-4">
              <strong>4. What’s roadmap?</strong><br />
              Click <a href="/roadmap"> <span className="text-[#ff3131]">here</span></a> to check <a href="/roadmap"> <span className="text-[#ff3131]">roadmap!</span></a>
            </p>
            <p className="text-md mb-4">
              <strong>5. How it works?</strong><br />
              Every user has <span className="text-[#ff3131]">7 free Credits</span> when they login with Lens. Users can click <span className="text-[#ff3131]">SHARE NOW</span> button to share something funny. When you shared something it will cost <span className="text-[#ff3131]">1 Credit</span>. If your credits are done, you can refill with only <span className="text-[#ff3131]">$BONSAI</span> by clicking <span className="text-[#ff3131]">+</span> button.
            </p>
            <p className="text-md mb-4">
              <strong>6. What’s our official social media channels?</strong><br />
              NO TELEGRAM & NO DISCORD (Be aware of scam links)<br />
              <a href="https://hey.xyz/u/chillens" target="_blank" rel="noopener noreferrer"><span className="text-[#ff3131]">LENS</span></a> | <a href="https://x.com/chillens_xyz" target="_blank" rel="noopener noreferrer" ><span className="text-[#ff3131]">X (Twitter)</span></a> | chillens.lens@gmail.com
            </p>
          </div>
          <div className="order-1 md:order-2 flex flex-col items-center justify-center mb-4 md:mb-0 md:ml-8 mt-0">
            <Image 
              src="/chillensAvatar.svg" 
              alt="Chillens Avatar"
              width={350}
              height={350}
            />
            <button 
              className="mt-3 border-2 border-black font-bold text-[#ff3131] px-8 py-3 text-xl hover:bg-[#ff3131] hover:bg-opacity-10 transition-colors"
              onClick={handleShareNowClick}
            >
              SHARE NOW
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
