import { Address } from 'viem'

export const CONTRACTS = {
  CHILLENS: {
    address: '0x60dF43dcE4224d1E1e1371437Ef8fD0Ad1c55C96' as Address, 
    chainId: 137
  },
  BONSAI: {
    address: '0x3d2bd0e15829aa5c362a4144fdf4a1112fa29b5c' as Address,
    chainId: 137
  }
} as const

export const ChillensABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_bonsaiToken",
        type: "address"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    inputs: [],
    name: "Blacklisted",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "currentPrice",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "maxPrice",
        type: "uint256"
      }
    ],
    name: "GasPriceTooHigh",
    type: "error"
  },
  {
    inputs: [],
    name: "InsufficientBalance",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidAddress",
    type: "error"
  },
  {
    inputs: [],
    name: "InvalidAmount",
    type: "error"
  },
  {
    inputs: [],
    name: "PaymentIDUsed",
    type: "error"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "payment",
        type: "string"
      }
    ],
    name: "createPaymentId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "getContractBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getCurrentMaxGasPrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "paymentId",
        type: "bytes32"
      }
    ],
    name: "isPaymentIdUsed",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        internalType: "bytes32",
        name: "paymentId",
        type: "bytes32"
      }
    ],
    name: "makePayment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "pauseContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        internalType: "bool",
        name: "status",
        type: "bool"
      }
    ],
    name: "setBlacklist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "unpauseContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxWithdrawAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_maxPaymentAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "_minPaymentAmount",
        type: "uint256"
      }
    ],
    name: "updateLimits",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newMultiplier",
        type: "uint256"
      }
    ],
    name: "updateMaxGasPriceMultiplier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "withdrawTokens",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;