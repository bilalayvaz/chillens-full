// hooks/useTokenApproval.ts
import { useState, useEffect } from 'react'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { type Address } from 'viem'
import { CONTRACTS } from '../config/contracts'

const erc20ABI = [
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const

const ZERO = BigInt(0)

export function useTokenApproval(tokenAddress: Address | null, amount: bigint) {
  const [isApproved, setIsApproved] = useState(false)
  const { address: userAddress } = useAccount()

  // Allowance kontrolü
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress as Address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: userAddress && tokenAddress ? [userAddress, CONTRACTS.CHILLENS_CREDITS.address] : undefined,
  })

  // Write contract için hook'lar
  const { data: hash, writeContract, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isApproveSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Allowance durumunu kontrol et
  useEffect(() => {
    if (allowance !== undefined && amount > ZERO) {
      setIsApproved(allowance >= amount)
    } else {
      setIsApproved(false)
    }
  }, [allowance, amount])

  // Critical durumlarda allowance'ı yenile
  useEffect(() => {

    /* const checkInterval = 10000 
    let timeoutId: NodeJS.Timeout */

    if (amount > ZERO) {
      // İlk kontrol
      refetchAllowance()
      // İşlem tamamlandıktan sonra bir kez daha kontrol et
      if (isApproveSuccess) {
        refetchAllowance()
      }
      // 3 saniyelik interval ile kontrol et
      /* timeoutId = setInterval(() => {
        refetchAllowance()
      }, checkInterval) */
    }
    /* return () => {
      if (timeoutId) {
        clearInterval(timeoutId)
      }
    } */
  }, [amount, refetchAllowance, isApproveSuccess])

  // Approval işlemi
  const handleApprove = async () => {
    if (!tokenAddress || !userAddress || amount <= ZERO) return

    try {
      await writeContract({
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'approve',
        args: [CONTRACTS.CHILLENS_CREDITS.address, amount]
      })
    } catch (err) {
      console.error('Approval error:', err)
      throw err
    }
  }

  return {
    isApproved,
    isApproving: isPending || isConfirming,
    handleApprove
  }
}