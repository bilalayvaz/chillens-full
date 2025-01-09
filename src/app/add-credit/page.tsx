'use client'

import React from 'react';
import Navbar from '../components/Navbar';
import BuyCredits from '../components/BuyCredits';

export default function test() {
  return (
    <>
      <Navbar />
      <main className="container">
            <BuyCredits />
      </main>
    </>
  );
}
