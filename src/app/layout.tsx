import type { Metadata } from 'next';
import './globals.css';
import { headers } from 'next/headers';
import ContextProvider from '@/context';
import { Architects_Daughter } from 'next/font/google';
import Script from 'next/script';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

const architectsDaughter = Architects_Daughter({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Chillens',
  description: 'Just For Fun'
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  if (!GTM_ID) {
    console.warn('GTM ID is not defined');
  }

  const headersObj = await headers();
  const cookies = headersObj.get('cookie');

  return (
    <html lang="en">
      <head>
        {GTM_ID && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `}
          </Script>
        )}
      </head>
      <body className={architectsDaughter.className}>
        {GTM_ID && (
          <noscript>
            <iframe 
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0" 
              width="0" 
              style={{display: 'none', visibility: 'hidden'}}
            />
          </noscript>
        )}
        <ContextProvider cookies={cookies}>
          {children}
        </ContextProvider>     
      </body>
    </html>
  );
}