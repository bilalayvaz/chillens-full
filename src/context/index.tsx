'use client'

import { wagmiAdapter, projectId } from '@/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import { polygon } from '@reown/appkit/networks'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'
import { LensProvider, production } from "@lens-protocol/react-web"
import { bindings as wagmiBindings } from "@lens-protocol/wagmi"


// Set up queryClient
const queryClient = new QueryClient()

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Set up metadata
const metadata = {
  name: 'chillens',
  description: 'A Fun Lens Tool',
  url: 'https://www.chillens.xyz/', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// Create the modal
const modal = createAppKit({  
  adapters: [wagmiAdapter],
  projectId,
  networks: [polygon],
  defaultNetwork: polygon,
  metadata: metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    socials: false,
    email: false
  },
  themeMode:'light',
})
console.debug('Modal state:', modal);

const lensConfig = {
  environment: production,
  bindings: wagmiBindings(wagmiAdapter.wagmiConfig),
}

function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <LensProvider config={lensConfig}>
              {children}
        </LensProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider