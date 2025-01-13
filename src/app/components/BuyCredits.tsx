'use client';

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession, Session, ProfileSession } from '@lens-protocol/react-web'
import { useAccount, useChainId, useWaitForTransactionReceipt, useWriteContract, useSwitchChain, useBalance, usePublicClient} from 'wagmi'
import { createPublicClient, http } from 'viem'
import { useTokenApproval } from '../hooks/useTokenApproval'
import { useCreditPlans, type CreditPlan } from '../hooks/useCreditPlans'
import { CONTRACTS, ChillensCreditsABI } from '../config/contracts'
import { paymentService } from '../services/api'
import { Loader2 } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert"
import { useRouter } from 'next/navigation'
import { useAppStore } from '../store/useAppStore'
import { withAuth } from '../components/hoc/withAuth';
import Image from 'next/image';
import { polygon } from 'wagmi/chains'
import { ethers } from 'ethers'
import { CheckCircle2, AlertCircle } from 'lucide-react'

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-[400px]">
      <Loader2 className="animate-spin" />
    </div>
  )
}

function isAuthenticatedSession(session: Session | null | undefined): session is ProfileSession {
  if (!session) return false;
  if (session.type !== 'WITH_PROFILE') return false;
  return 'profile' in session && !!session.profile?.id;
}

function BuyCredits() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<CreditPlan | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const processedTransactions = useRef(new Set<string>())
  const refreshCredits = useAppStore(state => state.refreshCredits)
  const publicClient = usePublicClient()

  const { plans, isLoading: isLoadingPlans } = useCreditPlans()
  const { data: session } = useSession()
  const { address } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const { data: hash, writeContract, isPending: isWritePending } = useWriteContract()
  const { data: receipt, isLoading: isConfirming, isSuccess: isPaymentSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const { isApproved, isApproving, handleApprove } = useTokenApproval(
    CONTRACTS.BONSAI.address,
    selectedPlan?.tokenAmount || BigInt(0)
  )

  const { data: balance } = useBalance({
    address,
    token: CONTRACTS.BONSAI.address as `0x${string}`,
  })

  const isPolygonNetwork = chainId === polygon.id

  useEffect(() => {
    if (!isPolygonNetwork && selectedPlan) {
      setSelectedPlan(null)
    }
  }, [chainId, isPolygonNetwork, selectedPlan])

  useEffect(() => {
    if (selectedPlan) {
      setError(null)
      setSuccess(null)
    }
  }, [selectedPlan])

  useEffect(() => {
    if (session !== undefined && !isAuthenticatedSession(session)) {
      router.push('/connect')
    }
  }, [session, router])

  const createPaymentId = useCallback((): `0x${string}` => {
    const timestamp = Date.now().toString();
    const randomStr = Math.random().toString(36).substring(7);
    const message = `${timestamp}-${address}-${randomStr}`;
    const bytes32 = ethers.utils.id(message);
    return bytes32 as `0x${string}`;
  }, [address]);

  const verifyPayment = useCallback(async (txHash: string) => {
    if (!selectedPlan || !isAuthenticatedSession(session)) {
      return;
    }

    if (processedTransactions.current.has(txHash)) {
      return;
    }

    try {
      // Eğer publicClient undefined ise yeni bir client oluştur
      const client = publicClient ?? createPublicClient({
        chain: polygon,
        transport: http()
      });

      // Transaction receipt'i kontrol et
      const receipt = await client.getTransactionReceipt({
        hash: txHash as `0x${string}`,
      });

      // Transaction başarısız olduysa işlemi reddet
      if (!receipt || !receipt.status) {
        setError('Transaction failed on blockchain');
        return;
      }

      processedTransactions.current.add(txHash);
      const paymentId = createPaymentId();
      
      const result = await paymentService.verifyPayment({
        paymentId,
        userAddress: session.profile.id,
        token: CONTRACTS.BONSAI.address,
        amount: selectedPlan.tokenAmount.toString(),
        txHash,
        creditAmount: selectedPlan.credits,
        price: selectedPlan.price
      });

      if (result.success) {
        await refreshCredits(session.profile.id, session.profile.handle?.fullHandle || '');

        window.dataLayer?.push({
          event: 'purchase_credits',
          category: 'monetization',
          user: session.profile.handle?.fullHandle || 'unknown_user',
          creditAmount: selectedPlan?.credits,
          price: selectedPlan?.price
        });

        setSuccess(`Successfully purchased ${selectedPlan.credits} credits!`);
        setSelectedPlan(null);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      if (error?.message !== 'Payment already processed') {
        setError('Payment verification failed: ' + (error?.message || 'Unknown error'));
      }
    }
}, [session, selectedPlan, refreshCredits, createPaymentId, publicClient]);

  useEffect(() => {
    if (receipt?.transactionHash && isPaymentSuccess && receipt.status) {
      verifyPayment(receipt.transactionHash);
    }
  }, [receipt, isPaymentSuccess, verifyPayment]);

  const handlePurchase = async () => {
    if (!selectedPlan || !address || !isAuthenticatedSession(session)) {
      setError('Please connect your wallet and select a Lens profile');
      return;
    }

    if (!isPolygonNetwork) {
      try {
        await switchChain({ chainId: polygon.id });
        return;
      } catch (error: any) {
        setError('Failed to switch network. Please switch to Polygon manually.');
        return;
      }
    }

    setError(null);
    try {
      const paymentId = createPaymentId();

      await writeContract({
        address: CONTRACTS.CHILLENS_CREDITS.address,
        abi: ChillensCreditsABI,
        functionName: 'makePayment',
        args: [selectedPlan.tokenAmount, paymentId] as [bigint, `0x${string}`]
      });
    } catch (error: any) {
      console.error('Purchase error:', error);
      setError(error instanceof Error ? error.message : 'Purchase failed');
    }
  };

  if (session === undefined) {
    return <LoadingSpinner />;
  }

  if (isLoadingPlans) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Buy Credits</h2>
      
          {error && (
      <Alert variant="destructive" className="bg-red-50 border-red-200">
        <AlertCircle className="h-4 w-4 text-red-500" />
        <AlertTitle className="text-red-800 font-medium">Error</AlertTitle>
        <AlertDescription className="text-red-700">
          {error}
        </AlertDescription>
      </Alert>
    )}

      {success && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-800 font-medium">Success</AlertTitle>
          <AlertDescription className="text-green-700">
            {success}
          </AlertDescription>
        </Alert>
      )}


      {!isPolygonNetwork ? (
        <Alert>
          <AlertTitle>Wrong Network</AlertTitle>
          <AlertDescription className="mt-2">
            <div className="flex flex-col gap-4">
              <p>You are currently on the wrong network. This transaction requires Polygon network.</p>
              <button
                onClick={() => switchChain({ chainId: polygon.id })}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors w-fit"
              >
                Switch to Polygon
              </button>
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {plans.map((plan, index) => (
              <div
                key={`${plan.credits}-${plan.price}`}
                onClick={() => !isWritePending && !isApproving && !isConfirming && setSelectedPlan(plan)}
                className={`p-4 border transition-colors ${
                  selectedPlan === plan ? 'border-red-500 bg-red-50' : 'hover:border-red-200'
                } ${
                  isWritePending || isApproving || isConfirming
                    ? 'opacity-50 cursor-not-allowed'
                    : 'cursor-pointer'
                }`}
              >
                <div className="relative">
                  <div className="text-xl font-bold mb-2 text-red-500">{plan.credits} Credits</div>
                  <div className="text-gray-600">{plan.price} BONSAI</div>
                  {index !== 0 && (
                    <Image
                      src={`/${index}.svg`}
                      alt="Icon"
                      className="absolute top-0 right-0 w-16 h-16"
                      width="63"
                      height="63"
                      style={{ right: '-38px', top: '-38px' }}
                    />
                  )}
                  <div className="text-gray-600 text-sm mt-2">Network: POLYGON</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={async () => {
              try {
                if (isApproved) {
                  await handlePurchase();
                } else {
                  await handleApprove();
                }
              } catch (error) {
                console.error('Button click error:', error);
              }
            }}
            disabled={
              !selectedPlan || 
              isWritePending || 
              isApproving || 
              isConfirming || 
              !balance || 
              balance.value < (selectedPlan?.tokenAmount || BigInt(0))
            }
            className="w-full bg-red-500 text-white py-3 rounded-lg disabled:bg-gray-300 
                     hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            {(isWritePending || isApproving || isConfirming) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isConfirming 
              ? 'Confirming Transaction...'
              : isWritePending 
              ? 'Processing...' 
              : isApproving
              ? 'Approving BONSAI...'
              : !balance || (selectedPlan && balance.value < selectedPlan.tokenAmount)
              ? `Insufficient BONSAI Balance`
              : !isApproved && selectedPlan
              ? 'Approve BONSAI'
              : selectedPlan 
                ? `Buy ${selectedPlan.credits} Credits` 
                : 'Select a Plan'
            }
          </button>
        </>
      )}
    </div>
  )
}

export default withAuth(BuyCredits);