'use server'

import crypto from 'crypto'

export interface Wallet {
  address: string
  privateKey: string
  publicKey: string
  balance: number
}

export interface Transaction {
  id: string
  from: string
  to: string
  amount: number
  fee: number
  status: 'pending' | 'confirmed' | 'failed'
  blockHash?: string
  timestamp: Date
  confirmations: number
}

// Mock blockchain data
const wallets = new Map<string, Wallet>()
const transactions = new Map<string, Transaction>()

export function generateWallet(): Wallet {
  const privateKey = crypto.randomBytes(32).toString('hex')
  const publicKey = crypto.randomBytes(33).toString('hex')
  const address = generateAddress(publicKey)
  
  const wallet: Wallet = {
    address,
    privateKey,
    publicKey,
    balance: 0
  }
  
  wallets.set(address, wallet)
  return wallet
}

function generateAddress(publicKey: string): string {
  // Simplified Bitcoin address generation
  const hash = crypto.createHash('sha256').update(publicKey).digest()
  const ripemd = crypto.createHash('ripemd160').update(hash).digest()
  return '1' + ripemd.toString('hex').substring(0, 25)
}

export async function getWalletBalance(address: string): Promise<number> {
  const wallet = wallets.get(address)
  return wallet?.balance || 0
}

export async function createTransaction(
  from: string,
  to: string,
  amount: number,
  privateKey: string
): Promise<Transaction> {
  const fromWallet = wallets.get(from)
  if (!fromWallet) {
    throw new Error('Wallet not found')
  }

  if (fromWallet.balance < amount) {
    throw new Error('Insufficient balance')
  }

  const fee = amount * 0.001 // 0.1% fee
  const transaction: Transaction = {
    id: crypto.randomUUID(),
    from,
    to,
    amount,
    fee,
    status: 'pending',
    timestamp: new Date(),
    confirmations: 0
  }

  // Simulate transaction processing
  setTimeout(() => {
    transaction.status = 'confirmed'
    transaction.confirmations = 6
    transaction.blockHash = crypto.randomBytes(32).toString('hex')
    
    // Update balances
    fromWallet.balance -= (amount + fee)
    const toWallet = wallets.get(to)
    if (toWallet) {
      toWallet.balance += amount
    }
  }, 5000)

  transactions.set(transaction.id, transaction)
  return transaction
}

export async function getTransactionHistory(address: string): Promise<Transaction[]> {
  return Array.from(transactions.values())
    .filter(tx => tx.from === address || tx.to === address)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export async function validateAddress(address: string): Promise<boolean> {
  // Basic Bitcoin address validation
  return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address)
}
