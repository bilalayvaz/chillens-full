// hooks/useChillensContract.ts
import { useWriteContract } from 'wagmi'
import { CONTRACTS, ChillensCreditsABI } from '../config/contracts'

export function useChillensContract() {
  const contractAddress = CONTRACTS.CHILLENS_CREDITS.address;
  const { writeContract } = useWriteContract()

  const createPaymentId = (input: string): `0x${string}` => {
    return `0x${Buffer.from(input).toString('hex')}` as `0x${string}`;
  }

  const makePayment = async (amount: bigint, paymentId: string) => {
    try {
      const hexPaymentId = createPaymentId(paymentId);
      
      await writeContract({
        address: contractAddress,
        abi: ChillensCreditsABI,
        functionName: 'makePayment',
        args: [amount, hexPaymentId]
      })
    } catch (error) {
      console.error('Contract write error:', error)
      throw error
    }
  }

  return { makePayment }
}