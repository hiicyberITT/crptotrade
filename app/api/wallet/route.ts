import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getWalletBalance, createTransaction, getTransactionHistory, generateWallet } from '@/lib/blockchain'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'balance') {
      if (!user.walletAddress) {
        return NextResponse.json({ error: 'No wallet address' }, { status: 400 })
      }
      
      const balance = await getWalletBalance(user.walletAddress)
      return NextResponse.json({ balance })
    }

    if (action === 'history') {
      if (!user.walletAddress) {
        return NextResponse.json({ error: 'No wallet address' }, { status: 400 })
      }
      
      const transactions = await getTransactionHistory(user.walletAddress)
      return NextResponse.json({ transactions })
    }

    if (action === 'generate') {
      const wallet = generateWallet()
      return NextResponse.json({ wallet })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Wallet API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { to, amount, privateKey } = await request.json()

    if (!user.walletAddress || !to || !amount || !privateKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const transaction = await createTransaction(user.walletAddress, to, amount, privateKey)
    
    return NextResponse.json({ transaction })
  } catch (error) {
    console.error('Transaction error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 })
  }
}
