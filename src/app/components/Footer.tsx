'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
    return(
        <div className='container'>
        <div className="flex justify-between py-5 m-2 md:m-0">
          <div className='flex gap-5'>
            <a href="https://x.com/chillens_xyz" target="_blank" rel="noopener noreferrer">
            <Image  
              src="/twitter.png" 
              alt="twitter icon"
              width={64}
              height={48}
              style={{ width: '16px', height: '16px' }}
              /></a>
          <a href="https://hey.xyz/u/chillens" target="_blank" rel="noopener noreferrer">
          <Image  
              src="/hey.png" 
              alt="hey icon"
              width={64}
              height={64}
              style={{ width: '16px', height: '16px' }}
              /></a>  
          </div>
          <div className='flex gap-5'>
          <Link href="/privacy-policy" passHref>
           Privacy Policy
          </Link>
          <Link href="/terms-of-use" passHref>
          Terms of Use
          </Link>
            </div>
        </div>
        </div>
    )
}