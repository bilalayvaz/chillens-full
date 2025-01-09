'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import ConnectButton from '../components/ConnectButton';
import '../globals.css';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="container">
        <div className="px-4 py-8 border border-black mt-0 md:mt-8 m-2 md:m-0">
          <div className="flex flex-col md:flex-row justify-center items-center gap-0 md:gap-8">
          <div className="mx-4 mt-4 mb-8">
              <Image 
                src="/chillensAvatar.svg" 
                alt="Chillens Avatar"
                width={300}
                height={300}
                priority
                className="w-40 h-40 md:w-80 md:h-80"
              />
            </div>
            <div className="text-center mx-4 my-0 md:my-24">
              <ConnectButton />
              <div className="text-2xl mt-4">to be able to post <br/>something <span className="text-red-500">funny</span> on Lens.</div>
            </div>
            <div className="mx-4 mt-4 mb-8">
            <Image 
              src="/chillensAvatar.svg" 
              alt="Chillens Avatar"
              width={300}
              height={300}
              priority
              className="w-40 h-40 md:w-80 md:h-80"
            />
          </div>
          </div>
        </div>
      </main>
    </>
  );
}
