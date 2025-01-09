// hooks/useChillensContract.ts
import { useWriteContract } from 'wagmi'
import { CONTRACTS, ChillensCreditsABI } from '../config/contracts'

export function useChillensContract() {
 const contractAddress = CONTRACTS.CHILLENS_CREDITS.address;
 const { writeContract } = useWriteContract()

 const makePayment = async (amount: bigint, paymentId: string) => {
   try {
     await writeContract({
       address: contractAddress,
       abi: ChillensCreditsABI,
       functionName: 'makePayment',
       args: [amount, paymentId]
     })
   } catch (error) {
     console.error('Contract write error:', error)
     throw error
   }
 }

 return { makePayment }
}