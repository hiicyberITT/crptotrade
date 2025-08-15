import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    // Generate random demo account data
    const userId = crypto.randomUUID()
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const email = `demo${randomNum}@btcexchange.com`
    const password = `demo${randomNum}`
    const walletAddress = '1' + crypto.randomBytes(16).toString('hex').substring(0, 33)

    // Create demo account with rich data
    const demoAccount = {
      id: userId,
      email,
      password, // Plain text for demo purposes
      firstName: 'Demo',
      lastName: `User${randomNum}`,
      phone: `+84${Math.floor(100000000 + Math.random() * 900000000)}`,
      role: 'user',
      isVerified: true,
      twoFactorEnabled: false,
      walletAddress,
      createdAt: new Date().toISOString(),
      
      // Rich demo balance
      balance: {
        BTC: 0.05,
        ETH: 1.5,
        USD: 1000,
        USDT: 500
      },

      // Demo statistics
      stats: {
        totalTrades: 47,
        winRate: 68.5,
        totalProfit: 2450,
        totalVolume: 125000,
        activeDays: 23
      }
    }

    // Generate demo trading history
    const demoTrades = generateDemoTrades(userId, 47)
    
    // Generate demo transactions
    const demoTransactions = generateDemoTransactions(userId)

    // Generate pending orders
    const pendingOrders = [
      {
        id: crypto.randomUUID(),
        userId,
        symbol: 'BTCUSDT',
        side: 'buy',
        type: 'limit',
        amount: 0.001,
        price: 42000,
        status: 'pending',
        timestamp: new Date().toISOString()
      },
      {
        id: crypto.randomUUID(),
        userId,
        symbol: 'ETHUSDT',
        side: 'sell',
        type: 'limit',
        amount: 0.5,
        price: 2800,
        status: 'pending',
        timestamp: new Date().toISOString()
      }
    ]

    console.log('Demo account created:', {
      userId,
      email,
      password,
      balance: demoAccount.balance,
      stats: demoAccount.stats,
      trades: demoTrades.length,
      transactions: demoTransactions.length,
      pendingOrders: pendingOrders.length
    })

    return NextResponse.json({
      success: true,
      message: 'Tài khoản demo đã được tạo thành công!',
      account: {
        email,
        password,
        balance: demoAccount.balance,
        stats: demoAccount.stats,
        walletAddress,
        trades: demoTrades.length,
        transactions: demoTransactions.length,
        pendingOrders: pendingOrders.length
      }
    })

  } catch (error) {
    console.error('Demo account creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Không thể tạo tài khoản demo' },
      { status: 500 }
    )
  }
}

function generateDemoTrades(userId: string, count: number) {
  const trades = []
  const symbols = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOTUSDT']
  const sides = ['buy', 'sell']
  
  for (let i = 0; i < count; i++) {
    const symbol = symbols[Math.floor(Math.random() * symbols.length)]
    const side = sides[Math.floor(Math.random() * sides.length)]
    const amount = parseFloat((Math.random() * 0.1).toFixed(6))
    const price = Math.floor(30000 + Math.random() * 20000)
    const total = amount * price
    
    trades.push({
      id: crypto.randomUUID(),
      userId,
      symbol,
      side,
      amount,
      price,
      total: parseFloat(total.toFixed(2)),
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      fee: parseFloat((total * 0.001).toFixed(2))
    })
  }
  
  return trades.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

function generateDemoTransactions(userId: string) {
  const transactions = [
    {
      id: crypto.randomUUID(),
      userId,
      type: 'deposit',
      currency: 'USD',
      amount: 1000,
      status: 'completed',
      timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Initial deposit via bank transfer',
      txHash: '0x' + crypto.randomBytes(32).toString('hex')
    },
    {
      id: crypto.randomUUID(),
      userId,
      type: 'deposit',
      currency: 'BTC',
      amount: 0.05,
      status: 'completed',
      timestamp: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Bitcoin deposit',
      txHash: crypto.randomBytes(32).toString('hex')
    },
    {
      id: crypto.randomUUID(),
      userId,
      type: 'deposit',
      currency: 'ETH',
      amount: 1.5,
      status: 'completed',
      timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Ethereum deposit',
      txHash: '0x' + crypto.randomBytes(32).toString('hex')
    },
    {
      id: crypto.randomUUID(),
      userId,
      type: 'withdrawal',
      currency: 'USD',
      amount: 500,
      status: 'completed',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Withdrawal to bank account',
      txHash: 'BANK_' + crypto.randomBytes(16).toString('hex').toUpperCase()
    },
    {
      id: crypto.randomUUID(),
      userId,
      type: 'bonus',
      currency: 'USDT',
      amount: 500,
      status: 'completed',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      description: 'Trading competition reward',
      txHash: 'BONUS_' + crypto.randomBytes(16).toString('hex').toUpperCase()
    }
  ]
  
  return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}
