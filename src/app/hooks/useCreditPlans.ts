// hooks/useCreditPlans.ts
import { useEffect, useState } from 'react'
import { paymentService } from '../services/api'

interface Plan {
 tokenAmount: string
 credits: number
 price: number
}

export interface CreditPlan {
 tokenAmount: bigint
 credits: number
 price: number
}

export function useCreditPlans() {
 const [plans, setPlans] = useState<CreditPlan[]>([])
 const [isLoading, setIsLoading] = useState(true)

 useEffect(() => {
   const fetchPlans = async () => {
     try {
       const data: Plan[] = await paymentService.getPlans()
       setPlans(data.map((plan: Plan) => ({
         ...plan,
         tokenAmount: BigInt(plan.tokenAmount)
       })))
     } finally {
       setIsLoading(false)
     }
   }
   fetchPlans()
 }, [])

 return { plans, isLoading }
}