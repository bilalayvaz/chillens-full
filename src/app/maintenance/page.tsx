'use client';

import Image from 'next/image';
import chillensAvatar from '../../../public/chillensAvatar.svg'

export default function MaintenancePage() {
 return (
   <main className="container min-h-screen flex flex-col items-center justify-center relative">
     <div className="flex flex-col md:flex-row items-center gap-2 md:gap-12 p-24 border border-black m-2 md:m-0 mt-0 md:mt-4">
       <div className="w-70 h-70 relative">
         <Image  
           src={chillensAvatar}
           alt="Chillens Avatar"
           width={275}
           height={275}
           priority
           unoptimized
           className="w-70 h-70"
         />
       </div>

       <div className="flex-1 text-center text-[#545454]">
         <h2 className="text-7xl md:text-8xl mb-6 flex items-center gap-3 justify-center mt-6">
           JUST FOR 
           <span className="text-[#ff3131] transform -rotate-12 inline-block">FUN</span>
         </h2>
         
         {/* Maintenance Modal */}
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-black p-8 bg-white z-50">
           <h1 className="text-3xl font-bold mb-4">WEBSITE IS UNDER MAINTAINING!</h1>
           <p className="text-2xl mb-3">
             SORRY FOR MISSING <span className="text-[#ff3131]">FUNNIEST</span> <br />
             CONTENTS IN UNIVERSE.
           </p>
           <p className="text-2xl">
             CHECK OUT LATER!
           </p>
         </div>

         <p className="text-2xl mb-4 text-[#545454]">
           DID YOU SHARE SOMETHING <span className="text-[#ff3131]">FUNNY</span> TODAY ON LENS?
         </p>
       </div>
     </div>
   </main>
 );
}