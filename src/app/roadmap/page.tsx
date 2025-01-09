'use client';

import React from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import '../globals.css';

export default function HomePage() {
  return (
    <>
    <Navbar />
    <main className="container">
    <div className="flex flex-col items-center border border-black mt-0 md:mt-8 m-2 md:m-0">
      <div className="w-full max-w-6xl p-8 ">
        <h1 className="text-3xl">ROADMAP</h1>
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 p-4">
            <Image src="/roadmap.png" alt="World Map" width={450} height={450} />
          </div>
          <div className="w-full md:w-1/2 p-4">
            <p className="text-2xl mb-8">Here is the real <span className="text-red-500">roadmap</span> for 2025-Q1:</p>
            <ul className="list-disc list-inside text-xl">
              <li>Lens Follow/Unfollow actions</li>
              <li>Trending users list</li>
              <li>Other Lens profile`s pages</li>
              <li>Adding Like & Comment actions</li>
              <li>Adding AI created Image to posts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </main>
    </>
  );
};
